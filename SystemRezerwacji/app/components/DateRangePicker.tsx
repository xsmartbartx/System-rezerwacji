import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useQuery } from '../hooks/useQuery';
import { supabase } from '../lib/supabase';
import { theme } from '../styles/theme';
import LoadingSpinner from './LoadingSpinner';

interface DateRangePickerProps {
  onChange: (dates: { startDate: Date | null; endDate: Date | null }) => void;
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

  const { data: bookedDates, isLoading } = useQuery(['bookedDates', propertyId], async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select('start_date, end_date')
      .eq('property_id', propertyId)
      .in('status', ['confirmed', 'pending']);

    if (error) throw error;
    return data || [];
  });

  if (isLoading) return <LoadingSpinner />;

  const markedDates = React.useMemo(() => {
    const dates: any = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Mark booked dates
    bookedDates?.forEach(booking => {
      const start = new Date(booking.start_date);
      const end = new Date(booking.end_date);

      for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
        dates[date.toISOString().split('T')[0]] = {
          disabled: true,
          disableTouchEvent: true,
        };
      }
    });

    // Mark selected range
    if (selected.startDate) {
      dates[selected.startDate] = {
        ...dates[selected.startDate],
        selected: true,
        startingDay: true,
        color: theme.colors.primary,
      };
    }

    if (selected.endDate) {
      dates[selected.endDate] = {
        ...dates[selected.endDate],
        selected: true,
        endingDay: true,
        color: theme.colors.primary,
      };

      // Fill in the range
      if (selected.startDate) {
        const start = new Date(selected.startDate);
        const end = new Date(selected.endDate);
        for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
          const dateString = d.toISOString().split('T')[0];
          if (dateString !== selected.startDate && dateString !== selected.endDate) {
            dates[dateString] = {
              ...dates[dateString],
              selected: true,
              color: theme.colors.primary,
            };
          }
        }
      }
    }

    return dates;
  }, [selected, bookedDates]);

  const onDayPress = (day: DateData) => {
    if (!selected.startDate || (selected.startDate && selected.endDate)) {
      // Start new selection
      setSelected({
        startDate: day.dateString,
        endDate: null,
      });
      onChange({
        startDate: new Date(day.dateString),
        endDate: null,
      });
    } else {
      // Complete the range
      const startDate = new Date(selected.startDate);
      const endDate = new Date(day.dateString);

      if (endDate < startDate) {
        // If end date is before start date, swap them
        setSelected({
          startDate: day.dateString,
          endDate: selected.startDate,
        });
        onChange({
          startDate: endDate,
          endDate: startDate,
        });
      } else {
        setSelected({
          ...selected,
          endDate: day.dateString,
        });
        onChange({
          startDate: startDate,
          endDate: endDate,
        });
      }
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
          textDayFontSize: 16,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 14,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default DateRangePicker; 