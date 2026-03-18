import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers' 

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

    if (error) {
        console.error(error)
        return <div>Error loading music.</div>
    }

    return (
        <main>
            <h1>Music</h1>
            {music && music.length > 0 ? (
                <ul>
                    {music.map((release) => (
                        <li key={release.id}>
                            <p>{release.title}</p>
                            <p>{release.type}</p>
                            <p>{release.release_date}</p>
                            {release.bandcamp_url && (
                                <a href={release.bandcamp_url} target='_blank' rel='noopener noreferrer'>
                                    Bandcamp
                                </a>
                            )}
                            {release.spotify_url && (
                                <a href={release.spotify_url} target='_blank' rel='noopener noreferrer'>
                                    Spotify
                                </a>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No music yet. Check back soon!</p>
            )}
        </main>
    )
}