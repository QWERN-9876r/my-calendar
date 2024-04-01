import { SERVER_URL } from './env.json' assert { type: 'json' }

export const addUserInFamily: (email: string, addedEmail: string) => Promise<boolean> = async (email, addedEmail) => {
    const res = await fetch(SERVER_URL + '/add_user_in_family', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email,
            addedEmail,
        }),
    })

    return res.ok
}
