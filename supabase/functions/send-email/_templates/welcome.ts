interface WelcomeEmailProps {
  userName: string
  userRole: 'traveler' | 'partner'
  dashboardUrl?: string
}

export const welcomeTemplate = (props: WelcomeEmailProps): string => {
  const getContent = () => {
    if (props.userRole === 'traveler') {
      return `
        <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
          Welcome to Kenya's leading platform for conservation tourism! We're excited to help you discover meaningful travel experiences that support wildlife conservation and local communities.
        </p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 24px; margin: 24px 0;">
          <p style="color: #15803d; font-size: 16px; font-weight: bold; margin: 0 0 16px 0;">
            What you can do:
          </p>
          <p style="color: #166534; font-size: 14px; line-height: 24px; margin: 8px 0;">
            🦒 Discover unique conservation experiences
          </p>
          <p style="color: #166534; font-size: 14px; line-height: 24px; margin: 8px 0;">
            🌍 Support local conservation efforts
          </p>
          <p style="color: #166534; font-size: 14px; line-height: 24px; margin: 8px 0;">
            📱 Track your conservation impact
          </p>
          <p style="color: #166534; font-size: 14px; line-height: 24px; margin: 8px 0;">
            ⭐ Connect with verified conservation partners
          </p>
        </div>
        
        <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
          Start exploring conservation experiences and make a positive impact with every booking!
        </p>`
    } else {
      return `
        <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
          Welcome to the NatuAsili partner community! You've taken the first step toward connecting with impact-driven travelers who care about conservation.
        </p>
        
        <div style="background-color: #f0fdf4; border: 1px solid #22c55e; border-radius: 8px; padding: 24px; margin: 24px 0;">
          <p style="color: #15803d; font-size: 16px; font-weight: bold; margin: 0 0 16px 0;">
            Next steps:
          </p>
          <p style="color: #166534; font-size: 14px; line-height: 24px; margin: 8px 0;">
            📋 Complete your partner application
          </p>
          <p style="color: #166534; font-size: 14px; line-height: 24px; margin: 8px 0;">
            🏞️ Add your conservation experiences
          </p>
          <p style="color: #166534; font-size: 14px; line-height: 24px; margin: 8px 0;">
            💰 Start receiving bookings and payments
          </p>
          <p style="color: #166534; font-size: 14px; line-height: 24px; margin: 8px 0;">
            📊 Track your impact and earnings
          </p>
        </div>
        
        ${props.dashboardUrl ? `
          <div style="text-align: center; margin: 24px 0;">
            <a href="${props.dashboardUrl}" 
               style="background-color: #22c55e; border-radius: 8px; color: #fff; font-size: 16px; font-weight: bold; text-decoration: none; display: inline-block; padding: 12px 24px;">
              Access Partner Dashboard
            </a>
          </div>` : ''}`
    }
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Welcome to NatuAsili</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px 0 48px; margin-bottom: 64px;">
    <div style="padding: 0 40px;">
      <h1 style="color: #333; font-size: 24px; font-weight: bold; margin: 40px 0; padding: 0;">
        Welcome to NatuAsili! 🌿
      </h1>
      
      <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
        Dear ${props.userName},
      </p>
      
      ${getContent()}
      
      <p style="color: #333; font-size: 16px; line-height: 26px; margin: 16px 0;">
        If you have any questions, our team is here to help. Simply reply to this email or contact us through our support channels.
      </p>
      
      <p style="color: #8898aa; font-size: 14px; line-height: 24px; margin: 48px 0 0 0;">
        Welcome aboard!<br />
        The NatuAsili Team<br />
        <a href="https://natuasili.com" style="color: #22c55e; text-decoration: underline;">natuasili.com</a>
      </p>
    </div>
  </div>
</body>
</html>`
}