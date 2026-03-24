import Image from 'next/image'
import Link from 'next/link'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import FlyerLightbox from './components/FlyerLightbox'

export default async function HomePage() {
  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )

  const { data: gigs } = await supabase
    .from('gigs')
    .select('*')
    .order('date', { ascending: true })
    .limit(3)

  const { data: music } = await supabase
    .from('music')
    .select('*')
    .order('release_date', { ascending: false })
    .limit(1)

  return (
    <main style={{ 
      background: '#0a0a0a', 
      color: '#f0ece4', 
      minHeight: '100vh', 
      fontFamily: 'monospace' 
    }}>
      
{ /* ANCHOR - Hero */ }

      <section style={{ 
        position: 'relative', 
        width: '100%', 
        height: '80vh' 
      }}>
        <Image
          src="/Minot_band_photo.jpg"
          alt="Minot band photo"
          fill
          style={{ 
            objectFit: 'cover', 
            objectPosition: '50% 17%', 
            filter: 'grayscale(30%) contrast(1.1) brightness(0.55)' 
          }}
          priority
        />
        <div style={{
          position: 'absolute', 
          inset: 0,
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          textAlign: 'center', 
          padding: '0 1rem'
        }}>
          <h1 style={{ 
            fontSize: 'clamp(3rem, 10vw, 7rem)', 
            fontWeight: 900, 
            letterSpacing: '-0.02em', 
            margin: 0, 
            textTransform: 'uppercase' 
          }}>
          MINOT
          </h1>
          <p style={{ 
            fontSize: 'clamp(0.85rem, 2vw, 1.1rem)', 
            letterSpacing: '0.2em', 
            marginTop: '0.75rem', 
            opacity: 0.7, 
            textTransform: 'uppercase' 
          }}>
          budget rock...on a budget
          </p>
        </div>

        <div className='desktop-nav-bar' style={{
          position: 'absolute', 
          bottom: 0, 
          left: 0, 
          right: 0,
          background: 'rgba(10, 10, 10, 0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex', 
          justifyContent: 'center',
          gap: '3rem', 
          padding: '1rem 2rem',
        }}>
          {[
            { label: 'Shows', href: '/gigs' },
            { label: 'Music', href: '/music' },
            { label: 'Merch', href: '/merch' },
            { label: 'About', href: '/about' },
          ].map(({ label, href }) => (
            <a key={label} href={href}
              style={{
                color: '#f0ece4', 
                textDecoration: 'none',
                fontFamily: 'monospace', 
                fontSize: '0.85rem',
                letterSpacing: '0.2em', 
                textTransform: 'uppercase',
                opacity: 0.85,
              }}>
              {label}
            </a>
          ))}
        </div>  
      </section>

{ /* ANCHOR - Music */ }

      {music && music.length > 0 && (
        <section style={{ 
          padding: '4rem 2rem', 
          borderBottom: '1px solid #222' 
          }}>
          <h2 style={{ 
            fontSize: '0.75rem', 
            letterSpacing: '0.25em', 
            textTransform: 'uppercase', 
            opacity: 0.5, 
            marginBottom: '1rem' 
          }}>
          Latest Release
          </h2>
          <p style={{ 
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', 
            fontWeight: 700 
          }}>
            {music[0].title}</p>
          <p style={{ 
            opacity: 0.5, marginTop: '0.5rem' 
          }}>
            {music[0].type} — {music[0].release_date}</p>
          <div style={{ 
            display: 'flex', 
            gap: '1rem', 
            marginTop: '1.5rem', 
            flexWrap: 'wrap' 
          }}>
            {music[0].bandcamp_url && (
              <a href={music[0].bandcamp_url} target="_blank" rel="noopener noreferrer"
                style={{ 
                  color: '#f0ece4', 
                  borderBottom: '1px solid #f0ece4', 
                  paddingBottom: '2px', 
                  textDecoration: 'none', 
                  fontSize: '0.9rem', 
                  letterSpacing: '0.1em' 
                }}>
              Bandcamp
              </a>
            )}
            {music[0].spotify_url && (
              <a href={music[0].spotify_url} target="_blank" rel="noopener noreferrer"
                style={{ 
                  color: '#f0ece4', 
                  borderBottom: '1px solid #f0ece4', 
                  paddingBottom: '2px', 
                  textDecoration: 'none', 
                  fontSize: '0.9rem', 
                  letterSpacing: '0.1em' 
                }}>
              Spotify
              </a>
            )}
          </div>
        </section>
      )}

{ /* ANCHOR - Gigs */ }

      <section style={{ 
        padding: '4rem 2rem', 
        borderBottom: '1px solid #222' 
      }}>
        <h2 style={{ 
          fontSize: '0.75rem', 
          letterSpacing: '0.25em', 
          textTransform: 'uppercase', 
          opacity: 0.5, 
          marginBottom: '2rem' 
        }}>
        Upcoming Shows
        </h2>
        {gigs && gigs.length > 0 ? (
          <ul style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0, 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1.5rem' 
          }}>
            {gigs.map((gig) => (
              <li key={gig.id} 
              style={{ 
                display: 'flex', 
                gap: '2rem', 
                alignItems: 'center', 
                flexWrap: 'wrap', 
                borderBottom: '1px solid #1a1a1a', 
                paddingBottom: '1.5rem' 
              }}>
                {gig.flyer_url && (
                  <FlyerLightbox url={gig.flyer_url} venue={gig.venue} />
                )}
                <span style={{ 
                  fontFamily: 'monospace', 
                  opacity: 0.5, 
                  minWidth: '120px' 
                }}>
                  {gig.date}</span>
                <span style={{ 
                  fontWeight: 700 
                }}>
                  {gig.venue}</span>
                <span style={{ 
                  opacity: 0.5 
                }}>
                  {gig.city}{gig.state ? `, ${gig.state}` : ''}</span>
                {gig.ticket_url && (
                  <a href={gig.ticket_url} target="_blank" rel="noopener noreferrer"
                    style={{ 
                      marginLeft: 'auto', 
                      color: '#f0ece4', 
                      border: '1px solid #333', 
                      padding: '0.25rem 0.75rem', 
                      textDecoration: 'none', 
                      fontSize: '0.8rem', 
                      letterSpacing: '0.1em' 
                    }}>
                  Tickets
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ 
            opacity: 0.4 
          }}>No upcoming shows. Check back soon.</p>
        )}
        <Link href="/gigs" style={{ 
          display: 'inline-block', 
          marginTop: '2rem', 
          color: '#f0ece4', 
          opacity: 0.5, 
          fontSize: '0.8rem', 
          letterSpacing: '0.15em', 
          textDecoration: 'none', 
          textTransform: 'uppercase' 
        }}>
        All Shows
        </Link>
      </section>

{ /* ANCHOR - Links */ }

      <section style={{ 
        padding: '4rem 2rem' 
        }}>
        <h2 style={{ 
          fontSize: '0.75rem', 
          letterSpacing: '0.25em', 
          textTransform: 'uppercase', 
          opacity: 0.5, 
          marginBottom: '2rem' 
        }}>
        Find Us
        </h2>
        <div style={{ 
          display: 'flex', 
          gap: '2rem', 
          flexWrap: 'wrap' 
        }}>
          {[
            { label: 'Bandcamp', url: 'https://minot1.bandcamp.com/' },
            { label: 'Instagram', url: 'https://www.instagram.com/minot_winecop/' },
            { label: 'Facebook', url: 'https://www.facebook.com/minot.whyknot' },
            { label: 'YouTube', url: 'https://www.youtube.com/@MINOT_MT' },
            { label: 'Linktree', url: 'https://linktr.ee/minot_whyknot' },
          ].map(({ label, url }) => (
            <a key={label} href={url} target="_blank" rel="noopener noreferrer"
              style={{ 
                color: '#f0ece4', 
                borderBottom: '1px solid #444', 
                paddingBottom: '2px', 
                textDecoration: 'none', 
                fontSize: '0.9rem', 
                letterSpacing: '0.1em' 
              }}>
              {label}
            </a>
          ))}
        </div>
      </section>

    </main>
  )
}