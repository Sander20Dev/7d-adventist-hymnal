import type { Metadata } from 'next'
import { Rosario } from 'next/font/google'
import './globals.css'

const rosario = Rosario({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Himnario Adventista',
  description:
    'Es un sitio web hecho para la comodidad al momento de escuchar un himno sin la necesidad de buscarlo como video o descargar un programa para reproducirlos.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={rosario.className}>{children}</body>
    </html>
  )
}
