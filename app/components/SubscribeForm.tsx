'use client' 

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function SubscribeForm() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'duplicate' | 'error'>('idle')

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    )

    async function handleSubscribe(e: React.SyntheticEvent) {
        e.preventDefault()
        setStatus('loading')
    
        const { error } = await supabase
            .from('email_subscriptions')
            .insert([{ email }])

        if (error) {
            if (error.code === '23505') {
                setStatus('duplicate')
                return
            }
            setStatus('error')
            return
        }

        setStatus('success')
        setEmail('')
    }

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            width: '100%',
            maxWidth: '400px',
        }}>
            {status === 'success' ? (
                <p style={{
                    color: '#e8355a',
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    letterSpacing: '0.1em',
            }}>
                You're in! Thanks for subscribing!
            </p>
            ) : (
                <form onSubmit={handleSubscribe} style={{
                    display: 'flex',
                    width: '100%',
                    gap: '0',    
                }}>
                    <input
                        type='email'
                        placeholder='your@email.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            flex: 1,
                            background: '#2e2218',
                            border: '1px solid #3e3228',
                            borderRight: 'none',
                            color: '#f0e6d3',
                            padding: '0.75rem 1rem',
                            fontFamily: 'monospace',
                            fontSize: '0.9rem',
                            outline: 'none',
                        }}
                    />
                    <button 
                        type='submit'
                        disabled={status === 'loading'}
                        style={{
                            background: '#e8355a',
                            color: '#f0e6d3',
                            border: 'none',
                            padding: '0.75rem 1.25rem',
                            fontFamily: 'monospace',
                            fontSize: '0.8rem',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                            fontWeight: 700,
                            opacity: status === 'loading' ? 0.6 : 1,
                        }}>
                        {status === 'loading' ? '...' : 'Subscribe'}
                    </button>
                </form>
            )}
            {status === 'error' && (
                <p style={{
                    color: '#ff4444',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    opacity: 0.8,
                }}>
                    Oops! What happened? Try again!
                </p>
            )}
            {status === 'duplicate' && (
                <p style={{
                    color: '#e8355a',
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    opacity: 0.8,
                }}>
                    You're already subscribed, thank you!
                </p>
            )}
        </div>
    )
}
