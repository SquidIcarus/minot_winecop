'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    )

    async function handleLogin(e: React.SyntheticEvent) {
        e.preventDefault()
        setLoading(true)
        setError('')

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setError('Invalid email or password ya ding dong!')
            setLoading(false)
            return
        }

        router.push('/admin')
    }

    return (
        <main style={{
            background: '#0a0a0a', 
            color: '#f0ece4', 
            minHeight: '100vh',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontFamily: 'monospace',
        }}>
            <div style={{ 
                width: '100%', 
                maxWidth: '360px', 
                padding: '2rem' 
            }}>
                <h1 style={{ 
                    fontSize: '0.75rem', 
                    letterSpacing: '0.25rem', 
                    textTransform: 'uppercase',
                    opacity: 0.5, 
                    marginBottom: '2rem' 
                }}>
                MINOT's Top Dad (admin)
                </h1>
                    <form onSubmit={handleLogin} style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '1rem' 
                    }}>
                        <input 
                            type='email'
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            style={{
                                background: '#111', 
                                border: '1px solid #222', 
                                color: '#f0ece4',
                                padding: '0.75rem 1rem', 
                                fontFamily: 'monospace', 
                                fontSize: '0.9rem',
                                outline: 'none', 
                                width: '100%',
                            }}
                        />
                        {error && (
                            <p style={{ 
                                color: '#ff4444', 
                                fontSize: '0.85rem', 
                                margin: 0 
                            }}>{error}</p>
                        )}
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                placeholder='Password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{
                                    background: '#111', 
                                    border: '1px solid #222', 
                                    color: '#f0ece4',
                                    padding: '0.75rem 1rem', 
                                    fontFamily: 'monospace', 
                                    fontSize: '0.9rem',
                                    outline: 'none', 
                                    width: '100%',
                                }}
                            />
                            <button
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute',
                                    right: '0',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: '1px solid #222',
                                    color: '#f0ece4',
                                    padding: '0.25rem 0.5rem',
                                    fontFamily: 'monospace',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                }}
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        <button
                            type='submit'
                            disabled={loading}
                            style={{
                                background: '#f0ece4', 
                                color: '#0a0a0a',
                                border: 'none',
                                padding: '0.75rem 1rem', 
                                fontFamily: 'monospace', 
                                fontSize: '0.9rem',
                                letterSpacing: '0.1em', 
                                textTransform: 'uppercase', 
                                cursor: 'pointer',
                                opacity: loading ? 0.5 : 1,
                            }}
                        >
                            {loading ? 'Loading pizza hold the crust...' : 'Login'}
                        </button>
                    </form>
            </div>
        </main>
    )
}