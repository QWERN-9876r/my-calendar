import { SERVER_URL } from './env.json' assert { type: 'json' }

export interface Event {
    id: string
    date: string | Date
    name: string
    description: string
}
let showOnlyMyEvents = false

let store = [null, false]

export const getEvents: (email: string) => Promise<{ error: string } | Event[]> = async (email) => {
    if (store[0] && store[1] === showOnlyMyEvents) return store[0]
    const res = await fetch(`${SERVER_URL}/events?email=${email}&myOnly=${Number(showOnlyMyEvents)}`)
    const sol = await res.json()

    store = [sol, showOnlyMyEvents]

    return sol
}

export function changeShowOnlyMyEvents(value: boolean) {
    showOnlyMyEvents = value
}
export function getShowOnlyMyEvents() {
    return showOnlyMyEvents
}
