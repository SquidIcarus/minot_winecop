import supabase from '@/lib/supabase'

export default async function GigsPage() {
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