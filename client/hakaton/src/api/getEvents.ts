export interface Event {
    id: string
    date: string | Date
    name: string
    description: string
}

export const getEvents: (email: string) => Promise<{ error: string } | Event[]> = async (email) => {
    const res = await fetch('http://localhost:3001/events?email=' + email)

    return res.json()
}
