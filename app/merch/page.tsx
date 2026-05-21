import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Image from 'next/image' 

export default async function MerchPage() {
    const cookieStore = await cookies()

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
        {
            cookies: {
                getAll: () => cookieStore.getAll(),
                setAll: () => {},
            },
        }
    )

    const { data: merch, error } = await supabase
        .from('merch')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error(error)
        return <div>Error loading merch.</div>
    }

    return (
        <main style={{
            background: '#1a1410',
            color: '#f0e6d3',
            minHeight: '100vh',
            fontFamily: 'monospace',
            padding: '8rem 2rem 4rem',
        }}>
            <div style={{
                maxWidth: '1000px',
                margin: '0 auto'
            }}>

                <h1 style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    opacity: 0.5,
                    marginBottom: '3rem',
                }}>
                    Merch
                </h1>

                {merch && merch.length > 0 ? (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                        gap: '2rem',
                    }}>
                        {merch.map((item) => (

                            <a  key={item.id}
                                href={item.bandcamp_url || 'https://minot1.bandcamp.com/merch'}
                                target='_blank'
                                rel='noopener noreferrer'
                                style={{
                                    textDecoration: 'none',
                                    color: '#f0e6d3',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.75rem',
                                }}
                            >
                                <div style={{
                                    width: '100%',
                                    aspectRatio: '1',
                                    background: '#2e2218',
                                    position: 'relative',
                                }}>
                                    {item.image_url ? (
                                        <Image
                                            src={item.image_url}
                                            alt={item.name}
                                            fill
                                            style={{ objectFit: 'cover' }}
                                        />
                                    ) : (
                                            <div style={{
                                                width: '100%',
                                                height: '100%',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                opacity: 0.3,
                                                fontSize: '0.75rem',
                                                letterSpacing: '0.1em',
                                            }}>
                                                No image
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p style={{
                                            fontWeight: 700,
                                            fontSize: '0.9rem',
                                            marginBottom: '0.25rem',
                                        }}>
                                            {item.name}
                                        </p>
                                        <p style={{
                                            opacity: 0.5,
                                            fontSize: '0.85rem',
                                        }}>
                                            ${item.price.toFixed(2)}
                                        </p>
                                        {!item.available && (
                                            <p style={{
                                                color: '#e8355a',
                                                fontSize: '0.75rem',
                                                letterSpacing: '0.1em',
                                                textTransform: 'uppercase',
                                                marginTop: '0.25rem',
                                            }}>
                                                Sold Out
                                            </p>
                                        )}
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p style={{ opacity: 0.4 }}>No merch available right now. Check back soon!</p>
                    )}

                </div>
            </main>
        )
    }