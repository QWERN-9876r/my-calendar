import { SERVER_URL } from './env.json' assert { type: 'json' }

export const addEvent: (
    email: string,
    name: string,
    description: string,
    date: string,
) => Promise<{ error: string } | boolean> = async (email, name, description, date) => {
    const res = await fetch(SERVER_URL + '/addEvent', {
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
