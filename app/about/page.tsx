export default function AboutPage() {
    const members = [
        {
            name: 'Minot 1',
            role: 'Guitar / Vox',
            bio: 'Bio goes here.'
        },
        {
            name: 'Minot 2',
            role: 'Guitar / Vox',
            bio: 'Bio goes here.'
        },
        {
            name: 'Minot 3',
            role: 'Floor Tom',
            bio: 'Bio goes here.'
        }
    ]

    return (
        <main>
            <h1>About</h1>
            <section>
                <p>Let me introduce the adolescent neanderthals themselves, Minot.  These overgrown teenage garage-punk muffins bring their take on the raw, the cheap and the lo-fidelity. The three-piece from Missoula, MT embodies the primitive, sloppy roots of everything that is, budget rock. A poorly contained train wreck influenced by punk, 60's garage-pop and country blues.</p>
            </section>
            <section>
                <h2>Mutants</h2>
                <ul>
                    {members.map((member) => (
                        <li key={member.name}>
                            <h3>{member.name}</h3>
                            <p>{member.role}</p>
                            <p>{member.bio}</p>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    )
}