'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

type Gig = {
    id: string
    date: string
    venue: string
    city: string
    state: string | null
    ticket_url: string | null
    notes: string | null
    flyer_url: string | null
}

export default function AdminGigsPage() {
    const [gigs, setGigs] = useState<Gig[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const [date, setDate] = useState('')
    const [venue, setVenue] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [ticketUrl, setTicketUrl] = useState('')
    const [notes, setNotes] = useState('')
    const [flyerFile, setFlyerFile] = useState<File | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)

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
            fetchGigs()
        }
        init()
    }, [])

    async function fetchGigs() {
        const { data, error } = await supabase
            .from('gigs')
            .select('*')
            .order('date', { ascending: true })

        if (error) {
            setError('Error loading gigs.')
        } else {
            setGigs(data || [])
        }
        setLoading(false)
    }

    async function handleAddGig(e: React.SyntheticEvent) {
        e.preventDefault()
        setSaving(true)
        setError('')

        let flyerUrl: string | null = null

        if (flyerFile) {
            const fileExt = flyerFile.name.split('.').pop()
            const fileName = `${Date.now()}.${fileExt}`

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

            flyerUrl = data.publicUrl
        }

        if (editingId) {
            const { error } = await supabase
            .from('gigs')
            .update({
                date,
                venue,
                city,
                state: state || null,
                ticket_url: ticketUrl || null,
                notes: notes || null,
                ...((flyerUrl && { flyer_url: flyerUrl })),
            })
            .eq('id', editingId)
        if (error) {
            setError('Error updating show.')
        } else {
            setEditingId(null)
            setDate('')
            setVenue('')
            setCity('')
            setState('')
            setTicketUrl('')
            setNotes('')
            setFlyerFile(null)
            fetchGigs()
        }
        } else {
            const { error } = await supabase
            .from('gigs')
            .insert([{
                date,
                venue,
                city,
                state: state || null,
                ticket_url: ticketUrl || null,
                notes: notes || null,
                flyer_url: flyerUrl,
            }])
        
        if (error) {
            setError('Error adding gig.')
        } else {
            setDate('')
            setVenue('')
            setCity('')
            setState('')
            setTicketUrl('')
            setNotes('')
            setFlyerFile(null)
            fetchGigs()
        }
    }
    setSaving(false)
    }

    async function handleDeleteGig(id: string) {
        if (!confirm('Delete this show?')) return

        const { error } = await supabase
            .from('gigs')
            .delete()
            .eq('id', id)

        if (error) {
            setError('Error deleting gig.')
        } else {
            fetchGigs()
        }
    }

    function handleEditGig(gig: Gig) {
        setEditingId(gig.id)
        setDate(gig.date)
        setVenue(gig.venue)
        setCity(gig.city)
        setState(gig.state || '')
        setTicketUrl(gig.ticket_url || '')
        setNotes(gig.notes || '')
        setFlyerFile(null)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function handleCancelEdit() {
        setEditingId(null)
        setDate('')
        setVenue('')
        setCity('')
        setState('')
        setTicketUrl('')
        setNotes('')
        setFlyerFile(null)
    }

    const inputStyle = {
        background: '#111',
        border: '1px solid #222',
        color: '#f0ece4',
        padding: '0.75rem 1rem',
        fontFamily: 'monospace',
        fontSize: '0.9rem',
        outline: 'none',
        width: '100%',
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
            fontFamily: 'monospace' 
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
                    marginBottom: '3rem' 
                }}>
                    <h1 style={{ 
                        fontSize: '0.75rem', 
                        letterSpacing: '0.25em', 
                        textTransform: 'uppercase', 
                        opacity: 0.5 
                    }}>
                        Manage Shows
                    </h1>
                    <Link href='/admin' style={{ 
                        color: '#f0ece4', 
                        fontFamily: 'monospace', 
                        fontSize: '0.8rem', 
                        opacity: 0.5, 
                        textDecoration: 'none' 
                    }}>
                        Back
                    </Link>
                </div>

{/* ANCHOR - Add Show Form */}

                <form onSubmit={handleAddGig} style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '1rem', 
                    marginBottom: '4rem', 
                    paddingBottom: '4rem', 
                    borderBottom: '1px solid #1a1a1a' 
                }}>
                    <h2 style={{ 
                        fontSize: '0.75rem', 
                        letterSpacing: '0.25em', 
                        textTransform: 'uppercase', 
                        opacity: 0.5, 
                        marginBottom: '0.5rem' 
                    }}>
                        {editingId ? 'Edit Show' : 'Add Show'}
                    </h2>

                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '1rem' 
                    }}>
                        <div>
                            <label style={labelStyle}>Date</label>
                            <input type='date' value={date} onChange={(e) => setDate(e.target.value)} required style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Venue</label>
                            <input type='text' placeholder='Venue' value={venue} onChange={(e) => setVenue(e.target.value)} required style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>City</label>
                            <input type='text' placeholder='City' value={city} onChange={(e) => setCity(e.target.value)} required style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>State</label>
                            <input type='text' placeholder='State' value={state} onChange={(e) => setState(e.target.value)} style={inputStyle} />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Ticket URL (optional)</label>
                        <input type='url' placeholder='https://...' value={ticketUrl} onChange={(e) => setTicketUrl(e.target.value)} style={inputStyle} />
                    </div>

                    <div>
                        <label style={labelStyle}>Notes (optional)</label>
                        <input type='text' placeholder='Details' value={notes} onChange={(e) => setNotes(e.target.value)} style={inputStyle} />
                    </div>

                    <div>
                        <label style={labelStyle}>Flyer (optional)</label>
                        <input
                            type='file'
                            accept='image/*'
                            onChange={(e) => setFlyerFile(e.target.files?.[0] || null)}
                            style={{
                                ...inputStyle,
                                padding: '0.5rem',
                                cursor: 'pointer',
                            }}
                        />
                    </div>

                    {error && <p style={{ 
                        color: '#ff4444', 
                        fontSize: '0.85rem' 
                    }}>{error}</p>}
                <div style={{
                    display: 'flex',
                    gap: '1rem',
                    alignItems: 'center'
                }}>
                    <button type='submit' disabled={saving} style={{
                        background: '#f0ece4', 
                        color: '#0a0a0a', 
                        border: 'none',
                        padding: '0.75rem 1rem', 
                        fontFamily: 'monospace', 
                        fontSize: '0.9rem',
                        letterSpacing: '0.1em', 
                        textTransform: 'uppercase', 
                        cursor: 'pointer',
                        opacity: saving ? 0.5 : 1, 
                        alignSelf: 'flex-start',
                    }}>
                        {saving ? 'Saving...' : editingId ? 'Update Show' :'Add Show'}
                    </button>

                    {editingId && (
                        <button type='button' onClick={handleCancelEdit}
                            style={{
                                background: 'none',
                                border: '1px solid #333',
                                color: '#f0ece4',
                                padding: '0.75rem 1rem',
                                fontFamily: 'monospace',
                                fontSize: '0.9rem',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                            }}>
                                Cancel
                            </button>
                        )}
                </div>    
            </form>

{/* ANCHOR - Current Shows */}

                <h2 style={{ 
                    fontSize: '0.75rem', 
                    letterSpacing: '0.25em', 
                    textTransform: 'uppercase', 
                    opacity: 0.5, 
                    marginBottom: '1.5rem' 
                }}>
                    Existing Shows
                </h2>

                {gigs.length > 0 ? (
                    <ul style={{ 
                        listStyle: 'none', 
                        padding: 0, 
                        margin: 0, 
                        display: 'flex', 
                        flexDirection: 'column', 
                        gap: '0' 
                    }}>
                        {gigs.map((gig) => (
                            <li key={gig.id} style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center', 
                                padding: '1rem 0', 
                                borderBottom: '1px solid #1a1a1a', 
                                gap: '1rem', 
                                flexWrap: 'wrap' 
                            }}>
                                <div>
                                    <p style={{ 
                                        fontWeight: 700, 
                                        marginBottom: '0.25rem' 
                                    }}>{gig.venue}</p>
                                    <p style={{ 
                                        opacity: 0.5, 
                                        fontSize: '0.85rem' 
                                    }}>{gig.date} — {gig.city}{gig.state ? `, ${gig.state}` : ''}</p>
                                    {gig.notes && (
                                        <p style={{ 
                                            opacity: 0.4, 
                                            fontSize: '0.8rem', 
                                            marginTop: '0.25rem' 
                                        }}>{gig.notes}</p>
                                    )}
                                    {gig.flyer_url && (
                                        <img 
                                            src={gig.flyer_url} 
                                            alt='flyer' 
                                            style={{ 
                                                width: '60px', 
                                                height: '60px', 
                                                objectFit: 'cover', 
                                                marginTop: '0.5rem' 
                                            }} 
                                        />
                                    )}
                                </div>
                            <div style={{
                                display: 'flex',
                                gap: '0.5rem'
                            }}>
                                <button onClick={() => handleEditGig(gig)} style={{
                                    background: 'none', 
                                    border: '1px solid #333', 
                                    color: '#f0ece4',
                                    padding: '0.25rem 0.75rem', 
                                    fontFamily: 'monospace', 
                                    fontSize: '0.8rem',
                                    cursor: 'pointer', 
                                    letterSpacing: '0.1em', 
                                    textTransform: 'uppercase', 
                                }}>
                                    Edit
                                </button>
                                <button onClick={() => handleDeleteGig(gig.id)} style={{
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
                                    Delete
                                </button>
                            </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ opacity: 0.4 }}>No shows yet.</p>
                )}

            </div>
        </main>
    )
}