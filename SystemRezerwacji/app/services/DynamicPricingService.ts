import { supabase } from '../lib/supabase';

interface DemandFactors {
  seasonality: number;
  dayOfWeek: number;
  occupancyRate: number;
  specialEvents: number;
}

export class DynamicPricingService {
  private static readonly WEIGHT = {
    seasonality: 0.3,
    dayOfWeek: 0.2,
    occupancyRate: 0.3,
    specialEvents: 0.2,
  };

  private static async calculateSeasonalityFactor(date: Date): Promise<number> {
    const month = date.getMonth();
    // High season: June to August (months 5-7)
    if (month >= 5 && month <= 7) return 1.3;
    // Shoulder season: April, May, September, October (months 3,4,8,9)
    if ([3, 4, 8, 9].includes(month)) return 1.1;
    // Low season: rest of the year
    return 1.0;
  }

  private static calculateDayOfWeekFactor(date: Date): number {
    const day = date.getDay();
    // Weekend premium
    if (day === 5 || day === 6) return 1.2;
    return 1.0;
  }

  private static async calculateOccupancyRate(
    propertyId: string,
    date: Date
  ): Promise<number> {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const { data: bookings } = await supabase
      .from('bookings')
      .select('start_date, end_date')
      .eq('property_id', propertyId)
      .gte('start_date', startOfMonth.toISOString())
      .lte('end_date', endOfMonth.toISOString());

    if (!bookings) return 1.0;

    const daysInMonth = endOfMonth.getDate();
    const bookedDays = new Set<number>();

    bookings.forEach(booking => {
      const start = new Date(booking.start_date);
      const end = new Date(booking.end_date);
      
      for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
        if (d.getMonth() === date.getMonth()) {
          bookedDays.add(d.getDate());
        }
      }
    });

    const occupancyRate = bookedDays.size / daysInMonth;
    return occupancyRate >= 0.8 ? 1.3 : 
           occupancyRate >= 0.5 ? 1.1 : 1.0;
  }

  private static async checkSpecialEvents(date: Date): Promise<number> {
    const { data: events } = await supabase
      .from('special_events')
      .select('impact_factor')
      .lte('start_date', date.toISOString())
      .gte('end_date', date.toISOString())
      .order('impact_factor', { ascending: false })
      .limit(1);

    return events && events.length > 0 ? events[0].impact_factor : 1.0;
  }

  public static async calculateDynamicPrice(
    propertyId: string,
    basePrice: number,
    date: Date
  ): Promise<number> {
    const factors: DemandFactors = {
      seasonality: await this.calculateSeasonalityFactor(date),
      dayOfWeek: this.calculateDayOfWeekFactor(date),
      occupancyRate: await this.calculateOccupancyRate(propertyId, date),
      specialEvents: await this.checkSpecialEvents(date),
    };

    const multiplier = Object.entries(factors).reduce(
      (acc, [key, value]) => acc + value * this.WEIGHT[key as keyof DemandFactors],
      0
    );

    const dynamicPrice = basePrice * multiplier;
    return Math.round(dynamicPrice);
  }

  public static async updateDynamicPrices(): Promise<void> {
    const { data: properties } = await supabase
      .from('properties')
      .select('id, price');

    if (!properties) return;

    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    for (const property of properties) {
      for (let date = new Date(today); date <= nextMonth; date.setDate(date.getDate() + 1)) {
        const dynamicPrice = await this.calculateDynamicPrice(
          property.id,
          property.price,
          date
        );

        await supabase.from('dynamic_pricing').upsert({
          property_id: property.id,
          date: date.toISOString().split('T')[0],
          price: dynamicPrice,
          updated_at: new Date().toISOString(),
        });
      }
    }
  }
} 