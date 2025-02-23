import NotificationService from '../services/NotificationService';

const BookingScreen = () => {
  const bookingMutation = useMutation({
    mutationFn: async (bookingData) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) throw error;

      // Schedule notifications
      await NotificationService.sendBookingConfirmation();
      await NotificationService.scheduleBookingNotification({
        checkIn: bookingData.start_date,
        propertyName: listing.title,
      });

      return data;
    },
    onSuccess: () => {
      router.push('/booking-confirmation');
    },
  });
}; 