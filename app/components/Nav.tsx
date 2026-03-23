'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Nav() {
    const [open, setOpen] = useState(false)

    const links = [
        { label: 'Shows', href: '/gigs' },
        { label: 'Music', href: '/music' },
        { label: 'Merch', href: '/merch' },
        { label: 'About', href: '/about' },
    ]

    return (
       <> 
        <nav className='md:hidden' style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            padding: '1.25rem 2rem',
            justifyContent: 'space-between',
            alignItems: 'center',
        }}>

{ /* ANCHOR - Mobile Home Logo */ }

            <Link href='/' onClick={() => setOpen(false)}
                style={{ color: '#f0ece4', textDecoration: 'none', fontFamily: 'monospace',
                    fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.2em' }}>
                MINOT
            </Link>

{ /* ANCHOR - Mobile Hamburger */ }
            <button
                onClick={() => setOpen(!open)}
                style={{ 
                    background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem',
                    display: 'flex', flexDirection: 'column', gap: '5px',
                }}
                    aria-label='Toggle menu'
            >
                <span style={{
                    display: 'block', width: '24px', height: '1.5px', background: '#f0ece4',
                    transition: 'transform 0.3s ease, opacity 0.3s ease',
                    transform: open ? 'translateY(6.5px) rotate(45deg)' : 'none',
                }} />
                <span style={{
                    display: 'block', width: '24px', height: '1.5px', background: '#f0ece4',
                    transition: 'opacity 0.3s ease',
                    opacity: open ? 0 : 1,
                }} />
                <span style={{
                    display: 'block', width: '24px', height: '1.5px', background: '#f0ece4',
                    transition: 'transform 0.3s ease, opacity 0.3s ease',
                    transform: open ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
                }} />                
            </button>
        </nav>

{ /* ANCHOR - mobile burger menu */ }
            {open && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 99,
                    background: '#0a0a0a', 
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: '2.5rem',
                }}
                className='mobile-menu'
                >
                    {links.map(({ label, href }) => (
                        <Link key={label} href={href} onClick={() => setOpen(false)}
                            style={{
                                color: '#f0ece4', textDecoration: 'none', 
                                fontFamily: 'monospace', fontWeight: 700,
                                fontSize: 'clamp(2rem, 8vw, 4rem)',
                                letterSpacing: '0.1em', textTransform: 'uppercase',
                                opacity: 0.85,
                            }}>
                            {label}
                        </Link>
                    ))}
                </div>
            )}
       </>
    )
}
