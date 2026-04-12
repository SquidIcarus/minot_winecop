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

  const { data: merch } = await supabase
    .from('merch')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main style={{
      background: '#1a1410',
      color: '#f0e6d3',
      minHeight: '100vh',
      fontFamily: 'monospace',
    }}>

{/* ANCHOR - Album Showcase */}

      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8rem 2rem 4rem',
        textAlign: 'center',
      }}>
        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '2rem',
        }}>
{/* Large circle - live photo */}
          <div style={{
            width: 'clamp(280px, 60vw, 620px)',
            height: 'clamp(280px, 60vw, 620px)',
            borderRadius: '50%',
            overflow: 'hidden',
            position: 'relative',
            border: '3px solid #2e2218',
          }}>
            <Image
              src='/live-photo.jpg'
              alt='Minot live with psychedelic light swirl'
              fill
              style={{ objectFit: 'cover', objectPosition: 'center' }}
              priority
            />
          </div>

{/* Small circle - album cover overlapping bottom */}
          <div style={{
            width: 'clamp(120px, 22vw, 220px)',
            height: 'clamp(120px, 22vw, 220px)',
            borderRadius: '50%',
            overflow: 'hidden',
            position: 'absolute',
            bottom: '-60px',
            border: '4px solid #1a1410',
            zIndex: 10,
          }}>
            <Image
              src="/album-cover.png"
              alt="And You're Not - album cover"
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>

{/* Album title and link */}
        <div style={{ marginTop: '4rem' }}>
          <p style={{
            fontSize: '0.7rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            opacity: 0.5,
            marginBottom: '0.5rem',
          }}>
            New Album
          </p>
          <h1 style={{
            fontSize: 'clamp(1.8rem, 5vw, 3.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.02em',
            margin: '0 0 1.5rem',
            fontFamily: 'monospace',
          }}>
            And You're Not
          </h1>
          <a href='https://minot1.bandcamp.com/album/and-youre-not'
            target='_blank'
            rel='noopener noreferrer'
            style={{
              display: 'inline-block',
              background: '#e8355a',
              color: '#f0e6d3',
              padding: '0.75rem 2rem',
              textDecoration: 'none',
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}>
            Buy / Stream
          </a>
        </div>
      </section>

{/* ANCHOR - Merch Grid */}

      <section style={{
        padding: '4rem 2rem',
        borderTop: '1px solid #2e2218',
        borderBottom: '1px solid #2e2218',
      }}>
        <h2 style={{
          fontSize: '0.7rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          opacity: 0.5,
          marginBottom: '2rem',
          textAlign: 'center',
        }}>
          Merch
        </h2>
        {merch && merch.length > 0 ? (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '1.5rem',
            maxWidth: '1000px',
            margin: '0 auto',
          }}>
            {merch.map((item) => (
              
               <a key={item.id}
                href='https://minot1.bandcamp.com/merch'
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
                  overflow: 'hidden',
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
          <p style={{ opacity: 0.4, textAlign: 'center' }}>No merch yet. Check back soon.</p>
        )}
      </section>

{/* ANCHOR - Video */}

      <section style={{
        padding: '4rem 2rem',
        borderBottom: '1px solid #2e2218',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        <h2 style={{
          fontSize: '0.7rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          opacity: 0.5,
          marginBottom: '2rem',
          textAlign: 'center',
        }}>
          Watch
        </h2>
        <div style={{
          width: '100%',
          maxWidth: '800px',
          aspectRatio: '16/9',
          position: 'relative',
        }}>
          <iframe
            src='https://www.youtube.com/embed/-v5m6HAoOIM'
            title='Evil Twin - Minot'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
            }}
          />
        </div>
        <p style={{
          marginTop: '1rem',
          opacity: 0.4,
          fontSize: '0.8rem',
          letterSpacing: '0.1em',
        }}>
          Evil Twin — Live in Coeur d'Alene 12/06/2025
        </p>
      </section>

{/* ANCHOR - Upcoming Shows */}

      <section style={{
        padding: '4rem 2rem',
        borderBottom: '1px solid #2e2218',
        maxWidth: '800px',
        margin: '0 auto',
      }}>
        <h2 style={{
          fontSize: '0.7rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          opacity: 0.5,
          marginBottom: '2rem',
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
            gap: '0',
          }}>
            {gigs.map((gig) => (
              <li key={gig.id} style={{
                display: 'flex',
                gap: '2rem',
                alignItems: 'center',
                flexWrap: 'wrap',
                borderBottom: '1px solid #2e2218',
                paddingBottom: '1.5rem',
                marginBottom: '1.5rem',
              }}>
                {gig.flyer_url && (
                  <FlyerLightbox url={gig.flyer_url} venue={gig.venue} />
                )}
                <span style={{
                  fontFamily: 'monospace',
                  opacity: 0.5,
                  minWidth: '120px',
                  fontSize: '0.85rem',
                }}>
                  {gig.date}
                </span>
                <span style={{ fontWeight: 700 }}>{gig.venue}</span>
                <span style={{ opacity: 0.5 }}>
                  {gig.city}{gig.state ? `, ${gig.state}` : ''}
                </span>
                {gig.ticket_url && (
                  <a href={gig.ticket_url} target='_blank' rel='noopener noreferrer'
                    style={{
                      marginLeft: 'auto',
                      color: '#f0e6d3',
                      border: '1px solid #2e2218',
                      padding: '0.25rem 0.75rem',
                      textDecoration: 'none',
                      fontSize: '0.8rem',
                      letterSpacing: '0.1em',
                    }}>
                    Tickets ↗
                  </a>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ opacity: 0.4 }}>No upcoming shows. Check back soon.</p>
        )}
        <Link href='/gigs' style={{
          display: 'inline-block',
          marginTop: '1rem',
          color: '#f0e6d3',
          opacity: 0.5,
          fontSize: '0.8rem',
          letterSpacing: '0.15em',
          textDecoration: 'none',
          textTransform: 'uppercase',
        }}>
          All Shows →
        </Link>
      </section>

{/* ANCHOR - Email Subscribe */}

      <section style={{
        padding: '4rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}>
        <h2 style={{
          fontSize: '0.7rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          opacity: 0.5,
          marginBottom: '0.75rem',
        }}>
          Stay In The Loop
        </h2>
        <p style={{
          opacity: 0.4,
          fontSize: '0.85rem',
          marginBottom: '1.5rem',
        }}>
          Get updates on shows, releases, and other budget rock news.
        </p>
        <div style={{
          display: 'flex',
          gap: '0',
          width: '100%',
          maxWidth: '400px',
        }}>
          <input
            type='email'
            placeholder='your@email.com'
            style={{
              flex: 1,
              background: '#2e2218',
              border: '1px solid #3e3228',
              borderRight: 'none',
              color: '#f0e6d3',
              padding: '0.75rem 1rem',
              fontFamily: 'monospace',
              fontSize: '0.9rem',
              outline: 'none',
            }}
          />
          <button style={{
            background: '#e8355a',
            color: '#f0e6d3',
            border: 'none',
            padding: '0.75rem 1.25rem',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            fontWeight: 700,
          }}>
            Subscribe
          </button>
        </div>
      </section>

    </main>
  )
}