import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface Props {
  firstName: string
  lastName: string
  service: string
  email: string
  phone: string
}

export const ContactNotificationEmail = ({
  firstName,
  lastName,
  service,
  email,
  phone,
}: Props) => (
  <Html>
    <Head />
    <Preview>
      {firstName} {lastName} just contacted you via your
      portfolio website!
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={box}>
          <Text style={paragraph}>
            🚨 <strong>New Contact Request</strong>
          </Text>
          <Hr style={hr} />
          <Text style={paragraph}>
            You just received a new message through your
            website contact form. Here&rsquo;s the info:
          </Text>
          <Text style={paragraph}>
            <strong>Name:</strong> {firstName} {lastName}
            <br />
            <strong>Email:</strong> {email}
            <br />
            <strong>Phone:</strong> {phone}
            <br />
            <strong>Interested in:</strong> {service}
          </Text>
          <Hr style={hr} />
          <Text style={paragraph}>
            Go follow up with them soon 🚀
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ContactNotificationEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
}

const box = {
  padding: '0 48px',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
}
