import '../styles/globals.css'

export const metadata = {
  title: 'AI Cartoonize',
  description: 'Turn your drawings into real products!',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  )
}
