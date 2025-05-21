export const metadata = {
  title: 'Modern OnePage',
  description: 'Nowoczesna strona one-page w Next.js',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  )
} 