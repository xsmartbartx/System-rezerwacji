import { DynamicPricingService } from './DynamicPricingService';

export class BackgroundJobs {
  private static priceUpdateInterval: NodeJS.Timeout;

  public static startJobs() {
    // Update prices every 6 hours
    this.priceUpdateInterval = setInterval(
      () => DynamicPricingService.updateDynamicPrices(),
      1000 * 60 * 60 * 6
    );

    // Initial update
    DynamicPricingService.updateDynamicPrices();
  }

  public static stopJobs() {
    if (this.priceUpdateInterval) {
      clearInterval(this.priceUpdateInterval);
    }
  }
} 