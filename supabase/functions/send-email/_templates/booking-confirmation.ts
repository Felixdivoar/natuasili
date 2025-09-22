interface BookingConfirmationEmailProps {
  customerName: string
  experienceTitle: string
  partnerName: string
  bookingDate: string
  participants: number
  totalAmount: number
  bookingId: string
  location: string
}

export const bookingConfirmationTemplate = (props: BookingConfirmationEmailProps): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Booking Confirmed</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px 0 48px; margin-bottom: 64px;">
    <div style="padding: 0 40px;">
      <h1 style="color: #333; font-size: 24px; font-weight: bold; margin: 40px 0; padding: 0;">
        Booking Confirmed! 🎉
      </h1>
      
      <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
        Dear ${props.customerName},
      </p>
      
      <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
        Thank you for booking with NatuAsili! Your conservation experience has been confirmed.
      </p>
      
      <div style="background-color: #f8f9fa; border: 2px solid #22c55e; border-radius: 12px; padding: 24px; margin: 24px 0;">
        <h2 style="color: #22c55e; font-size: 20px; font-weight: bold; margin: 0 0 16px 0;">
          ${props.experienceTitle}
        </h2>
        
        <p style="color: #495057; font-size: 14px; line-height: 24px; margin: 8px 0;">
          <strong>Partner:</strong> ${props.partnerName}
        </p>
        <p style="color: #495057; font-size: 14px; line-height: 24px; margin: 8px 0;">
          <strong>Date:</strong> ${props.bookingDate}
        </p>
        <p style="color: #495057; font-size: 14px; line-height: 24px; margin: 8px 0;">
          <strong>Location:</strong> ${props.location}
        </p>
        <p style="color: #495057; font-size: 14px; line-height: 24px; margin: 8px 0;">
          <strong>Participants:</strong> ${props.participants}
        </p>
        
        <hr style="border-color: #e9ecef; margin: 16px 0;">
        
        <p style="color: #22c55e; font-size: 18px; font-weight: bold; margin: 16px 0 8px 0;">
          <strong>Total Amount:</strong> KES ${props.totalAmount.toLocaleString()}
        </p>
        <p style="color: #6c757d; font-size: 12px; margin: 8px 0 0 0;">
          <strong>Booking ID:</strong> ${props.bookingId}
        </p>
      </div>
      
      <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
        <strong>What's Next?</strong>
      </p>
      <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
        • You'll receive contact details from ${props.partnerName} within 24 hours<br>
        • Please arrive 15 minutes before your scheduled time<br>
        • Bring comfortable clothing and any specified equipment<br>
        • Your booking contributes directly to conservation efforts
      </p>
      
      <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
        If you have any questions, please don't hesitate to contact us or your experience partner.
      </p>
      
      <p style="color: #8898aa; font-size: 14px; line-height: 24px; margin: 48px 0 0 0;">
        Thank you for choosing conservation tourism!<br />
        The NatuAsili Team
      </p>
    </div>
  </div>
</body>
</html>`
}