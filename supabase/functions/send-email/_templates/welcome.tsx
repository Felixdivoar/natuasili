import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Button,
  Section,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WelcomeEmailProps {
  userName: string
  userRole: 'traveler' | 'partner'
  dashboardUrl?: string
}

export const WelcomeEmail = ({
  userName,
  userRole,
  dashboardUrl,
}: WelcomeEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to NatuAsili - Conservation Tourism Platform</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Welcome to NatuAsili! 🌿</Heading>
        <Text style={text}>Dear {userName},</Text>
        
        {userRole === 'traveler' ? (
          <>
            <Text style={text}>
              Welcome to Kenya's leading platform for conservation tourism! We're excited to help you discover meaningful travel experiences that support wildlife conservation and local communities.
            </Text>
            <Section style={featureBox}>
              <Text style={featureTitle}>What you can do:</Text>
              <Text style={featureText}>🦒 Discover unique conservation experiences</Text>
              <Text style={featureText}>🌍 Support local conservation efforts</Text>
              <Text style={featureText}>📱 Track your conservation impact</Text>
              <Text style={featureText}>⭐ Connect with verified conservation partners</Text>
            </Section>
            <Text style={text}>
              Start exploring conservation experiences and make a positive impact with every booking!
            </Text>
          </>
        ) : (
          <>
            <Text style={text}>
              Welcome to the NatuAsili partner community! You've taken the first step toward connecting with impact-driven travelers who care about conservation.
            </Text>
            <Section style={featureBox}>
              <Text style={featureTitle}>Next steps:</Text>
              <Text style={featureText}>📋 Complete your partner application</Text>
              <Text style={featureText">🏞️ Add your conservation experiences</Text>
              <Text style={featureText}>💰 Start receiving bookings and payments</Text>
              <Text style={featureText}>📊 Track your impact and earnings</Text>
            </Section>
            {dashboardUrl && (
              <Button style={button} href={dashboardUrl}>
                Access Partner Dashboard
              </Button>
            )}
          </>
        )}

        <Text style={text}>
          If you have any questions, our team is here to help. Simply reply to this email or contact us through our support channels.
        </Text>

        <Text style={footer}>
          Welcome aboard!<br />
          The NatuAsili Team<br />
          <Link href="https://natuasili.com" style={link}>natuasili.com</Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export default WelcomeEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const featureBox = {
  backgroundColor: '#f0fdf4',
  border: '1px solid #22c55e',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const featureTitle = {
  color: '#15803d',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
}

const featureText = {
  color: '#166534',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
}

const button = {
  backgroundColor: '#22c55e',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
  margin: '24px 0',
}

const link = {
  color: '#22c55e',
  textDecoration: 'underline',
}

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '48px 0 0 0',
}