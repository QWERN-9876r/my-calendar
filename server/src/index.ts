import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { family, users } from './models.js'
import colors from 'colors'
import { Event } from './helpers.js'

await mongoose.connect('mongodb://localhost:27017/myCalendar')

const usersCollection = await users.createCollection()
const familiesCollection = await family.createCollection()

const app = express()

app.use(express.json())
app.use(cors())

app.post('/addUser', async (req, res) => {
    try {
        const { email, name, theme } = req.body
        if (await users.findOne({ email })) return res.sendStatus(200)
        const newUser = new users({
            email,
            name,
            theme,
        })
        await usersCollection.insertOne(newUser)
        res.sendStatus(200)
    } catch (err) {
        console.error((err as Error).message.bold().red)
        res.sendStatus(500)
    }
})
app.post('/create_family', async (req, res) => {
    console.log(req.body)

    if (!req.body || !req.body.email) {
        return res.sendStatus(400)
    }
    const user = await users.findOne({ email: req.body.email })
    if (!user) return res.status(400).json({ error: 'No such user' })

    const newFamily = new family({
        participants: [user._id],
    })

    if (await familiesCollection.findOne({ participants: { $all: [user._id] } })) {
        return res.sendStatus(400).json({ error: 'The family already exists' })
    }

    familiesCollection.insertOne(newFamily)

    res.sendStatus(200)
})
app.post('/add_user_in_family', async (req, res) => {
    console.log(req.body)

    if (!req.body || !req.body.email || !req.body.addedEmail) {
        return res.sendStatus(400)
    }

    const user = await users.findOne({ email: req.body.email })
    const addedUser = await users.findOne({ email: req.body.addedEmail })

    if (!user || !addedUser) return res.json({ error: 'No such user' })

    const thisFamily = await familiesCollection.findOne({ participants: { $all: [user._id] } })

    if (!thisFamily) return res.json({ error: 'No such family' })
    thisFamily.participants.push(addedUser._id)

    familiesCollection.updateOne(
        { participants: { $all: [user._id] } },
        { $set: { participants: thisFamily.participants } },
    )

    res.sendStatus(200)
})

app.post('/delete_user_in_family', async (req, res) => {
    if (!req.body || !req.body.id) {
        return res.sendStatus(400)
    }
    const { id } = req.body

    const user = await users.findById(id)
    if (!user) return res.status(400).json({ error: 'No such user' })

    const thisFamily = await familiesCollection.findOne({ participants: { $all: [user?._id] } })

    if (!thisFamily) return res.json({ error: 'No such family' })

    thisFamily.participants = thisFamily.participants.filter((id: typeof user._id) => !user._id.equals(id))

    familiesCollection.updateOne(
        { participants: { $all: [user._id] } },
        { $set: { participants: thisFamily.participants } },
    )

    res.sendStatus(200)
})

app.get('/users_in_family', async (req, res) => {
    if (!req.query.email) {
        return res.sendStatus(400)
    }

    const user = await usersCollection.findOne(
        { email: req.query.email },
        {
            checkKeys: true,
        },
    )

    if (!user) return res.status(400).json({ error: 'No such user' })

    const thisFamily = await familiesCollection.findOne({
        participants: { $all: [user._id] },
    })

    if (!thisFamily) return res.status(400).json({ error: 'No such family' })

    res.json(thisFamily.participants)
})

app.get('/user', async (req, res) => {
    if (!req.query.id) return res.status(400).json({ error: 'No such id' })

    const user = await users.findById(req.query.id)

    res.json(user)
})
app.post('/addEvent', async (req, res) => {
    if (!req.body || !req.body.name || typeof req.body.description !== 'string' || !req.body.date || !req.body.email) {
        return res.status(400).json({ error: 'No such data in body' })
    }

    const user = await users.findOne({ email: req.body.email })

    if (!user) return res.status(400).json({ error: 'No such user' })

    const newEvent = new Event(req.body.date, req.body.name, req.body.description, user.name as string)

    user.events.push(newEvent)

    usersCollection.updateOne({ email: req.body.email }, { $set: { events: user.events } })

    res.sendStatus(200)
})
app.get('/events', async (req, res) => {
    if (!req.query.email) {
        return res.status(400).json({ error: 'No such email' })
    }

    const user = await users.findOne({ email: req.query.email })

    if (!user) return res.status(400).json({ error: 'No such user' })

    const thisFamily = await familiesCollection.findOne({ participants: { $all: [user?._id] } })

    if (!thisFamily) return res.json(user.events)

    res.json(
        (
            await Promise.all(
                thisFamily.participants.map(async (id: string) => {
                    const user = await users.findById(id)

                    return user?.events
                }),
            )
        ).flat(),
    )
})

app.post('/deleteEvent', async (req, res) => {
    if (!req.body || !req.body.email || !req.body.id) {
        res.status(400).json({ error: 'No such data in body' })
    }

    const user = await users.findOne({ email: req.body.email })

    if (!user) return res.status(400).json({ error: 'No such user' })

    const thisFamily = await familiesCollection.findOne({ participants: { $all: [user?._id] } })

    if (!thisFamily) {
        user.events = user.events.filter((event: Event) => event.id !== req.body.id)

        usersCollection.updateOne({ email: req.body.email }, { $set: { events: user.events } })
        return res.sendStatus(200)
    }

    thisFamily.participants.forEach(async (id: string) => {
        const user = await users.findById(String(id))

        if (user?.events.find((event) => event.id === req.body.id)) {
            user.events = user.events.filter((event: Event) => event.id !== req.body.id)

            usersCollection.updateOne({ email: req.body.email }, { $set: { events: user.events } })
        }
    })

    res.sendStatus(200)
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})
