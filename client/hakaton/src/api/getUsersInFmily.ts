import { SERVER_URL } from './env.json' assert { type: 'json' }

export interface Event {
    id: string
    name: string
    date: string
}

export const getUsersInFmily: (email: string) => Promise<string[] | { error: string }> = async (email) => {
    const res = await fetch(SERVER_URL + '/users_in_family?email=' + email)

    return res.json()
}
