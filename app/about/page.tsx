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
                maxWidth: '1000px',
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '3rem',
            }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '1rem',
                    width: '100%',
                }}>
                    {['slug1.mp4', 'slug2.mp4', 'slug3.mp4'].map((src) => (
                        <video
                            key={src}
                            src={`/${src}`}
                            autoPlay
                            muted
                            loop
                            playsInline
                            style={{
                                width: '100%',
                                objectFit: 'cover',
                            }}
                        />
                    ))}
                </div>
                <p style={{
                    fontSize: 'clamp(1rem, 3vw, 1.5rem)',
                    letterSpacing: '0.1em',
                    opacity: 0.7,
                    fontStyle: 'italic',
                }}>
                    Budget Rock.... On a budget.
                </p>
            </div>
        </main>
    )
}