import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { theme } from '../theme';

interface DateRangePickerProps {
  onChange: (range: { startDate: Date | null; endDate: Date | null }) => void;
  propertyId: string;
}

const DateRangePicker = ({ onChange, propertyId }: DateRangePickerProps) => {
  const [selected, setSelected] = React.useState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: null,
    endDate: null,
  });

  // Fetch existing bookings
  const { data: bookedDates } = useQuery(['bookings', propertyId], async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('start_date, end_date')
      .eq('property_id', propertyId)
      .eq('status', 'confirmed');

    if (error) throw error;
    return data;
  });

  // Create marked dates object for calendar
  const markedDates = React.useMemo(() => {
    const dates: any = {};

    // Mark booked dates
    bookedDates?.forEach(booking => {
      const start = new Date(booking.start_date);
      const end = new Date(booking.end_date);
      
      for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
        dates[date.toISOString().split('T')[0]] = { disabled: true };
      }
    });

    // Mark selected range
    if (selected.startDate) {
      dates[selected.startDate] = {
        selected: true,
        startingDay: true,
        color: theme.colors.primary,
      };
    }

    if (selected.endDate) {
      dates[selected.endDate] = {
        selected: true,
        endingDay: true,
        color: theme.colors.primary,
      };
    }

    return dates;
  }, [selected, bookedDates]);

  const onDayPress = (day: any) => {
    if (!selected.startDate || (selected.startDate && selected.endDate)) {
      setSelected({
        startDate: day.dateString,
        endDate: null,
      });
      onChange({
        startDate: new Date(day.dateString),
        endDate: null,
      });
    } else {
      setSelected({
        ...selected,
        endDate: day.dateString,
      });
      onChange({
        startDate: new Date(selected.startDate),
        endDate: new Date(day.dateString),
      });
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        markingType="period"
        markedDates={markedDates}
        onDayPress={onDayPress}
        minDate={new Date().toISOString().split('T')[0]}
        theme={{
          todayTextColor: theme.colors.primary,
          selectedDayBackgroundColor: theme.colors.primary,
          selectedDayTextColor: '#fff',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    backgroundColor: '#fff',
  },
});

export default DateRangePicker; 