import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import FlyerLightbox from '../components/FlyerLightbox'

export default async function GigsPage() {
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

    const { data: gigs, error } = await supabase
        .from('gigs')
        .select('*')
        .order('date', { ascending: true })

    if (error) {
        console.error(error)
        return <div>Error loading gigs.</div>
    }

    return (
        <main style={{
            background: '#1a1410',
            color: '#f0e6d3',
            minHeight: '100vh',
            fontFamily: 'monospace',
            padding: '8rem 2rem 4rem',
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                <h1 style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.3em',
                    textTransform: 'uppercase',
                    opacity: 0.5,
                    marginBottom: '3rem',
                }}>
                    Shows
                </h1>

                {gigs && gigs.length > 0 ? (
                    <ul style={{
                        listStyle: 'none',
                        padding: 0,
                        margin: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0',
                    }}>
                        {gigs.map((gig) => (
                            <li key={gig.id} style={{
                                display: 'flex',
                                gap: '2rem',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                borderBottom: '1px solid #2e2218',
                                padding: '1.5rem 0',
                            }}>
                                <span style={{
                                    opacity: 0.5,
                                    minWidth: '120px',
                                    fontSize: '0.85rem',
                                }}>
                                    {gig.date}
                                </span>
                                <div>
                                    <p style={{ fontWeight: 700 }}>{gig.venue}</p>
                                    <p style={{ opacity: 0.5, fontSize: '0.85rem', marginTop: '0.25rem' }}>
                                        {gig.city}{gig.state ? `, ${gig.state}` : ''}
                                    </p>
                                </div>
                                {gig.flyer_url && (
                                    <div style={{ marginLeft: 'auto' }}>
                                        <FlyerLightbox url={gig.flyer_url} venue={gig.venue} />
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p style={{ opacity: 0.4 }}>No upcoming shows. Check back soon!</p>
                )}
            </div>
        </main>
    )
}