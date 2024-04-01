import { SERVER_URL } from './env.json' assert { type: 'json' }

export const deleteUserFromFamily: (id: string) => Promise<boolean> = async (id) => {
    const res = await fetch(SERVER_URL + '/delete_user_in_family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id,
        }),
    })

    return res.ok
}
