import './globals.css'
import { Inter } from 'next/font/google'
import localFont from 'next/font/local'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

// Optional: You can load a Google font for the retro arcade feel if needed
// Or simply use Inter for a clean modern look combined with dark theme.
// For now, we mix a modern aesthetic with dark game mode colors.

export const metadata = {
  title: 'Invitación de Cumpleaños - ESTILO REPO',
  description: 'Te invito a mi cumpleaños! Tema: Videojuego REPO',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${inter.variable} font-sans bg-repoDark text-white antialiased`}>
        {children}
      </body>
    </html>
  )
}
