import { FunctionComponent } from 'react'
import { Event } from '@/api/getEvents'
import { Card, Typography, Divider, Button } from '@mui/material'
import styles from './eventInfo.module.css'

interface Props {
    event: Event
    deleteEvent: (event: Event) => void
}

export const EventInfo: FunctionComponent<Props> = ({ event: { name, description, date, id }, deleteEvent }) => {
    return (
        <Card className={styles.card}>
            <Typography variant="h5" sx={{ mb: 1, mt: '10px' }}>
                {name}
            </Typography>
            <Divider />
            {description && (
                <>
                    {' '}
                    <Typography variant="body2" sx={{ mb: 1, mt: '10px' }}>
                        {description}
                    </Typography>
                    <Divider />
                </>
            )}
            <Typography variant="h6" sx={{ mb: 1, mt: '10px' }}>
                Время: {(date as Date).getHours()}:{(date as Date).getMinutes()}
            </Typography>
            <Button
                sx={{ position: 'absolute', right: '15px', bottom: '15px' }}
                variant="text"
                color="error"
                onClick={() => deleteEvent({ name, description, date, id })}
            >
                Удалить
            </Button>
        </Card>
    )
}
