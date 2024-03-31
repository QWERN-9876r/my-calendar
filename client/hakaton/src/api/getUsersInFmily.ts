export interface Event {
    id: string
    name: string
    date: string
}

export const getUsersInFmily: (email: string) => Promise<string[] | { error: string }> = async (email) => {
    const res = await fetch('http://localhost:3001/users_in_family?email=' + email)

    return res.json()
}
