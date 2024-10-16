import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import './App.css';
import { useForm, Controller } from "react-hook-form";
import { 
  Button, 
  Card,
  FormControl,
  InputLabel, 
  MenuItem, 
  Select, 
  Stack, 
  Typography 
} from '@mui/material';

const providerList = [
    { id: '12312321',
      name: 'Dr. Mary'
    },
    {
      id: '120938102',
      name: 'Barbara P.A.'
    },
    {
      id: '12098090',
      name: 'Jenn N.P.'
    }
]

const sampleProviderAvailabilityList = {
    '12098090': [
        {
            date: dayjs(), 
        },
        {
            date: '2024-10-21 09:00', 
        },
        {
            date: '2024-10-21 10:15',
        },
        {
            date: '2024-10-21 10:30',
        },
        {
            date: '2024-10-21 12:30',
        }
    ], 
    '12312321': [],
    '120938102': [
        {
            "date": "2024-10-22 09:45"
        },
        {
            "date": "2024-10-23 11:30"
        },
        {
            "date": "2024-10-24 13:00"
        },
        {
            "date": "2024-10-25 14:15"
        },
        {
            "date": "2024-10-26 08:30"
        },
        {
            "date": "2024-10-27 15:45"
        }
    ]
}

const defaultProviderId = '12312321';

export const ClientReservation = ({setShowConfirmPage, setAppointment}) => {
    const [providerId, setProviderId] = useState<string>('')
    const [providerAvailabilityList, setProviderAvailabilityList] = useState<{ date: string; }[]>()
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [error, setError] = useState<string | undefined>();

    const { control, handleSubmit, setValue } = useForm({
      defaultValues: {
        reservation: undefined,
        provider: defaultProviderId,
        reservationTime: undefined,
      }
    });

    useEffect(() => {
        setProviderAvailabilityList(sampleProviderAvailabilityList[defaultProviderId])
    }, [])
    const onSubmit = (data) => {
        if (dayjs(data.reservationTime.date).isAfter(dayjs().add(24, 'hour'))) {
            setError('Reservation time no longer valid')
            //Would refresh data and then setError to undefined
            setTimeout(() => {
                setError(undefined)
            }, 3000);
        } else {
            const clientReservation = {
                clientId: '12343123431',
                providerId: providerId,
                reservationTime: data.reservationTime,
                reservationType: 'reserved',
                appointmentCreatedTime: dayjs()
            }
            setAppointment(clientReservation)
            setShowConfirmPage(true)
        }
    }

    const getProviderAvailability = (value: string) => {
        setProviderId(value)
        setSelectedTime(null)
        const filteredList = sampleProviderAvailabilityList[value].filter(date => {
            return dayjs(date.date).isAfter(dayjs().add(24, 'hour'))
        })
        setProviderAvailabilityList(filteredList)
    }

    const handleCardClick = (time: string) => {
        setSelectedTime(time);
        setValue('reservationTime', time);
    };

    return (
        <div>
        <Typography variant='h5' sx={{textAlign: 'left', margin: '20px'}}>Client Appointment Availability</Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="provider"
          control={control}
          rules={{
            required: 'Provider is required',
          }}
          render={({ field }) =>
            <FormControl sx={{width: '400px'}}>
              <InputLabel key='provider-label' id="provider-select-label">Provider</InputLabel>
              <Select
                labelId="provider-select-label"
                id="demo-simple-select"
                label="Provider"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  getProviderAvailability(e.target.value);
                }}
              >
                {providerList && providerList.map(provider => {
                  return <MenuItem value={provider.id}>{provider.name}</MenuItem>
                })}
              </Select>
            </FormControl>
          }
        />
        {error && <Typography>{error}</Typography>}
            <Controller
                name="reservationTime"
                control={control}
                rules={{
                    required: 'Appointment Time is required',
                }}
                render={() =>
                    <Stack 
                        direction="column" 
                        spacing={4} 
                        sx={{justifyContent: 'center', alignItems: 'center', margin: '20px'}}
                    >
                        {providerAvailabilityList && providerAvailabilityList.length === 0 && 
                            <Typography>No availability for this provider, please select someone else.</Typography>
                        }
                        {providerAvailabilityList && providerAvailabilityList.map(provider => {
                        return (
                            <Card 
                                key={provider.date}
                                sx={{
                                    padding: '20px',
                                    width: '200px',
                                    backgroundColor: selectedTime === provider.date ? '#339b89' : 'white',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleCardClick(provider.date)}
                            >
                                {dayjs(provider.date).format('MMMM D, YYYY h:mm A')}
                            </Card>
                        )})}
                    </Stack>
                }
            />
        </form>
        <Button variant="outlined" onClick={handleSubmit(onSubmit)} >Select Appointment</Button>
      </div>
    )
}