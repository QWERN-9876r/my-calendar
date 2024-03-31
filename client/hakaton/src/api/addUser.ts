export interface User {
    email: string
    name: string
    theme: string
}

export const addUser: (user: User) => Promise<boolean> = async (user) => {
    const res = await fetch('http://localhost:3001/addUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    })

    return res.ok
}
