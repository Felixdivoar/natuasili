import { supabase } from '@/integrations/supabase/client'

interface EmailData {
  // Partner Application
  partnerName?: string
  organizationName?: string
  applicationId?: string
  
  // Partner Approval
  status?: 'approved' | 'rejected' | 'requires_documents' | 'pending'
  dashboardUrl?: string
  message?: string
  
  // Booking Confirmation
  customerName?: string
  experienceTitle?: string
  bookingDate?: string
  participants?: number
  totalAmount?: number
  bookingId?: string
  location?: string
  
  // Welcome
  userName?: string
  userRole?: 'traveler' | 'partner'
  
  // Withdrawal Notification
  amount?: number
  requestId?: string
}

export const sendEmail = async (
  type: 'partner-application' | 'partner-approval' | 'booking-confirmation' | 'welcome' | 'withdrawal-notification',
  to: string,
  data: EmailData
) => {
  try {
    const { data: response, error } = await supabase.functions.invoke('send-email', {
      body: {
        type,
        to,
        data,
      },
    })

    if (error) {
      console.error('Email sending error:', error)
      throw error
    }

    console.log('Email sent successfully:', response)
    return response
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

// Convenience functions for specific email types
export const sendPartnerApplicationEmail = async (
  adminEmails: string[],
  data: {
    partnerName: string
    organizationName: string
    applicationId: string
  }
) => {
  const promises = adminEmails.map(email =>
    sendEmail('partner-application', email, data)
  )
  return Promise.all(promises)
}

export const sendPartnerApprovalEmail = async (
  partnerEmail: string,
  data: {
    partnerName: string
    organizationName: string
    status: 'approved' | 'rejected' | 'requires_documents'
    dashboardUrl: string
    message?: string
  }
) => {
  return sendEmail('partner-approval', partnerEmail, data)
}

export const sendBookingConfirmationEmail = async (
  customerEmail: string,
  data: {
    customerName: string
    experienceTitle: string
    partnerName: string
    bookingDate: string
    participants: number
    totalAmount: number
    bookingId: string
    location: string
  }
) => {
  return sendEmail('booking-confirmation', customerEmail, data)
}

export const sendWelcomeEmail = async (
  userEmail: string,
  data: {
    userName: string
    userRole: 'traveler' | 'partner'
    dashboardUrl?: string
  }
) => {
  return sendEmail('welcome', userEmail, data)
}

export const sendWithdrawalNotificationEmail = async (
  recipientEmail: string,
  data: {
    partnerName: string
    amount: number
    status: 'pending' | 'approved' | 'rejected'
    requestId: string
    message?: string
  }
) => {
  return sendEmail('withdrawal-notification', recipientEmail, data)
}