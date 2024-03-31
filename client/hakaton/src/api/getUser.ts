export interface User {
    email: string
    name: string
    theme: string
}
export const getUser: (id: string) => Promise<User> = async (id) => {
    const res = await fetch('http://localhost:3001/user?id=' + id)

    return res.json()
}
