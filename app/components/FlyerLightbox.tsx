'use client'

import { useState } from 'react'

type Props = {
    url: string
    venue: string
}

export default function FlyerLightbox({ url, venue }: Props) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <img
                src={url}
                alt={`${venue} flyer`}
                onClick={() => setOpen(true)}
                style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    opacity: 0.8,
                    flexShrink: 0,
                }}
            />

            {open && (
                <div
                    onClick={() => setOpen(false)}
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: 200,
                        background: 'rgba(0,0,0,0.85)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '2rem',
                        cursor: 'pointer',
                    }}
                >
                    <img
                        src={url}
                        alt={`${venue} flyer`}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '90vh',
                            objectFit: 'contain',
                        }}
                    />
                    <p style={{
                        position: 'absolute',
                        top: '1.5rem',
                        right: '2rem',
                        color: '#f0ece4',
                        fontFamily: 'monospace',
                        fontSize: '0.0rem',
                        opacity: 0.5,
                        letterSpacing: '0.1em',
                    }}>
                        click to close
                    </p>
                </div>
            )}
        </>
    )
}