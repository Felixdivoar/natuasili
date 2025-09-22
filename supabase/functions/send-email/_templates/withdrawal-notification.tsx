import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
  Section,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface WithdrawalNotificationEmailProps {
  partnerName: string
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  requestId: string
  message?: string
}

export const WithdrawalNotificationEmail = ({
  partnerName,
  amount,
  status,
  requestId,
  message,
}: WithdrawalNotificationEmailProps) => (
  <Html>
    <Head />
    <Preview>
      {status === 'pending' 
        ? 'New withdrawal request' 
        : `Withdrawal request ${status}`
      }
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>
          {status === 'pending' && '💰 New Withdrawal Request'}
          {status === 'approved' && '✅ Withdrawal Approved'}
          {status === 'rejected' && '❌ Withdrawal Request Update'}
        </Heading>
        
        {status === 'pending' ? (
          <>
            <Text style={text}>
              A new withdrawal request has been submitted by {partnerName} and requires admin review.
            </Text>
            <Section style={infoBox}>
              <Text style={infoText}>
                <strong>Partner:</strong> {partnerName}
              </Text>
              <Text style={infoText}>
                <strong>Amount:</strong> KES {amount.toLocaleString()}
              </Text>
              <Text style={infoText}>
                <strong>Request ID:</strong> {requestId}
              </Text>
            </Section>
            <Text style={text}>
              Please log in to the admin dashboard to review and process this withdrawal request.
            </Text>
          </>
        ) : (
          <>
            <Text style={text}>Dear {partnerName},</Text>
            <Text style={text}>
              Your withdrawal request for <strong>KES {amount.toLocaleString()}</strong> has been {status}.
            </Text>
            
            {status === 'approved' && (
              <Text style={text}>
                Your funds will be transferred to your registered bank account within 2-3 business days.
              </Text>
            )}
            
            {message && (
              <Section style={messageBox}>
                <Text style={messageTitle}>Additional Information:</Text>
                <Text style={messageText}>{message}</Text>
              </Section>
            )}
            
            <Text style={text}>
              <strong>Request ID:</strong> {requestId}
            </Text>
            
            {status === 'rejected' && (
              <Text style={text}>
                If you have questions about this decision, please contact our support team.
              </Text>
            )}
          </>
        )}

        <Text style={footer}>
          {status === 'pending' 
            ? 'NatuAsili Admin Team'
            : 'Best regards,\nThe NatuAsili Team'
          }
        </Text>
      </Container>
    </Body>
  </Html>
)

export default WithdrawalNotificationEmail

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

const infoBox = {
  backgroundColor: '#f8f9fa',
  border: '1px solid #e9ecef',
  borderRadius: '8px',
  padding: '24px',
  margin: '24px 0',
}

const messageBox = {
  backgroundColor: '#fff3cd',
  border: '1px solid #ffeaa7',
  borderRadius: '8px',
  padding: '16px',
  margin: '24px 0',
}

const infoText = {
  color: '#495057',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
}

const messageTitle = {
  color: '#856404',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
}

const messageText = {
  color: '#856404',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '0',
}

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '48px 0 0 0',
  whiteSpace: 'pre-line' as const,
}