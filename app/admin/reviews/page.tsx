'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

type Review = {
    id: string
    music_id: number
    publication: string
    quote: string
    url: string | null
}


type Music = {
    id: number
    title: string
}


export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [music, setMusic] = useState<Music[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')


    const [musicId, setMusicId] = useState('')
    const [publication, setPublication] = useState('')
    const [quote, setQuote] = useState('')
    const [url, setUrl] = useState('')
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
            fetchData()
        }
        init()
    }, [])


    async function fetchData() {
        const [reviewsRes, musicRes] = await Promise.all([
            supabase.from('reviews').select('*').order('created_at', { ascending: false }),
            supabase.from('music').select('id, title').order('release_date', { ascending: false }),
        ])


        if (reviewsRes.error) {
            setError('Error loading reviews.')
        } else {
            setReviews(reviewsRes.data || [])
        }


        if (musicRes.data) {
            setMusic(musicRes.data)
        }


        setLoading(false)
    }


    async function handleSave(e: React.SyntheticEvent) {
        e.preventDefault()
        setSaving(true)
        setError('')


        if (editingId) {
            const { error } = await supabase
                .from('reviews')
                .update({
                    music_id: parseInt(musicId),
                    publication,
                    quote,
                    url: url || null,
                })
                .eq('id', editingId)


            if (error) {
                setError('Error updating review.')
            } else {
                resetForm()
                fetchData()
            }
        } else {
            const { error } = await supabase
                .from('reviews')
                .insert([{
                    music_id: parseInt(musicId),
                    publication,
                    quote,
                    url: url || null,
                }])


            if (error) {
                setError('Error adding review.')
            } else {
                resetForm()
                fetchData()
            }
        }
        setSaving(false)
    }


    function resetForm() {
        setEditingId(null)
        setMusicId('')
        setPublication('')
        setQuote('')
        setUrl('')
    }


    function handleEditReview(review: Review) {
        setEditingId(review.id)
        setMusicId(review.music_id.toString())
        setPublication(review.publication)
        setQuote(review.quote)
        setUrl(review.url || '')
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }


    async function handleDelete(id: string) {
        if (!confirm('Delete this review?')) return


        const { error } = await supabase
            .from('reviews')
            .delete()
            .eq('id', id)


        if (error) {
            setError('Error deleting review.')
        } else {
            fetchData()
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
                        Manage Reviews
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
                        {editingId ? 'Edit Review' : 'Add Review'}
                    </h2>


                    <div>
                        <label style={labelStyle}>Release</label>
                        <select
                            value={musicId}
                            onChange={(e) => setMusicId(e.target.value)}
                            required
                            style={{ ...inputStyle, cursor: 'pointer' }}
                        >
                            <option value=''>Select a release...</option>
                            {music.map((release) => (
                                <option key={release.id} value={release.id}>
                                    {release.title}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div>
                        <label style={labelStyle}>Publication</label>
                        <input
                            type='text'
                            placeholder='who wrote this review?'
                            value={publication}
                            onChange={(e) => setPublication(e.target.value)}
                            required
                            style={inputStyle}
                        />
                    </div>


                    <div>
                        <label style={labelStyle}>Quote</label>
                        <textarea
                            placeholder='review text goes here...'
                            value={quote}
                            onChange={(e) => setQuote(e.target.value)}
                            required
                            rows={4}
                            style={{
                                ...inputStyle,
                                resize: 'vertical',
                            }}
                        />
                    </div>


                    <div>
                        <label style={labelStyle}>URL (optional)</label>
                        <input
                            type='url'
                            placeholder='https://...'
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            style={inputStyle}
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
                            {saving ? 'Saving...' : editingId ? 'Update Review' : 'Add Review'}
                        </button>
                        {editingId && (
                            <button type='button' onClick={resetForm} style={{
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


{/* ANCHOR - Existing Reviews */}


                <h2 style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    opacity: 0.5,
                    marginBottom: '1.5rem',
                }}>
                    Existing Reviews
                </h2>


                {reviews.length > 0 ? (
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0',
                    }}>
                        {reviews.map((review) => (
                            <li key={review.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'flex-start',
                                padding: '1rem 0',
                                borderBottom: '1px solid #1a1a1a',
                                gap: '1rem',
                                flexWrap: 'wrap',
                            }}>
                                <div style={{ flex: 1 }}>
                                    <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
                                        {review.publication}
                                    </p>
                                    <p style={{ opacity: 0.5, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                        {music.find((m) => m.id === review.music_id)?.title || 'Unknown release'}
                                    </p>
                                    <p style={{ opacity: 0.7, fontSize: '0.85rem', fontStyle: 'italic' }}>
                                        "{review.quote}"
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleEditReview(review)} style={{
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
                                    <button onClick={() => handleDelete(review.id)} style={{
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
                    <p style={{ opacity: 0.4 }}>No reviews yet.</p>
                )}


            </div>
        </main>
    )
}
