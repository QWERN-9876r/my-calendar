import { SERVER_URL } from './env.json' assert { type: 'json' }

export const createFamily: (email: string) => Promise<boolean> = async (email) => {
    const res = await fetch(SERVER_URL + '/create_family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
        }),
    })

    return res.ok
}
