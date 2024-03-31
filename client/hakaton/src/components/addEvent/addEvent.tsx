'use client'

import { FunctionComponent, useState } from 'react'
import styles from './addEvent.module.css'
import { TextField, Card, Typography, Button, Divider } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'

interface Props {
    currentDate: Dayjs
    setCurrentDate: (date: Dayjs) => void
    add: (name: string, description: string, currentDate: Date) => void
}

export const AddEvent: FunctionComponent<Props> = ({ currentDate, setCurrentDate, add }) => {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    let time = [0, 0]

    return (
        <Card className={styles.container}>
            <Typography variant="h1" sx={{ fontSize: 18 }} component="div">
                Добавить событие
            </Typography>
            <div style={{ padding: '45px 0', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <TextField
                    id="outlined-basic"
                    label="название"
                    variant="outlined"
                    onChange={(evt) => setName(evt.target.value)}
                />
                <TextField
                    id="outlined-basic"
                    label="описание"
                    variant="outlined"
                    onChange={(evt) => setDescription(evt.target.value)}
                />
                <Divider />
                <DatePicker value={currentDate} onChange={(date) => setCurrentDate(date as Dayjs)} />
                <TextField
                    id="outlined-basic"
                    onChange={(evt) => (time = evt.target.value.split(':').map(Number))}
                    type="time"
                    variant="outlined"
                />
                <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <Button
                        variant="contained"
                        sx={{ marginTop: '50px' }}
                        onClick={() => {
                            add(
                                name,
                                description,
                                new Date(currentDate.year(), currentDate.month(), currentDate.date(), ...time),
                            )
                        }}
                    >
                        Добавить
                    </Button>
                </div>
            </div>
        </Card>
    )
}
