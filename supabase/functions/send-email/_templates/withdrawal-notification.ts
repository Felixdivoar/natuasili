interface WithdrawalNotificationEmailProps {
  partnerName: string
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  requestId: string
  message?: string
}

export const withdrawalNotificationTemplate = (props: WithdrawalNotificationEmailProps): string => {
  const getHeading = () => {
    switch (props.status) {
      case 'pending': return '💰 New Withdrawal Request'
      case 'approved': return '✅ Withdrawal Approved'
      case 'rejected': return '❌ Withdrawal Request Update'
      default: return 'Withdrawal Update'
    }
  }

  const getContent = () => {
    if (props.status === 'pending') {
      return `
        <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
          A new withdrawal request has been submitted by ${props.partnerName} and requires admin review.
        </p>
        
        <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 24px; margin: 24px 0;">
          <p style="color: #495057; font-size: 14px; line-height: 24px; margin: 8px 0;">
            <strong>Partner:</strong> ${props.partnerName}
          </p>
          <p style="color: #495057; font-size: 14px; line-height: 24px; margin: 8px 0;">
            <strong>Amount:</strong> KES ${props.amount.toLocaleString()}
          </p>
          <p style="color: #495057; font-size: 14px; line-height: 24px; margin: 8px 0;">
            <strong>Request ID:</strong> ${props.requestId}
          </p>
        </div>
        
        <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
          Please log in to the admin dashboard to review and process this withdrawal request.
        </p>`
    } else {
      return `
        <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
          Dear ${props.partnerName},
        </p>
        
        <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
          Your withdrawal request for <strong>KES ${props.amount.toLocaleString()}</strong> has been ${props.status}.
        </p>
        
        ${props.status === 'approved' ? `
          <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
            Your funds will be transferred to your registered bank account within 2-3 business days.
          </p>` : ''}
        
        ${props.message ? `
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 16px; margin: 24px 0;">
            <p style="color: #856404; font-size: 14px; font-weight: bold; margin: 0 0 8px 0;">
              Additional Information:
            </p>
            <p style="color: #856404; font-size: 14px; line-height: 20px; margin: 0;">
              ${props.message}
            </p>
          </div>` : ''}
        
        <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
          <strong>Request ID:</strong> ${props.requestId}
        </p>
        
        ${props.status === 'rejected' ? `
          <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
            If you have questions about this decision, please contact our support team.
          </p>` : ''}`
    }
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${props.status === 'pending' ? 'New withdrawal request' : `Withdrawal request ${props.status}`}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px 0 48px; margin-bottom: 64px;">
    <div style="padding: 0 40px;">
      <h1 style="color: #333; font-size: 24px; font-weight: bold; margin: 40px 0; padding: 0;">
        ${getHeading()}
      </h1>
      
      ${getContent()}
      
      <p style="color: #8898aa; font-size: 14px; line-height: 24px; margin: 48px 0 0 0; white-space: pre-line;">
        ${props.status === 'pending' 
          ? 'NatuAsili Admin Team'
          : 'Best regards,\nThe NatuAsili Team'
        }
      </p>
    </div>
  </div>
</body>
</html>`
}