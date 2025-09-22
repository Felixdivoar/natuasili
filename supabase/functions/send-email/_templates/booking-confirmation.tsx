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
  Hr,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

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

export const BookingConfirmationEmail = ({
  customerName,
  experienceTitle,
  partnerName,
  bookingDate,
  participants,
  totalAmount,
  bookingId,
  location,
}: BookingConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Booking confirmed for {experienceTitle}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Booking Confirmed! 🎉</Heading>
        <Text style={text}>Dear {customerName},</Text>
        <Text style={text}>
          Thank you for booking with NatuAsili! Your conservation experience has been confirmed.
        </Text>
        
        <Section style={bookingBox}>
          <Heading style={h2}>{experienceTitle}</Heading>
          <Text style={bookingText}>
            <strong>Partner:</strong> {partnerName}
          </Text>
          <Text style={bookingText}>
            <strong>Date:</strong> {bookingDate}
          </Text>
          <Text style={bookingText}>
            <strong>Location:</strong> {location}
          </Text>
          <Text style={bookingText}>
            <strong>Participants:</strong> {participants}
          </Text>
          <Hr style={hr} />
          <Text style={totalText}>
            <strong>Total Amount:</strong> KES {totalAmount.toLocaleString()}
          </Text>
          <Text style={bookingIdText}>
            <strong>Booking ID:</strong> {bookingId}
          </Text>
        </Section>

        <Text style={text}>
          <strong>What's Next?</strong>
        </Text>
        <Text style={text}>
          • You'll receive contact details from {partnerName} within 24 hours
          • Please arrive 15 minutes before your scheduled time
          • Bring comfortable clothing and any specified equipment
          • Your booking contributes directly to conservation efforts
        </Text>

        <Text style={text}>
          If you have any questions, please don't hesitate to contact us or your experience partner.
        </Text>

        <Text style={footer}>
          Thank you for choosing conservation tourism!<br />
          The NatuAsili Team
        </Text>
      </Container>
    </Body>
  </Html>
)

export default BookingConfirmationEmail

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

const h2 = {
  color: '#22c55e',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 16px 0',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
}

const bookingBox = {
  backgroundColor: '#f8f9fa',
  border: '2px solid #22c55e',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
}

const bookingText = {
  color: '#495057',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '8px 0',
}

const totalText = {
  color: '#22c55e',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '16px 0 8px 0',
}

const bookingIdText = {
  color: '#6c757d',
  fontSize: '12px',
  margin: '8px 0 0 0',
}

const hr = {
  borderColor: '#e9ecef',
  margin: '16px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '48px 0 0 0',
}