import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

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
        <main>
            <h1>Upcoming Shows</h1>
            {gigs && gigs.length > 0 ? (
                <ul>
                    {gigs.map((gig) => (
                        <li key={gig.id}>
                            <p>{gig.date}</p>
                            <p>{gig.venue}</p>
                            <p>{gig.city}{gig.state ? `, ${gig.state}` : ''}</p>
                            {gig.ticket_url && (
                                <a href={gig.ticket_url} target="_blank" rel="noopener noreferrer">
                                    Buy Tickets
                                </a>
                            )}
                            {gig.notes && <p>{gig.notes}</p>}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No upcoming shows. Check back soon!</p>
            )}
        </main>
    )
}