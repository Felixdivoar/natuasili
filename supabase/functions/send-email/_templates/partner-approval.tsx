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
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface PartnerApprovalEmailProps {
  partnerName: string
  organizationName: string
  status: 'approved' | 'rejected' | 'requires_documents'
  dashboardUrl: string
  message?: string
}

export const PartnerApprovalEmail = ({
  partnerName,
  organizationName,
  status,
  dashboardUrl,
  message,
}: PartnerApprovalEmailProps) => (
  <Html>
    <Head />
    <Preview>
      {status === 'approved' ? 'Welcome to NatuAsili!' : 'Application Status Update'}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {status === 'approved' ? '🎉 Welcome to NatuAsili!' : 'Application Update'}
        </Heading>
        <Text style={text}>Dear {partnerName},</Text>
        
        {status === 'approved' && (
          <>
            <Text style={text}>
              Congratulations! Your partner application for <strong>{organizationName}</strong> has been approved.
            </Text>
            <Text style={text}>
              You can now start creating conservation experiences and connecting with impact-driven travelers.
            </Text>
            <Button style={button} href={dashboardUrl}>
              Access Your Dashboard
            </Button>
          </>
        )}

        {status === 'rejected' && (
          <>
            <Text style={text}>
              Thank you for your interest in partnering with NatuAsili. After careful review, we are unable to approve your application for <strong>{organizationName}</strong> at this time.
            </Text>
            {message && (
              <Text style={text}>
                <strong>Additional Information:</strong> {message}
              </Text>
            )}
          </>
        )}

        {status === 'requires_documents' && (
          <>
            <Text style={text}>
              Your partner application for <strong>{organizationName}</strong> requires additional documentation before we can complete the review process.
            </Text>
            {message && (
              <Text style={text}>
                <strong>Required Documents:</strong> {message}
              </Text>
            )}
            <Button style={button} href={dashboardUrl}>
              Upload Documents
            </Button>
          </>
        )}

        <Text style={footer}>
          Best regards,<br />
          The NatuAsili Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default PartnerApprovalEmail

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

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '48px 0 0 0',
}