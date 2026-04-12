'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function AdminPage() {
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    )

    useEffect(() => {
        async function checkSession() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/admin/login')
            } else {
                setLoading(false)
            }
        }
        checkSession()
    }, [])

    async function handleLogout() {
        await supabase.auth.signOut()
        router.push('/admin/login')
    }

    if (loading) return (
        <main style={{ 
            background: '#0a0a0a', 
            color: '#f0ece4', 
            minHeight: '100vh',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            fontFamily: 'monospace'}}>
                <p style={{ opacity: 0.4 }}>Loading...</p>
        </main>
    )

    return (
        <main style={{ 
            background: '#0a0a0a', 
            color: '#f0ece4', 
            minHeight: '100vh', 
            fontFamily: 'monospace', 
            padding: '4rem 2rem' 
        }}>
            <div style={{ 
                maxWidth: '800px', 
                margin: '0 auto' 
            }}>
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '4rem' 
                }}>
                    <h1 style={{ 
                        fontSize: '0.75rem', 
                        letterSpacing: '0.25', 
                        textTransform: 'uppercase', 
                        opacity: 0.5 }}>
                    MINOT's Top Dad (admin)
                    </h1>
                    <button onClick={handleLogout} style={{
                        background: 'none', 
                        border: '1px solid #333', 
                        color: '#f0ece4', 
                        padding: '0.5rem 1rem', 
                        fontFamily: 'monospace', 
                        fontSize: '0.8rem', 
                        letterSpacing: '0.1em', 
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                    }}>
                        Logout
                    </button>
                </div>

                <div style={{ display: 'grid', gap: '1rem' }}>
                    {[
                        { label: 'Manage Shows', href: '/admin/gigs', desc: 'Add, edit, or remove upcoming shows' },
                        { label: 'Manage Music', href: '/admin/music', desc: 'Add new releases and streaming links' },
                        { label: 'Manage Merch', href: '/admin/merch', desc: 'Add, edit, or mark items as sold out' },
                    ].map(({ label, href, desc }) => (
                        <a key={label} href={href} style={{
                            display: 'block',
                            padding: '1.5rem',
                            border: '1px solid #1a1a1a', 
                            textDecoration: 'none',
                            color: '#f0ece4',
                        }}>
                            <p style={{ 
                                fontWeight: 700, 
                                marginBottom: '0.25rem' 
                            }}>{label}</p>
                            <p style={{ 
                                opacity: 0.4, 
                                fontSize: '0.85rem' 
                            }}>{desc}</p>
                        </a>
                    ))}
                </div>
            </div>
        </main>
    )
}