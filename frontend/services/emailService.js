// frontend/src/services/emailService.js
import emailjs from '@emailjs/browser';

export async function sendEmail(to, subject, body) {
  try {
    const templateParams = {
      to_email: to,
      subject: subject,
      message: body,
    };

    const response = await emailjs.send(
      'service_6dfkg', // Your EmailJS Service ID
      'template_d8sxtkl', // Replace with your actual Template ID
      templateParams,
      'ui78Icm2yUvrnYco8' // Replace with your actual Public Key
    );

    console.log('Email sent successfully:', response.status, response.text);
    return { status: 200, text: 'Email sent successfully' };
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send email');
  }
}