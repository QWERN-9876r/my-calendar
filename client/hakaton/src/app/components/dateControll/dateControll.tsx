'use client'

import { Dispatch, FunctionComponent, SetStateAction } from 'react'
import Box from '@mui/material/Box'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import Button from '@mui/material/Button'
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import styles from './dateControll.module.css'

interface Props {
    currentYear: number
    setCurrentYear: Dispatch<SetStateAction<number>>
    currentMonth: number
    setCurrentMonth: Dispatch<SetStateAction<number>>
}

export const DateControll: FunctionComponent<Props> = ({
    currentYear,
    currentMonth,
    setCurrentYear,
    setCurrentMonth,
}) => {
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentMonth(newValue)
    }
    const changeMoth = (change: number) => {
        if (currentMonth + change > 12) {
            setCurrentMonth(1)
            setCurrentYear((prev) => prev + 1)
            return
        }
        if (currentMonth + change < 1) {
            setCurrentMonth(12)
            setCurrentYear((prev) => prev - 1)
            return
        }

        setCurrentMonth((prev) => prev + change)
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', marginBlock: '50px' }}>
            <Button variant="text" className={styles.arrowButton} onClick={() => changeMoth(-1)}>
                <ArrowBackIosIcon />
            </Button>
            {!globalThis.innerWidth ||
                (globalThis.innerWidth > 900 && (
                    <DatePicker
                        value={dayjs(new Date(currentYear, currentMonth, 0))}
                        onChange={(value) => {
                            setCurrentMonth((value as dayjs.Dayjs).month())
                            setCurrentYear((value as dayjs.Dayjs).year())
                        }}
                    />
                ))}
            <Button variant="text" className={styles.arrowButton} onClick={() => changeMoth(1)}>
                <ArrowForwardIosIcon />
            </Button>
        </Box>
    )
}
