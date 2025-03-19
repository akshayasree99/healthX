// frontend/src/services/notificationService.js
import { supabase } from '../supabase';
import { sendEmail } from './emailService';

export function setupMedicationReminders() {
  console.log('Medication reminder service initialized');

  const checkMissedMedications = async () => {
    try {
      const { data: medications, error } = await supabase
        .from('medications')
        .select('*, patient!inner(*)')
        .eq('status', 'Pending');

      if (error) {
        throw error;
      }

      const now = new Date();
      for (const med of medications) {
        const medTime = new Date();
        const [hours, minutes] = med.time.split(':');
        medTime.setHours(hours, minutes, 0, 0);

        const timeDiff = (now - medTime) / (1000 * 60); // Difference in minutes
        if (timeDiff > 60) { // More than 1 hour late
          const message = `MEDICATION ALERT: ${med.patient.first_name} ${med.patient.last_name} has missed taking their medication(s): ${med.name}. Please check on them.`;
          await sendEmail(
            med.patient.emergency_email,
            'Missed Medication Alert',
            message
          );

          // Log the notification
          await supabase.from('notification_log').insert([
            {
              patient_id: med.patient_id,
              medication_id: med.id,
              message,
              type: 'email',
              status: 'sent',
            },
          ]);
        }
      }
    } catch (err) {
      console.error('Error checking missed medications:', err);
    }
  };

  // Check immediately and then every 15 minutes
  checkMissedMedications();
  setInterval(checkMissedMedications, 15 * 60 * 1000);
}