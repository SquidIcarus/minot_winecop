'use client'

import Link from 'next/link'
import { useState } from 'react'
import { FaBandcamp, FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa'
import { SiLinktree } from 'react-icons/si'

export default function Nav() {
    const [open, setOpen] = useState(false)

    const links = [
        { label: 'Shows', href: '/gigs' },
        { label: 'Music', href: '/music' },
        { label: 'Merch', href: '/merch' },
        { label: 'About', href: '/about' },
    ]

    const socials = [
        { icon: <FaBandcamp size={18}/>, href: 'https://minot.bandcamp.com/', label: 'Bandcamp' },
        { icon: <FaInstagram size={18}/>, href: 'https://www.instagram.com/minotmusic/', label: 'Instagram' },
        { icon: <FaFacebook size={18}/>, href: 'https://www.facebook.com/minotmusic', label: 'Facebook' },
        { icon: <FaYoutube size={18}/>, href: 'https://www.youtube.com/@minotmusic', label: 'YouTube' },
        { icon: <SiLinktree size={18}/>, href: 'https://linktr.ee/minotmusic', label: 'LinkTree' },
    ]

    return (
       <>
{ /* ANCHOR - Desktop Nav */ } 
        <nav className='md:hidden' style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            padding: '1.25rem 2rem',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(26, 20, 16, 0.9)',
            backdropFilter: 'blur(4px)',
        }}>

{ /* ANCHOR - Mobile Home Logo */ }

            <Link href='/' onClick={() => setOpen(false)}
                style={{ 
                    color: '#f0e6d3', 
                    textDecoration: 'none', 
                    fontFamily: 'monospace',
                    fontWeight: 900, 
                    fontSize: '1.1rem', 
                    letterSpacing: '0.2em' 
                }}>
                MINOT
            </Link>

{ /* ANCHOR - Mobile Hamburger */ }
            <button
                onClick={() => setOpen(!open)}
                style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer', 
                    padding: '0.25rem',
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '5px',
                }}
                    aria-label='Toggle menu'
            >
                <span style={{
                    display: 'block', 
                    width: '24px', 
                    height: '1.5px', 
                    background: '#f0e6d3',
                    transition: 'transform 0.3s ease, opacity 0.3s ease',
                    transform: open ? 'translateY(6.5px) rotate(45deg)' : 'none',
                }} />
                <span style={{
                    display: 'block', 
                    width: '24px', 
                    height: '1.5px', 
                    background: '#f0e6d3',
                    transition: 'opacity 0.3s ease',
                    opacity: open ? 0 : 1,
                }} />
                <span style={{
                    display: 'block', 
                    width: '24px', 
                    height: '1.5px', 
                    background: '#f0e6d3',
                    transition: 'transform 0.3s ease, opacity 0.3s ease',
                    transform: open ? 'translateY(-6.5px) rotate(-45deg)' : 'none',
                }} />                
            </button>
        </nav>

{ /* ANCHOR - Desktop Full Nav */ }
        <nav className='hidden md:flex' style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 100,
            padding: '1.25rem 2rem',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(26, 20, 16, 0.9)',    
            backdropFilter: 'blur(4px)',
        }}>
{ /* Left side - page links */ }
            <div style={{ 
                display: 'flex', 
                gap: '2rem',
                alignItems: 'center',
            }}>
                {links.map(({ label, href }) => (
                    <Link key={label} href={href}
                        style={{
                            color: '#f0e6d3', 
                            textDecoration: 'none',
                            fontFamily: 'monospace', 
                            fontSize: '0.85rem',
                            letterSpacing: '0.2em', 
                            textTransform: 'uppercase',
                            opacity: 0.85,
                        }}>
                        {label}
                    </Link>
                ))}
            </div>
{ /* Center - logo */ }
            <Link href='/' style={{
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                color: '#f0e6d3',
                textDecoration: 'none',
                fontFamily: 'monospace',
                fontWeight: 900,
                fontSize: '1.1rem',
                letterSpacing: '0.3em',
            }}>
                MINOT
            </Link>
{ /* Right side - social links */ }
           <div style={{
            display: 'flex',
            gap: '1.25rem',
            alignItems: 'center',
           }}>
            {socials.map(({ icon, href, label }) => (
                <a key={label} href={href} target='_blank' rel='noopener noreferrer'
                    aria-label={label}
                    style={{
                        color: '#f0e6d3',
                        opacity: 0.7,
                        display: 'flex',
                        alignItems: 'center',
                    }}>
                    {icon}
                </a>
            ))}
        </div>
    </nav>
{/* ANCOR - Mobile fullscreen menu */}
        {open && (
            <div 
                className='mobile-menu'
                style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 99,
                    background: '#1a1410',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2rem',
                }}>
                    
                    {links.map(({ label, href }) => (
                        <Link key={label} href={href} onClick={() => setOpen(false)}
                            style={{
                                color: '#f0e6d3',
                                textDecoration: 'none',
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                fontSize: 'clamp(2rem, 8vw, 4rem)',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                opacity: 0.85,
                            }}>
                            {label}
                        </Link>
                    ))}
                    <div style={{ 
                        display: 'flex', 
                        gap: '1.5rem',
                        marginTop: '1rem'
                    }}>
                        {socials.map(({ icon, href, label }) => (
                            <a key={label} href={href} target='_blank' rel='noopener noreferrer'
                                aria-label={label}
                                style={{
                                    color: '#f0e6d3',
                                    opacity: 0.6,
                                    display: 'flex',
                                }}>
                                {icon}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </>
    )
}

                        