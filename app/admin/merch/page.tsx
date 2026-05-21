'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import Link from 'next/link'

type Merch = {
    id: string
    name: string
    description: string | null
    price: number
    image_url: string | null
    available: boolean
    bandcamp_url: string | null
}

export default function AdminMerchPage() {
    const [merch, setMerch] = useState<Merch[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [available, setAvailable] = useState(true)
    const [bandcampUrl, setBandcampUrl] = useState('')
    const [imageFile, setImageFile] = useState<File | null>(null)
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
            fetchMerch()
        }
        init()
    }, [])

    async function fetchMerch() {
        const { data, error } = await supabase 
            .from('merch')
            .select('*')
            .order('created_at', { ascending: false })
        if (error) {
            setError('Error loading merch.')
        } else {
            setMerch(data || [])
        }
        setLoading(false)
    }

    async function handleSave(e: React.SyntheticEvent) {
        e.preventDefault()
        setSaving(true)
        setError('')

        let imageUrl: string | null = null

        if (imageFile) {
            const fileExt = imageFile.name.split('.').pop()
            const fileName = `merch-${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('flyers')
                .upload(fileName, imageFile)

            if (uploadError) {
                setError('Error uploading image.')
                setSaving(false)
                return
            }
            
            const { data } = supabase.storage
                .from('flyers')
                .getPublicUrl(fileName)

            imageUrl = data.publicUrl
        }

        if (editingId) {
            const { error } = await supabase
                .from('merch')
                .update({
                    name,
                    description: description || null,
                    price: parseFloat(price),
                    available,
                    bandcamp_url: bandcampUrl || null,
                    ...(imageUrl && { image_url: imageUrl }),
                })
                .eq('id', editingId)
            
            if (error) {
                setError('Error updating item.')
            } else {
                resetForm()
                fetchMerch()
            }
        } else {
            const { error } = await supabase
                .from('merch')
                .insert([{
                    name,
                    description: description || null,
                    price: parseFloat(price),
                    available,
                    bandcamp_url: bandcampUrl || null,
                    image_url: imageUrl,
                }])

            if (error) {
                setError('Error adding item.')
            } else {
                resetForm()
                fetchMerch()
            }
        }
        setSaving(false)
    }

    function resetForm() {
        setEditingId(null)
        setName('')
        setDescription('')
        setPrice('')
        setAvailable(true)
        setBandcampUrl('')
        setImageFile(null)
    }

    function handleEditMerch(item: Merch) {
        setEditingId(item.id)
        setName(item.name)
        setDescription(item.description || '')
        setPrice(item.price.toString())
        setAvailable(item.available)
        setBandcampUrl(item.bandcamp_url || '')
        setImageFile(null)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    function handleCancelEdit() {
        resetForm()
    }

    async function handleDelete(id: string) {
        if (!confirm('Delete this item?')) return

        const { error } = await supabase
            .from('merch')
            .delete()
            .eq('id', id)

        if (error) {
            setError('Error deleting item.')
        } else {
            fetchMerch()
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
            padding: '4rem 2rem'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

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
                        Manage Merch
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
{/* ANCHOR - Add/Edit Form */}

                <form onSubmit={handleSave} style={{
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
                        {editingId ? 'Edit Item' : 'Add Item'}
                    </h2>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={labelStyle}>Name</label>
                            <input
                                type='text'
                                placeholder='Item name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>
                        <div>
                            <label style={labelStyle}>Price</label>
                            <input
                                type='number'
                                placeholder='0.00'
                                step='0.01'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={labelStyle}>Description (optional)</label>
                        <input
                            type='text'
                            placeholder='Brief description'
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Bandcamp URL</label>
                        <input
                            type='url'
                            placeholder='https://minot1.bandcamp.com/merch/...'
                            value={bandcampUrl}
                            onChange={(e) => setBandcampUrl(e.target.value)}
                            style={inputStyle}
                        />
                    </div>

                    <div>
                        <label style={labelStyle}>Image</label>
                        <input
                            type='file'
                            accept='image/*'
                            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                            style={{
                                ...inputStyle,
                                padding: '0.5rem',
                                cursor: 'pointer',
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <input
                            type='checkbox'
                            id='available'
                            checked={available}
                            onChange={(e) => setAvailable(e.target.checked)}
                            style={{ cursor: 'pointer' }}
                        />
                        <label htmlFor='available' style={{ ...labelStyle, marginBottom: 0, opacity: 0.7, cursor: 'pointer' }}>
                            Available
                        </label>
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
                            {saving ? 'Saving...' : editingId ? 'Update Item' : 'Add Item'}
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

{/* ANCHOR - Existing Merch */}

                <h2 style={{
                    fontSize: '0.75rem',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    opacity: 0.5,
                    marginBottom: '1.5rem'
                }}>
                    Existing Items
                </h2>

                {merch.length > 0 ? (
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0'
                    }}>
                        {merch.map((item) => (
                            <li key={item.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem 0',
                                borderBottom: '1px solid #1a1a1a',
                                gap: '1rem',
                                flexWrap: 'wrap'
                            }}>
                                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                    {item.image_url && (
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    )}
                                    <div>
                                        <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
                                            {item.name}
                                        </p>
                                        <p style={{ opacity: 0.5, fontSize: '0.85rem' }}>
                                            ${item.price.toFixed(2)} — {item.available ? 'In Stock' : 'Sold Out'}
                                        </p>
                                        {item.bandcamp_url && (
                                            <p style={{ opacity: 0.3, fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                                {item.bandcamp_url}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleEditMerch(item)} style={{
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
                                    <button onClick={() => handleDelete(item.id)} style={{
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
                    <p style={{ opacity: 0.4 }}>No merch items yet.</p>
                )}

            </div>
        </main>
    )
}