import type { Metadata } from 'next'
import Nav from './components/Nav'
import './globals.css'
import React from 'react'

export const metadata: Metadata = {
  title: 'Minot',
  description: 'budget rock...on a budget',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body style={{ 
        margin: 0, 
        background: '#0a0a0a', 
        color: '#f0ece4' 
      }}>
        <Nav />
        {children}
      </body>
    </html>
  )
}
