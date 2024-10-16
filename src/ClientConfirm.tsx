import { useEffect, useState } from 'react'
import {  
    Button, 
    Stack,
    Typography
} from '@mui/material';
import dayjs from 'dayjs';

export const ClientConfirm = ({setShowConfirmPage, appointmentTime}) => {
    const [error, setError] = useState(false)
    const onSubmit = () => {
        if (dayjs().diff(dayjs(appointmentTime.appointmentCreatedTime), 'minute') > 30) {
            setError(true)
            appointmentTime['reservationType'] = 'Unreserved'
            console.log('Appointment Unreserved', appointmentTime)
        } else {
            appointmentTime['reservationType'] = 'Confirmed'
            console.log('Confirming Appointment', appointmentTime)
        }
    }

    useEffect(() => {
        if (dayjs().diff(dayjs(appointmentTime.appointmentCreatedTime), 'minute') > 30) {
            setError(true)
        }
    }, [appointmentTime.appointmentCreatedTime])

    return (
        <div>
            <Typography> 
                {
                    error ? 
                    'Appointment time has expired. Please go back and make a new reservation.' : 
                    `Appointment Time: ` + dayjs(appointmentTime.reservationTime).format('MMMM D, YYYY h:mm A')
                }
            </Typography>
            <Stack 
                direction="row" 
                spacing={2} 
                sx={{justifyContent: 'center', alignItems: 'center', margin: '10px'}}
            >
                <Button variant="outlined" onClick={() => setShowConfirmPage(false)} >Select Other Appt</Button>
                <Button disabled={error} variant="outlined" onClick={onSubmit} >
                    Confirm Appointment
                </Button>
            </Stack>
        </div>
    )
}