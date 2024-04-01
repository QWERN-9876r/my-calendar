import { SERVER_URL } from './env.json' assert { type: 'json' }

export const deleteEvent: (email: string, id: string) => Promise<boolean | { error: string }> = async (email, id) => {
    const res = await fetch(SERVER_URL + '/deleteEvent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            id,
        }),
    })

    return res.ok || res.json()
}
