import { SERVER_URL } from './env.json' assert { type: 'json' }

export interface User {
    email: string
    name: string
    theme: string
}
export const getUser: (id: string) => Promise<User> = async (id) => {
    const res = await fetch(SERVER_URL + '/user?id=' + id)

    return res.json()
}
