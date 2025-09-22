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

interface PartnerApplicationEmailProps {
  partnerName: string
  organizationName: string
  applicationId: string
}

export const PartnerApplicationEmail = ({
  partnerName,
  organizationName,
  applicationId,
}: PartnerApplicationEmailProps) => (
  <Html>
    <Head />
    <Preview>New partner application from {organizationName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Partner Application</Heading>
        <Text style={text}>
          A new partner application has been submitted and requires your review:
        </Text>
        <Section style={infoBox}>
          <Text style={infoText}>
            <strong>Partner:</strong> {partnerName}
          </Text>
          <Text style={infoText}>
            <strong>Organization:</strong> {organizationName}
          </Text>
          <Text style={infoText}>
            <strong>Application ID:</strong> {applicationId}
          </Text>
        </Section>
        <Text style={text}>
          Please log in to the admin dashboard to review the application and uploaded documents.
        </Text>
        <Text style={footer}>
          NatuAsili - Conservation Tourism Platform
        </Text>
      </Container>
    </Body>
  </Html>
)

export default PartnerApplicationEmail

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

const infoText = {
  color: '#495057',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '48px 0 0 0',
}