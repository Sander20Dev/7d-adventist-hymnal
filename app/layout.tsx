import type { Metadata } from 'next'
// import { Roboto } from 'next/font/google'
import './globals.css'
import { url_page } from './lib/url'

// const rosario = Roboto({ subsets: ['latin'], weight: ['400', '700'] })

export const metadata: Metadata = {
  metadataBase: new URL(url_page),
  title: 'Himnario Adventista',
  description:
    'Es un sitio web hecho para la comodidad al momento de escuchar un himno sin la necesidad de buscarlo como video o descargar un programa para reproducirlos.',
  openGraph: {
    title: 'Himnario Adventista',
    description:
      'Es un sitio web hecho para la comodidad al momento de escuchar un himno sin la necesidad de buscarlo como video o descargar un programa para reproducirlos.',
    images: '/images/full-images/thumbnail-21.webp',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={'font-system'}>{children}</body>
    </html>
  )
}
