'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

type Music = {
    id: string
    title: string
    type: string
    release_date: string
    bandcamp_url: string | null
    spotify_url: string | null
    cover_art_url: string | null
}

export default function AdminMusicPage() {
    const [music, setMusic] = useState<Music[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const [title, setTitle] = useState('')
    const [type,setType] = useState('')
    const [releaseDate, setReleaseDate] = useState('')
    const [bandcampUrl, setBandcampUrl] = useState('')
    const [spotifyUrl, setSpotifyUrl] = useState('')
    const [coverArtFile, setCoverArtFile] = useState<File | null>(null)
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
            fetchMusic()
        }
        init()
    }, [])

    async function fetchMusic() {
        const { data, error } = await supabase
            .from('music')
            .select('*')
            .order('release_date', { ascending: false })
       
        if (error) {
            setError('Error loading music.')
        } else {
            setMusic(data || [])
        }
        setLoading(false)
    }

    async function handleSave(e: React.SyntheticEvent) {
        e.preventDefault()
        setSaving(true)
        setError('')

        let coverArtUrl: string | null = null

        if (coverArtFile) {
            const fileExt = coverArtFile.name.split('.').pop()
            const fileName = `music-${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('flyers')
                .upload(fileName, coverArtFile)

            if (uploadError) {
                setError('Error uploading cover art.')
                setSaving(false)
                return
            }

            const { data } = supabase.storage
                .from('flyers')
                .getPublicUrl(fileName)

            coverArtUrl = data.publicUrl
        }
        
        if (editingId) {
            const { error } = await supabase
                .from('music')
                .update({
                    title,
                    type,
                    release_date: releaseDate,
                    bandcamp_url: bandcampUrl || null,
                    spotify_url: spotifyUrl || null,
                    ...(coverArtUrl && { cover_art_url: coverArtUrl }),
                })
                .eq('id', editingId)

            if (error) {
                setError('Error updating release.')
            } else {
                resetForm()
                fetchMusic()
            }
        } else {
            const { error } = await supabase
                .from('music')
                .insert([{
                    title,
                    type,
                    release_date: releaseDate,
                    bandcamp_url: bandcampUrl || null,
                    spotify_url: spotifyUrl || null,
                    cover_art_url: coverArtUrl,
                }])

            if (error) {
                setError('Error adding release.')
            } else {
                resetForm()
                fetchMusic()
            }
        }
        setSaving(false)
    }

    function resetForm() {
        setEditingId(null)
        setTitle('')
        setType('')
        setReleaseDate('')
        setBandcampUrl('')
        setSpotifyUrl('')
        setCoverArtFile(null)
    }

    function handleEditMusic(release: Music) {
        setEditingId(release.id)
        setTitle(release.title)
        setType(release.type)
        setReleaseDate(release.release_date)
        setBandcampUrl(release.bandcamp_url || '')
        setSpotifyUrl(release.spotify_url || '')
        setCoverArtFile(null)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function handleCancelEdit() {
        resetForm()
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this release?')) return

        const { error } = await supabase
            .from('music')
            .delete()
            .eq('id', id)

        if (error) {
            setError('Error deleting release.')
        } else {
            fetchMusic()
        }
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
                        Manage Music
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

{/* ANCHOR - Add/Edit Form */}

                <form onSubmit={handleSave} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    marginBottom: '4rem',
                    paddingBottom: '4rem',
                    borderBottom: '1px solid #1a1a1a',
                }}>
                    <h2 style={{
                        fontSize: '0.75rem',
                        letterSpacing: '0.25em',
                        textTransform: 'uppercase',
                        opacity: 0.5,
                        marginBottom: '0.5rem',
                    }}>
                        {editingId ? 'Edit Release' : 'Add Release'}
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={labelStyle}>Title</label>
                            <input
                                type='text'
                                placeholder='Release title'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                required
                                style={{
                                    ...inputStyle,
                                    cursor: 'pointer',
                                }}
                            >
                                <option value=''>Select type...</option>
                                <option value='Album'>Album</option>
                                <option value='EP'>EP</option>
                                <option value='Single'>Single</option>
                                <option value='7" Single'>7" Single</option>
                                <option value='Compilation'>Compilation</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Release Date</label>
                        <input
                            type='date'
                            value={releaseDate}
                            onChange={(e) => setReleaseDate(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Bandcamp URL (optional)</label>
                        <input
                            type='url'
                            placeholder='https://minot1.bandcamp.com/...'
                            value={bandcampUrl}
                            onChange={(e) => setBandcampUrl(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Spotify URL (optional)</label>
                        <input
                            type='url'
                            placeholder='https://open.spotify.com/...'
                            value={spotifyUrl}
                            onChange={(e) => setSpotifyUrl(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Cover Art (optional)</label>
                        <input
                            type='file'
                            accept='image/*'
                            onChange={(e) => setCoverArtFile(e.target.files?.[0] || null)}
                            style={{
                                ...inputStyle,
                                padding: '0.5rem',
                                cursor: 'pointer',
                            }}
                        />
                    </div>

                    {error && (
                        <p style={{ color: '#ff4444', fontSize: '0.85rem' }}>{error}</p>
                    )}

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
                            {saving ? 'Saving...' : editingId ? 'Update Release' : 'Add Release'}
                        </button>
                        {editingId && (
                            <button type='button' onClick={handleCancelEdit} style={{
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

{/* ANCHOR - Existing Music */}

                <h2 style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    opacity: 0.5,
                    marginBottom: '1.5rem',
                }}>
                    Existing Releases
                </h2>

                {music.length > 0 ? (
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0',
                    }}>
                        {music.map((release) => (
                            <li key={release.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem 0',
                                borderBottom: '1px solid #1a1a1a',
                                gap: '1rem',
                                flexWrap: 'wrap',
                            }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    {release.cover_art_url && (
                                        <img
                                            src={release.cover_art_url}
                                            alt={release.title}
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    )}
                                    <div>
                                        <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
                                            {release.title}
                                        </p>
                                        <p style={{ opacity: 0.5, fontSize: '0.85rem' }}>
                                            {release.type} — {release.release_date}
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleEditMusic(release)} style={{
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
                                    <button onClick={() => handleDelete(release.id)} style={{
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
                    <p style={{ opacity: 0.4 }}>The Void.</p>
                )}

            </div>
        </main>
    )
}
    