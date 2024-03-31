import { createHash, randomUUID } from 'crypto'

export function sha256(value: string) {
    return createHash('sha256').update(value).digest('hex')
}
export interface Event {
    id: string
    date: string
    name: string
    description: string
    creatorName: string
}

export class Event {
    constructor(date: string, name: string, description: string, creatorName: string) {
        this.id = randomUUID()
        this.date = date
        this.name = name
        this.description = description
        this.creatorName = creatorName
    }
}
