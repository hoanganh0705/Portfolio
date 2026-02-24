import './globals.css'

// Root layout is a passthrough — html/body/providers live in app/[locale]/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
