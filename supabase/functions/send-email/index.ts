import { serve } from 'https://deno.land/std@0.190.0/http/server.ts'
import { Resend } from 'npm:resend@2.0.0'

// Import email templates
import { partnerApplicationTemplate } from './_templates/partner-application.ts'
import { partnerApprovalTemplate } from './_templates/partner-approval.ts'
import { bookingConfirmationTemplate } from './_templates/booking-confirmation.ts'
import { welcomeTemplate } from './_templates/welcome.ts'
import { withdrawalNotificationTemplate } from './_templates/withdrawal-notification.ts'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  type: 'partner-application' | 'partner-approval' | 'booking-confirmation' | 'welcome' | 'withdrawal-notification'
  to: string
  data: any
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { type, to, data }: EmailRequest = await req.json()

    if (!type || !to) {
      throw new Error('Email type and recipient are required')
    }

    let emailHtml: string
    let subject: string

    switch (type) {
      case 'partner-application':
        emailHtml = partnerApplicationTemplate({
          partnerName: data.partnerName,
          organizationName: data.organizationName,
          applicationId: data.applicationId,
        })
        subject = `New Partner Application - ${data.organizationName}`
        break

      case 'partner-approval':
        emailHtml = partnerApprovalTemplate({
          partnerName: data.partnerName,
          organizationName: data.organizationName,
          status: data.status,
          dashboardUrl: data.dashboardUrl,
          message: data.message,
        })
        subject = data.status === 'approved' 
          ? 'Welcome to NatuAsili - Application Approved!'
          : 'NatuAsili Application Update'
        break

      case 'booking-confirmation':
        emailHtml = bookingConfirmationTemplate({
          customerName: data.customerName,
          experienceTitle: data.experienceTitle,
          partnerName: data.partnerName,
          bookingDate: data.bookingDate,
          participants: data.participants,
          totalAmount: data.totalAmount,
          bookingId: data.bookingId,
          location: data.location,
        })
        subject = `Booking Confirmed - ${data.experienceTitle}`
        break

      case 'welcome':
        emailHtml = welcomeTemplate({
          userName: data.userName,
          userRole: data.userRole,
          dashboardUrl: data.dashboardUrl,
        })
        subject = 'Welcome to NatuAsili - Conservation Tourism Platform'
        break

      case 'withdrawal-notification':
        emailHtml = withdrawalNotificationTemplate({
          partnerName: data.partnerName,
          amount: data.amount,
          status: data.status,
          requestId: data.requestId,
          message: data.message,
        })
        subject = data.status === 'pending'
          ? 'New Withdrawal Request - Admin Review Required'
          : `Withdrawal Request ${data.status.charAt(0).toUpperCase() + data.status.slice(1)}`
        break

      default:
        throw new Error(`Unknown email type: ${type}`)
    }

    const emailResponse = await resend.emails.send({
      from: 'NatuAsili <noreply@natuasili.com>',
      to: [to],
      subject,
      html: emailHtml,
    })

    console.log(`Email sent successfully (${type}):`, emailResponse)

    return new Response(JSON.stringify({ success: true, id: emailResponse.data?.id }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      },
    })
  } catch (error: any) {
    console.error('Error in send-email function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    )
  }
}

serve(handler)