'use client'
import { FunctionComponent, useEffect, useState } from 'react'
import styles from './calendar.module.css'
import { Card, Typography, Divider } from '@mui/material'
import { DateControll } from '../dateControll/dateControll'
import { getEvents, Event } from '@/api/getEvents'
import { useSession } from 'next-auth/react'
import { AddEvent } from '@/components/addEvent/addEvent'
import { createPortal } from 'react-dom'
import dayjs from 'dayjs'
import { addEvent } from '@/api/addEvent'
import { EventInfo } from '@/components/eventInfo/eventInfo'
import { deleteEvent } from '@/api/deleteEvent'
import { MOTHS } from '@/moths'
import { io } from 'socket.io-client'
import { useColorScheme } from '@mui/material/styles'
import { WS_URL } from '@/api/env.json' assert { type: 'json' }

export const Calendar: FunctionComponent = () => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
    const [showAddEvent, setShowAddEvent] = useState(false)
    const [events, setEvents] = useState([] as Event[])
    const [currentDate, setCurrentDate] = useState(dayjs(new Date()))
    const [currentEvent, setCurrentEvent] = useState(null as Event | null)
    const session = useSession()
    const { mode } = useColorScheme()

    const colorsForEvents = ['redEvent', 'greenEvent', 'yellowEvent', 'blueEvent', 'greyEvent']

    async function getAllEvents() {
        if (!session.data?.user?.email) return

        const res = await getEvents(session.data?.user?.email)

        if ('error' in res) console.error(res)
        else
            setEvents(
                res
                    .map((event) => {
                        event.date = new Date(Number(event.date))
                        return event
                    })
                    .sort(sortByDate),
            )
    }

    function getEventsOnThisDay(i: number) {
        const res = events.filter((event) => {
            return (
                (event.date as Date).getTime() >= new Date(currentYear, currentMonth, i + 1).getTime() &&
                (event.date as Date).getTime() < new Date(currentYear, currentMonth, i + 2).getTime()
            )
        })
        return res
        //.filter((event, i) => events[i].id !== event.id)
    }
    function sortByDate(event1: Event, event2: Event) {
        return (event1.date as Date).getTime() - (event2.date as Date).getTime()
    }

    async function onDeleteEvent(event: Event) {
        if (!session?.data?.user?.email) return

        const res = await deleteEvent(session.data.user.email, event.id)
        if (typeof res !== 'boolean') return console.error(res.error)

        setCurrentEvent(null)
        setEvents((prev) => prev.filter(({ id }) => id !== event.id))
    }

    useEffect(() => {
        getAllEvents()
    }, [session.data?.user?.email])
    useEffect(() => {
        const ws = io(WS_URL)
        ws.on('connect', () => {
            console.log('Connected to server')
        })

        ws.on('message', (event: Event, callback: Function) => {
            callback({
                status: 'ok',
            })

            new Notification(event.name, {
                body: event.description,
                image: '/favicon.ico',
            })
        })

        ws.on('disconnect', () => {
            console.log('disconnect')
        })
    }, [])

    async function add(name: string, description: string, currentDate: Date) {
        if (!session.data?.user?.email || !name) return

        const res = await addEvent(session.data?.user?.email, name, description, String(Number(currentDate)))
        if (typeof res !== 'boolean') console.error(res.error)
        setEvents((prev) => {
            const newEvent: Event = { date: currentDate, name, description, id: String(Date.now()) }
            prev.push(newEvent)
            return prev.toSorted(sortByDate)
        })
        setShowAddEvent(false)
    }

    const dayOfWeek = {
        Mon: 0,
        Tue: 1,
        Wed: 2,
        Thur: 3,
        Fri: 4,
        Sat: 5,
        Sun: 6,
    }
    const daysOfWeekOnRu = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
    const numberOfDaysInThisWeek =
        dayOfWeek[String(new Date(currentYear, currentMonth, 1)).split(' ')[0] as keyof typeof dayOfWeek]

    return (
        <main style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <DateControll
                currentMonth={currentMonth}
                currentYear={currentYear}
                setCurrentMonth={setCurrentMonth}
                setCurrentYear={setCurrentYear}
            />
            {mode === 'dark' ? (
                <Typography
                    color="ActiveBorder"
                    variant="h2"
                    sx={{ display: 'flex', justifyContent: 'center', mb: '10px' }}
                >
                    {MOTHS[currentMonth]}
                </Typography>
            ) : (
                <Typography variant="h2" sx={{ display: 'flex', justifyContent: 'center', mb: '10px' }}>
                    {MOTHS[currentMonth]}
                </Typography>
            )}
            <section className={styles.daysOfWeek}>
                {daysOfWeekOnRu.map((name) => {
                    return mode === 'dark' ? (
                        <Typography color="InactiveBorder" variant="h6" sx={{ mb: 1, mt: '10px' }} key={name}>
                            {name}
                        </Typography>
                    ) : (
                        <Typography variant="h6" sx={{ mb: 1, mt: '10px' }} key={name}>
                            {name}
                        </Typography>
                    )
                })}
            </section>
            <Divider sx={{ mb: '10px', width: '70vw', alignSelf: 'center' }} />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <section className={styles.calendar}>
                    <div
                        style={{
                            height: 'max(10vw, 50px)',
                            width: `calc(${10 * numberOfDaysInThisWeek}vw + ${numberOfDaysInThisWeek ? numberOfDaysInThisWeek * 2.8 - 1.4 : 0}px)`,
                        }}
                    ></div>
                    {new Array(dayjs(new Date(currentYear, currentMonth)).daysInMonth()).fill(0).map((_, i) => (
                        <Card
                            className={styles.day}
                            key={i + 1}
                            sx={{ cursor: 'pointer' }}
                            onClick={() => {
                                setShowAddEvent((prev) => !prev)

                                setCurrentDate(dayjs(new Date(currentYear, currentMonth, i + 1)))
                            }}
                        >
                            {/* {String(new Date(currentYear, currentMonth, i + 1)).split(' ')[0][0] === 'S' ? styles.weekend : ''} */}
                            {globalThis.innerWidth && globalThis.innerWidth > 768
                                ? getEventsOnThisDay(i)
                                      .toSorted(sortByDate)
                                      .map((event, i) => {
                                          return (
                                              <div
                                                  className={`${styles.event} ${styles[colorsForEvents[i % 5]]}`}
                                                  key={event.id}
                                                  onClick={(evt) => {
                                                      evt.stopPropagation()
                                                      setCurrentEvent((prev) => (prev === event ? null : event))
                                                  }}
                                              >
                                                  {event.name}
                                              </div>
                                          )
                                      })
                                : !!getEventsOnThisDay(i).length && (
                                      <div
                                          className={`${styles.event} ${styles[colorsForEvents[i % 5]]}`}
                                          onClick={(evt) => {
                                              evt.stopPropagation()
                                              setCurrentEvent((prev) =>
                                                  prev === getEventsOnThisDay(i)[0] ? null : getEventsOnThisDay(i)[0],
                                              )
                                          }}
                                      ></div>
                                  )}
                            <span
                                className={styles.numberOfDay}
                                style={
                                    String(new Date(currentYear, currentMonth, i + 1)).split(' ')[0][0] === 'S'
                                        ? { color: mode === 'dark' ? 'orange' : 'rgb(255, 43, 43)' }
                                        : {}
                                }
                            >
                                {i + 1}
                            </span>
                        </Card>
                    ))}
                </section>
            </div>
            {showAddEvent &&
                createPortal(
                    <AddEvent add={add} currentDate={currentDate} setCurrentDate={setCurrentDate} />,
                    document.body,
                )}
            {!!currentEvent &&
                createPortal(<EventInfo event={currentEvent} deleteEvent={onDeleteEvent} />, document.body)}
        </main>
    )
}
