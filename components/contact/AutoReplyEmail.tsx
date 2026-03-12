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
    body: 'Thanks for reaching out through my portfolio.\nI received your message and will get back to you soon.',
    closing: 'Best regards,',
    signature: 'Anh',
  },
  vi: {
    preview: (name: string) =>
      `Xin chào ${name}, cảm ơn bạn đã liên hệ!`,
    subject: 'Cảm ơn bạn đã liên hệ',
    greeting: (name: string) => `Xin chào ${name},`,
    body: 'Cảm ơn bạn đã liên hệ qua portfolio của tôi.\nTôi đã nhận được tin nhắn và sẽ phản hồi sớm nhất có thể.',
    closing: 'Trân trọng,',
    signature: 'Anh',
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
          <Section style={box}>
            <Text style={paragraph}>
              {t.greeting(firstName)}
            </Text>
            {t.body.split('\n').map((line, i) => (
              <Text key={i} style={paragraph}>
                {line}
              </Text>
            ))}
            <Hr style={hr} />
            <Text style={paragraph}>
              {t.closing}
              <br />
              {t.signature}
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
