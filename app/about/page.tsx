import Image from 'next/image'

export default function AboutPage() {
    return (
        <main style={{
            background: '#1a1410',
            color: '#f0e6d3',
            minHeight: '100vh',
            fontFamily: 'monospace',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '8rem 2rem 4rem',
            textAlign: 'center',
        }}>
            <div style={{
                maxWidth: '600px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem',
            }}>
                <div style={{
                    width: '100%',
                    aspectRatio: '1',
                    position: 'relative',
                    overflow: 'hidden',
                }}>
                    <Image
                        src='/Minot_band_photo.jpg'
                        alt='Minot band photo, looking unwell in a stairwell'
                        fill
                        style={{ 
                            objectFit: 'cover',
                            objectPosition: '50% 20%' }}
                            priority
                    />
                </div>
                <p style={{ 
                    fontSize: 'clamp(1rem, 3vw, 1.5rem)', 
                    letterSpacing: '0.1em', 
                    opacity: 0.7,
                }}>
                    Budget Rock... On a budget.
                </p>
            </div>
        </main>
    )
}