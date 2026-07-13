'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'
import Image from 'next/image'

export default function AdminTourFlyerPage() {
    const [currentFlyer, setCurrentFlyer] = useState<string | null>(null)
    const [flyerFile, setFlyerFile] = useState<File | null>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
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
            fetchFlyer()
        }
        init()
    }, [])

    async function fetchFlyer() {
        const { data } = await supabase
            .from('featured_flyer')
            .select('*')
            .limit(1)
            .maybeSingle()

        if (data) {
            setCurrentFlyer(data.image_url)
        }
        setLoading(false)
    }

    async function handleSave(e: React.SyntheticEvent) {
        e.preventDefault()
        if (!flyerFile) return
        setSaving(true)
        setError('')

        const fileExt = flyerFile.name.split('.').pop()
        const fileName = `tour-flyer-${Date.now()}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('flyers')
            .upload(fileName, flyerFile)

        if (uploadError) {
            setError('Error uploading flyer.')
            setSaving(false)
            return
        }

        const { data } = supabase.storage
            .from('flyers')
            .getPublicUrl(fileName)

        const imageUrl = data.publicUrl

        // check if a row already exists
        const { data: existing } = await supabase
            .from('featured_flyer')
            .select('id')
            .limit(1)
            .maybeSingle()

        if (existing) {
            // update existing row
            const { error } = await supabase
                .from('featured_flyer')
                .update({ image_url: imageUrl })
                .eq('id', existing.id)

            if (error) {
                setError('Error saving flyer.')
                setSaving(false)
                return
            }
        } else {
            // insert new row
            const { error } = await supabase
                .from('featured_flyer')
                .insert([{ image_url: imageUrl }])

            if (error) {
                setError('Error saving flyer.')
                setSaving(false)
                return
            }
        }

        setCurrentFlyer(imageUrl)
        setFlyerFile(null)
        setSaving(false)
    }

    async function handleDelete() {
        if (!confirm('Remove the tour flyer?')) return

        const { data: existing } = await supabase
            .from('featured_flyer')
            .select('id')
            .limit(1)
            .maybeSingle()

        if (existing) {
            const { error } = await supabase
                .from('featured_flyer')
                .delete()
                .eq('id', existing.id)

            if (error) {
                setError('Error deleting flyer.')
                return
            }
        }

        setCurrentFlyer(null)
    }

    const inputStyle = {
        background: '#111',
        border: '1px solid #222',
        color: '#f0ece4',
        padding: '0.5rem',
        fontFamily: 'monospace',
        fontSize: '0.9rem',
        outline: 'none',
        width: '100%',
        cursor: 'pointer',
    }

    const labelStyle = {
        fontSize: '0.75rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase' as const,
        opacity: 0.5,
        marginBottom: '0.4rem',
        display: 'block',
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
                        Tour Flyer
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

{/* ANCHOR - Current Flyer */}

                {currentFlyer ? (
                    <div style={{ marginBottom: '3rem' }}>
                        <p style={{ ...labelStyle, marginBottom: '1rem' }}>Current Flyer</p>
                        <div style={{ position: 'relative', width: '100%', maxWidth: '400px', aspectRatio: '1' }}>
                            <Image
                                src={currentFlyer}
                                alt='Tour flyer'
                                fill
                                style={{ objectFit: 'contain' }}
                            />
                        </div>
                        <button
                            onClick={handleDelete}
                            style={{
                                marginTop: '1rem',
                                background: 'none',
                                border: '1px solid #333',
                                color: '#ff4444',
                                padding: '0.25rem 0.75rem',
                                fontFamily: 'monospace',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                            }}>
                            Remove Flyer
                        </button>
                    </div>
                ) : (
                    <p style={{ opacity: 0.4, marginBottom: '3rem' }}>No tour flyer uploaded yet.</p>
                )}

{/* ANCHOR - Upload Form */}

                <form onSubmit={handleSave} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid #1a1a1a',
                }}>
                    <h2 style={{
                        fontSize: '0.75rem',
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        opacity: 0.5,
                        marginBottom: '0.5rem',
                    }}>
                        {currentFlyer ? 'Replace Flyer' : 'Upload Flyer'}
                    </h2>

                    <div>
                        <label style={labelStyle}>Image</label>
                        <input
                            type='file'
                            accept='image/*'
                            onChange={(e) => setFlyerFile(e.target.files?.[0] || null)}
                            style={inputStyle}
                        />
                    </div>

                    {error && (
                        <p style={{ color: '#ff4444', fontSize: '0.85rem' }}>{error}</p>
                    )}

                    <button
                        type='submit'
                        disabled={saving || !flyerFile}
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
                            opacity: saving || !flyerFile ? 0.5 : 1,
                            alignSelf: 'flex-start',
                        }}>
                        {saving ? 'Uploading...' : currentFlyer ? 'Replace Flyer' : 'Upload Flyer'}
                    </button>
                </form>

            </div>
        </main>
    )
}