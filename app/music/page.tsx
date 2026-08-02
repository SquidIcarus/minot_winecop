import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import Image from 'next/image' 

export default async function MusicPage() {
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

    const { data: music, error } = await supabase
        .from('music')
        .select('*')
        .order('release_date', { ascending: false })

   const { data: reviews, error: reviewsError } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false })

if (reviewsError) console.error('Reviews error:', reviewsError)

    if (error) {
        console.error(error)
        return <div>Error loading music.</div>
    }

    return (
        <main style={{
            background: '#1a1410',
            color: '#f0e6d3',
            minHeight: '100vh',
            fontFamily: 'monospace',
            padding: '8rem 2rem 4rem',
        }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                <h1 style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    opacity: 0.5,
                    marginBottom: '3rem',
                }}>
                    Music
                </h1>

                {music && music.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                        {['Album', 'EP', '7" Single', 'Single', 'Compilation'].map((category) => {
                            const releases = music.filter((r) => r.type === category)
                            if (releases.length === 0) return null

                            return (
                                <div key={category}>
                                    <h2 style={{
                                        fontSize: '0.7rem',
                                        letterSpacing: '0.3em',
                                        textTransform: 'uppercase',
                                        opacity: 0.4,
                                        marginBottom: '1.5rem',
                                        borderBottom: '1px solid #2e2218',
                                        paddingBottom: '0.75rem',
                                    }}>
                                        {category}s
                                    </h2>
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                                        gap: '2rem',
                                    }}>
                                        {releases.map((release) => (
                                            <div key={release.id} style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '0.75rem',
                                            }}>
                    {/* Cover Art */}
                                                <div style={{
                                                    width: '100%',
                                                    aspectRatio: '1',
                                                    background: '#2e2218',
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                }}>
                                                    {release.cover_art_url ? (
                                                        <Image
                                                            src={release.cover_art_url}
                                                            alt={release.title}
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
                            {/* Release Info */}
                                                <div>
                                                    <p style={{
                                                        fontSize: '0.65rem',
                                                        letterSpacing: '0.2em',
                                                        textTransform: 'uppercase',
                                                        opacity: 0.4,
                                                        marginBottom: '0.25rem',
                                                    }}>
                                                        {release.release_date}
                                                    </p>
                                                    <p style={{
                                                        fontWeight: 700,
                                                        fontSize: '1rem',
                                                        marginBottom: '0.75rem',
                                                    }}>
                                                        {release.title}
                                                    </p>
                                {/* Links */}
                                                    <div style={{
                                                        display: 'flex',
                                                        gap: '0.75rem',
                                                        flexWrap: 'wrap',
                                                    }}>
                                                        {release.bandcamp_url && (
                                                            <a
                                                                href={release.bandcamp_url}
                                                                target='_blank'
                                                                rel='noopener noreferrer'
                                                                style={{
                                                                    color: '#1a1410',
                                                                    background: '#e8355a',
                                                                    fontSize: '0.75rem',
                                                                    letterSpacing: '0.15em',
                                                                    textDecoration: 'none',
                                                                    padding: '0.4rem 0.85rem',
                                                                    fontWeight: 700,
                                                                    textTransform: 'uppercase',
                                                                    fontFamily: 'monospace',
                                                                }}>
                                                                Bandcamp
                                                            </a>
                                                        )}
                                                        {release.spotify_url && (
                                                            <a
                                                                href={release.spotify_url}
                                                                target='_blank'
                                                                rel='noopener noreferrer'
                                                                style={{
                                                                    color: '#1a1410',
                                                                    background: '#e8355a',
                                                                    fontSize: '0.75rem',
                                                                    letterSpacing: '0.15em',
                                                                    textDecoration: 'none',
                                                                    padding: '0.4rem 0.85rem',
                                                                    fontWeight: 700,
                                                                    textTransform: 'uppercase',
                                                                    fontFamily: 'monospace',
                                                                }}>
                                                                Spotify
                                                            </a>
                                                        )}
                                                    </div>
                                {/* Reviews */}
                                
                                                    {reviews && reviews.filter((r) => Number(r.music_id) === Number(release.id)).length > 0 && (
                                                        <div style={{
                                                            marginTop: '1rem',
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            gap: '0.75rem',
                                                        }}>
                                                            {reviews.filter((r) => Number(r.music_id) === Number(release.id)).map((review) => (
                                                                <div key={review.id} style={{
                                                                borderLeft: '2px solid #e8355a',
                                                                paddingLeft: '0.75rem',
                                                            }}>
                                                                {review.url ? (
                                                                    <a href={review.url} target='_blank' rel='noopener noreferrer'
                                                                        style={{
                                                                            fontSize: '0.8rem',
                                                                            letterSpacing: '0.1em',
                                                                            textTransform: 'uppercase',
                                                                            color: '#f0e6d3',
                                                                            textDecoration: 'none',
                                                                            display: 'block',
                                                                            marginBottom: '0.25rem',
                                                                            fontWeight: 700,
                                                                        }}>
                                                                        {review.publication}
                                                                    </a>
                                                                ) : (
                                                                    <p style={{
                                                                        fontSize: '0.8rem',
                                                                        letterSpacing: '0.1em',
                                                                        textTransform: 'uppercase',
                                                                        color: '#f0e6d3',
                                                                        marginBottom: '0.25rem',
                                                                        fontWeight: 700,
                                                                    }}>
                                                                        {review.publication}
                                                                    </p>
                                                                )}
                                                                <p style={{
                                                                    fontSize: '0.8rem',
                                                                    fontStyle: 'italic',
                                                                    opacity: 0.7,
                                                                }}>
                                                                    "{review.quote}"
                                                                </p>
                                                            </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <p style={{ opacity: 0.4 }}>No music yet. Check back soon!</p>
                )}
            </div>
        </main>
    )
}