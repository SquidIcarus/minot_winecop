import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers' 

export default async function MerchPage() {
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

    const { data: merch, error } = await supabase
        .from('merch')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error(error)
        return <div>Error loading merch.</div>
    }

    return (
        <main>
            <h1>Merch</h1>
            {merch && merch.length > 0 ? (
                <ul>
                    {merch.map((item) => (
                        <li key={item.id}>
                            {item.image_url && (
                                <img src={item.image_url} alt={item.name} width={200} />
                            )}
                            <p>{item.name}</p>
                            <p>${item.price.toFixed(2)}</p>
                            {item.description && <p>{item.description}</p>}
                            {item.available ? (
                                <p>In Stock</p>
                            ) : (
                                <p>Sold Out</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No merch available at the moment. Check back soon!</p>
            )}
        </main>
    )
}