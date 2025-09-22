interface PartnerApplicationEmailProps {
  partnerName: string
  organizationName: string
  applicationId: string
}

export const partnerApplicationTemplate = (props: PartnerApplicationEmailProps): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>New Partner Application</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px 0 48px; margin-bottom: 64px;">
    <div style="padding: 0 40px;">
      <h1 style="color: #333; font-size: 24px; font-weight: bold; margin: 40px 0; padding: 0;">
        New Partner Application
      </h1>
      
      <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
        A new partner application has been submitted and requires your review:
      </p>
      
      <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 24px; margin: 24px 0;">
        <p style="color: #495057; font-size: 14px; line-height: 24px; margin: 8px 0;">
          <strong>Partner:</strong> ${props.partnerName}
        </p>
        <p style="color: #495057; font-size: 14px; line-height: 24px; margin: 8px 0;">
          <strong>Organization:</strong> ${props.organizationName}
        </p>
        <p style="color: #495057; font-size: 14px; line-height: 24px; margin: 8px 0;">
          <strong>Application ID:</strong> ${props.applicationId}
        </p>
      </div>
      
      <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
        Please log in to the admin dashboard to review the application and uploaded documents.
      </p>
      
      <p style="color: #8898aa; font-size: 12px; line-height: 16px; margin: 48px 0 0 0;">
        NatuAsili - Conservation Tourism Platform
      </p>
    </div>
  </div>
</body>
</html>`
}