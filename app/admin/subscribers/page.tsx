'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

type Subscriber = {
    id: string
    email: string
    created_at: string
}

export default function AdminSubscribersPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const router = useRouter()

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    )

    useEffect(() => {
        async function init() {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) {
                router.push('/admin/login')
                return
            }
            fetchSubscribers()
        }
        init()
    }, [])

    async function fetchSubscribers() {
        const { data, error } = await supabase
            .from('email_subscriptions')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            setError('Error loading subscribers.')
        } else {
            setSubscribers(data || [])
        }
        setLoading(false)
    }

    if (loading) return (
        <main style={{
            background: '#0a0a0a',
            color: '#f0ece4',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'monospace',
        }}>
            <p style={{ opacity: 0.4 }}>Loading...</p>
        </main>
    )

    return (
        <main style={{
            background: '#0a0a0a',
            color: '#f0ece4',
            minHeight: '100vh',
            fontFamily: 'monospace',
            padding: '4rem 2rem',
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '3rem',
                }}>
                    <h1 style={{
                        fontSize: '0.75rem',
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        opacity: 0.5,
                    }}>
                        Subscribers ({subscribers.length})
                    </h1>
                    <Link href='/admin' style={{
                        color: '#f0ece4',
                        fontFamily: 'monospace',
                        fontSize: '0.8rem',
                        opacity: 0.5,
                        textDecoration: 'none',
                    }}>
                        Back
                    </Link>
                </div>

                {error && (
                    <p style={{ color: '#ff4444', fontSize: '0.85rem', marginBottom: '2rem' }}>
                        {error}
                    </p>
                )}

                {subscribers.length > 0 ? (
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0',
                    }}>
                        {subscribers.map((subscriber) => (
                            <li key={subscriber.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem 0',
                                borderBottom: '1px solid #1a1a1a',
                                gap: '1rem',
                                flexWrap: 'wrap',
                            }}>
                                <p style={{ fontWeight: 700 }}>{subscriber.email}</p>
                                <p style={{ opacity: 0.4, fontSize: '0.8rem' }}>
                                    {new Date(subscriber.created_at).toLocaleDateString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ opacity: 0.4 }}>There's nobody here.</p>
                )}

            </div>
        </main>
    )
}