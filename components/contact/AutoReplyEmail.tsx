import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface AutoReplyEmailProps {
  firstName: string
  locale: 'en' | 'vi'
}

const content = {
  en: {
    preview: (name: string) =>
      `Hi ${name}, thanks for reaching out!`,
    subject: 'Thanks for contacting me',
    greeting: (name: string) => `Hi ${name},`,
    body: 'Thanks for reaching out through my portfolio.\nI received your message and will get back to you as soon as possible — usually within 24 hours.',
    closing: 'Best regards,',
    signature: 'Anh Nguyen',
    footerText: 'This is an automated reply from',
    footerBrand: 'anhnguyendev.me',
  },
  vi: {
    preview: (name: string) =>
      `Xin chào ${name}, cảm ơn bạn đã liên hệ!`,
    subject: 'Cảm ơn bạn đã liên hệ',
    greeting: (name: string) => `Xin chào ${name},`,
    body: 'Cảm ơn bạn đã liên hệ qua portfolio của tôi.\nTôi đã nhận được tin nhắn và sẽ phản hồi sớm nhất có thể — thường trong vòng 24 giờ.',
    closing: 'Trân trọng,',
    signature: 'Anh Nguyễn',
    footerText: 'Đây là email tự động từ',
    footerBrand: 'anhnguyendev.me',
  },
} as const

export function AutoReplyEmail({
  firstName,
  locale,
}: AutoReplyEmailProps) {
  const t = content[locale]

  return (
    <Html>
      <Head />
      <Preview>{t.preview(firstName)}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logoText}>
              Anh Nguyen<span style={logoDot}>.</span>
            </Text>
          </Section>

          {/* Accent bar */}
          <Section style={accentBar} />

          {/* Body */}
          <Section style={body}>
            <Text style={greeting}>
              {t.greeting(firstName)}
            </Text>
            {t.body.split('\n').map((line, i) => (
              <Text key={i} style={paragraph}>
                {line}
              </Text>
            ))}
            <Hr style={hr} />
            <Text style={closingText}>{t.closing}</Text>
            <Text style={signatureText}>{t.signature}</Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              {t.footerText}{' '}
              <Link
                href='https://anhnguyendev.me'
                style={footerLink}
              >
                {t.footerBrand}
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

/** Returns the subject line for the auto-reply in the given locale */
export function getAutoReplySubject(
  locale: 'en' | 'vi',
): string {
  return content[locale].subject
}

// ── Brand colors ──
const ACCENT = '#00b894'
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
  padding: '32px 48px',
  textAlign: 'center' as const,
}

const logoText = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '700' as const,
  margin: '0',
  letterSpacing: '-0.5px',
}

const logoDot = {
  color: ACCENT,
}

const accentBar = {
  backgroundColor: ACCENT,
  height: '4px',
  margin: '0',
  padding: '0',
}

const body = {
  padding: '40px 48px 32px',
}

const greeting = {
  color: BODY_TEXT,
  fontSize: '20px',
  fontWeight: '600' as const,
  lineHeight: '28px',
  margin: '0 0 20px',
}

const paragraph = {
  color: BODY_TEXT,
  fontSize: '16px',
  lineHeight: '26px',
  textAlign: 'left' as const,
  margin: '0 0 16px',
}

const hr = {
  borderColor: '#e8ecf0',
  margin: '28px 0',
}

const closingText = {
  color: MUTED_TEXT,
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 4px',
}

const signatureText = {
  color: ACCENT,
  fontSize: '18px',
  fontWeight: '600' as const,
  lineHeight: '24px',
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
