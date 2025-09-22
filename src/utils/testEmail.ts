import { sendWelcomeEmail } from '@/lib/email'

// Test function to send welcome email
export const testWelcomeEmail = async () => {
  try {
    console.log('Testing welcome email...')
    
    const result = await sendWelcomeEmail('test@example.com', {
      userName: 'Test User',
      userRole: 'traveler'
    })
    
    console.log('Welcome email sent successfully:', result)
    return result
  } catch (error) {
    console.error('Failed to send welcome email:', error)
    throw error
  }
}