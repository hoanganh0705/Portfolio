import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
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
  message: string
  locale: string
}

export const ContactNotificationEmail = ({
  firstName,
  lastName,
  service,
  email,
  phone,
  message,
  locale,
}: Props) => (
  <Html>
    <Head />
    <Preview>
      {firstName} {lastName} just contacted you via your
      portfolio website!
    </Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Text style={logoText}>
            Anh Nguyen<span style={logoDot}>.</span>
          </Text>
          <Text style={headerSubtitle}>
            New Contact Request
          </Text>
        </Section>

        {/* Accent bar */}
        <Section style={accentBar} />

        {/* Body */}
        <Section style={body}>
          <Text style={introText}>
            You just received a new message through your
            website contact form. Here&rsquo;s the details:
          </Text>

          {/* Info Card */}
          <Section style={infoCard}>
            <Text style={infoRow}>
              <span style={infoLabel}>Name</span>
              <br />
              <span style={infoValue}>
                {firstName} {lastName}
              </span>
            </Text>
            <Hr style={infoHr} />
            <Text style={infoRow}>
              <span style={infoLabel}>Email</span>
              <br />
              <Link
                href={`mailto:${email}`}
                style={infoLink}
              >
                {email}
              </Link>
            </Text>
            <Hr style={infoHr} />
            <Text style={infoRow}>
              <span style={infoLabel}>Phone</span>
              <br />
              <span style={infoValue}>{phone}</span>
            </Text>
            <Hr style={infoHr} />
            <Text style={infoRow}>
              <span style={infoLabel}>Interested in</span>
              <br />
              <span style={serviceValue}>{service}</span>
            </Text>
            <Hr style={infoHr} />
            <Text style={infoRow}>
              <span style={infoLabel}>Locale</span>
              <br />
              <span style={infoValue}>{locale}</span>
            </Text>
          </Section>

          {message && (
            <>
              <Text style={messageLabel}>Message</Text>
              <Section style={messageCard}>
                <Text style={messageText}>{message}</Text>
              </Section>
            </>
          )}

          <Hr style={hr} />
          <Text style={ctaText}>
            Go follow up with them soon
          </Text>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            Notification from{' '}
            <Link
              href='https://anhnguyendev.me'
              style={footerLink}
            >
              anhnguyendev.me
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

export default ContactNotificationEmail

// ── Brand colors ──
const ACCENT = '#c3d3b7'
const DARK_BG = '#1e1e2e'
const BODY_TEXT = '#2d3436'
const MUTED_TEXT = '#636e72'

const main = {
  backgroundColor: '#f0f2f5',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: '40px 0',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  maxWidth: '600px',
  borderRadius: '8px',
  overflow: 'hidden' as const,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
}

const header = {
  backgroundColor: DARK_BG,
  padding: '32px 48px 24px',
  textAlign: 'center' as const,
}

const logoText = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '700' as const,
  margin: '0 0 8px',
  letterSpacing: '-0.5px',
}

const logoDot = {
  color: ACCENT,
}

const headerSubtitle = {
  color: ACCENT,
  fontSize: '14px',
  fontWeight: '500' as const,
  margin: '0',
  textTransform: 'uppercase' as const,
  letterSpacing: '2px',
}

const accentBar = {
  backgroundColor: ACCENT,
  height: '4px',
  margin: '0',
  padding: '0',
}

const body = {
  padding: '36px 48px 28px',
}

const introText = {
  color: MUTED_TEXT,
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0 0 24px',
}

const infoCard = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px 24px',
  border: '1px solid #e8ecf0',
  marginBottom: '24px',
}

const infoRow = {
  margin: '0',
  fontSize: '15px',
  lineHeight: '22px',
}

const infoLabel = {
  color: MUTED_TEXT,
  fontSize: '12px',
  fontWeight: '600' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}

const infoValue = {
  color: BODY_TEXT,
  fontSize: '15px',
  fontWeight: '500' as const,
}

const infoLink = {
  color: ACCENT,
  fontSize: '15px',
  fontWeight: '500' as const,
  textDecoration: 'none' as const,
}

const serviceValue = {
  color: ACCENT,
  fontSize: '15px',
  fontWeight: '600' as const,
}

const infoHr = {
  borderColor: '#e8ecf0',
  margin: '12px 0',
}

const messageLabel = {
  color: BODY_TEXT,
  fontSize: '14px',
  fontWeight: '600' as const,
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 8px',
}

const messageCard = {
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
  padding: '20px 24px',
  borderLeft: `4px solid ${ACCENT}`,
  marginBottom: '24px',
}

const messageText = {
  color: BODY_TEXT,
  fontSize: '15px',
  lineHeight: '24px',
  margin: '0',
  whiteSpace: 'pre-wrap' as const,
}

const hr = {
  borderColor: '#e8ecf0',
  margin: '24px 0',
}

const ctaText = {
  color: BODY_TEXT,
  fontSize: '16px',
  fontWeight: '500' as const,
  textAlign: 'center' as const,
  margin: '0',
}

const footer = {
  backgroundColor: '#f8f9fa',
  padding: '20px 48px',
  textAlign: 'center' as const,
  borderTop: '1px solid #e8ecf0',
}

const footerText = {
  color: MUTED_TEXT,
  fontSize: '13px',
  lineHeight: '20px',
  margin: '0',
}

const footerLink = {
  color: ACCENT,
  textDecoration: 'none' as const,
  fontWeight: '500' as const,
}
