import { Body, Container, Head, Heading, Html, Preview, Section, Text } from '@react-email/components'

interface Props {
  title: string
  verificationCode: string
}

export default function VerificationCodeEmail({ title, verificationCode }: Props) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Preview>Email Verification</Preview>
        <Container style={container}>
          <Section style={coverSection}>
            <Section style={upperSection}>
              <Heading style={h1}>{title}</Heading>
              <Section style={verificationSection}>
                <Text style={verifyText}>Your verification code is:</Text>
                <Text style={codeText}>{verificationCode}</Text>
              </Section>
            </Section>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

VerificationCodeEmail.PreviewProps = {
  title: 'Verification code',
  verificationCode: '596853',
} satisfies Props

const main = {
  backgroundColor: '#fff',
  color: '#212121',
}

const container = {
  padding: '20px',
  margin: '0 auto',
  backgroundColor: '#eee',
}

const h1 = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '20px',
  fontWeight: 'bold',
  marginBottom: '15px',
}

const link = {
  color: '#2754C5',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  textDecoration: 'underline',
}

const text = {
  color: '#333',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: '14px',
  margin: '24px 0',
}

const coverSection = { backgroundColor: '#fff' }

const upperSection = { padding: '25px 35px' }

const verifyText = {
  ...text,
  margin: 0,
  fontWeight: 'bold',
  textAlign: 'center' as const,
}

const codeText = {
  ...text,
  fontWeight: 'bold',
  fontSize: '36px',
  margin: '10px 0',
  textAlign: 'center' as const,
}

const verificationSection = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
