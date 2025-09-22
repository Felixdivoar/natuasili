interface PartnerApprovalEmailProps {
  partnerName: string
  organizationName: string
  status: 'approved' | 'rejected' | 'requires_documents'
  dashboardUrl: string
  message?: string
}

export const partnerApprovalTemplate = (props: PartnerApprovalEmailProps): string => {
  const getHeading = () => {
    switch (props.status) {
      case 'approved': return '🎉 Welcome to NatuAsili!'
      case 'rejected': return 'Application Update'
      case 'requires_documents': return 'Additional Documents Required'
      default: return 'Application Update'
    }
  }

  const getContent = () => {
    switch (props.status) {
      case 'approved':
        return `
          <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
            Congratulations! Your partner application for <strong>${props.organizationName}</strong> has been approved.
          </p>
          <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
            You can now start creating conservation experiences and connecting with impact-driven travelers.
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${props.dashboardUrl}" 
               style="background-color: #22c55e; border-radius: 8px; color: #fff; font-size: 16px; font-weight: bold; text-decoration: none; display: inline-block; padding: 12px 24px;">
              Access Your Dashboard
            </a>
          </div>`
      case 'rejected':
        return `
          <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
            Thank you for your interest in partnering with NatuAsili. After careful review, we are unable to approve your application for <strong>${props.organizationName}</strong> at this time.
          </p>
          ${props.message ? `
            <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
              <strong>Additional Information:</strong> ${props.message}
            </p>` : ''}`
      case 'requires_documents':
        return `
          <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
            Your partner application for <strong>${props.organizationName}</strong> requires additional documentation before we can complete the review process.
          </p>
          ${props.message ? `
            <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
              <strong>Required Documents:</strong> ${props.message}
            </p>` : ''}
          <div style="text-align: center; margin: 24px 0;">
            <a href="${props.dashboardUrl}" 
               style="background-color: #22c55e; border-radius: 8px; color: #fff; font-size: 16px; font-weight: bold; text-decoration: none; display: inline-block; padding: 12px 24px;">
              Upload Documents
            </a>
          </div>`
      default:
        return ''
    }
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${props.status === 'approved' ? 'Welcome to NatuAsili!' : 'Application Status Update'}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px 0 48px; margin-bottom: 64px;">
    <div style="padding: 0 40px;">
      <h1 style="color: #333; font-size: 24px; font-weight: bold; margin: 40px 0; padding: 0;">
        ${getHeading()}
      </h1>
      
      <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
        Dear ${props.partnerName},
      </p>
      
      ${getContent()}
      
      <p style="color: #8898aa; font-size: 14px; line-height: 24px; margin: 48px 0 0 0;">
        Best regards,<br />
        The NatuAsili Team
      </p>
    </div>
  </div>
</body>
</html>`
}