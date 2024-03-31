export const addEvent: (
    email: string,
    name: string,
    description: string,
    date: string,
) => Promise<{ error: string } | boolean> = async (email, name, description, date) => {
    const res = await fetch('http://localhost:3001/addEvent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            name,
            description,
            date,
        }),
    })

    return res.ok || res.json()
}
