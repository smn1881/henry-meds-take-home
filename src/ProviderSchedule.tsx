import { useEffect, useRef, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useForm, Controller } from "react-hook-form";
import { 
    Badge, 
    Button, 
    FormControl, 
    FormHelperText,
    Stack,
    Typography
  } from '@mui/material';
import { 
    DateCalendar, 
    DayCalendarSkeleton,
    LocalizationProvider, 
    TimePicker
} from '@mui/x-date-pickers/';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const initialProviderDataOctober = {
    21: ['09:00', '18:00'],
    28: ['12:00', '20:00'],
    29: ['10:00', '14:00'],
  }

function fakeGetHighLightedDates(date: Dayjs, { signal }: { signal: AbortSignal }) {
    return new Promise<{ daysToHighlight: number[] }>((resolve, reject) => {
      const timeout = setTimeout(() => {
        let daysToHighlight = []
        if (date.year() === 2024 && date.month() === 9) {
          daysToHighlight = Object.keys(initialProviderDataOctober).map(Number);
        }
  
        resolve({ daysToHighlight });
      }, 500);
  
      signal.onabort = () => {
        clearTimeout(timeout);
        reject(new DOMException('aborted', 'AbortError'));
      };
    });
  }

export const ProviderSchedule = () => {
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [isLoading, setIsLoading] = useState(false);
    const requestAbortController = useRef<AbortController | null>(null);
    const [highlightedDays, setHighlightedDays] = useState([]);
    const [currentSchedule, setCurrentSchedule] = useState(undefined);
    const { control, handleSubmit, trigger, watch } = useForm({
      defaultValues: {
        providerStartTime: null,
        providerEndTime: null,
      }
    });
    const providerStartTime = watch('providerStartTime');
    const providerEndTime = watch('providerEndTime');

    const fetchHighlightedDays = (date: Dayjs) => {
        const controller = new AbortController();
        fakeGetHighLightedDates(date, {
          signal: controller.signal,
        })
          .then(({ daysToHighlight }) => {
            setHighlightedDays(daysToHighlight);
            setIsLoading(false);
          })
          .catch((error) => {
            if (error.name !== 'AbortError') {
              throw error;
            }
          });
    
        requestAbortController.current = controller;
      };
    
    function ServerDay(props: PickersDayProps<Dayjs> & { highlightedDays?: number[] }) {
      const { highlightedDays = [], day, outsideCurrentMonth, ...other } = props;
    
      const isSelected =
        !props.outsideCurrentMonth && highlightedDays.indexOf(props.day.date()) >= 0;
    
      return (
        <Badge
          key={props.day.toString()}
          overlap="circular"
          color='secondary'
          badgeContent={isSelected ? '' : undefined}
        >
          <PickersDay {...other} outsideCurrentMonth={outsideCurrentMonth} day={day} />
        </Badge>
      );
    }
    
    useEffect(() => {
      fetchHighlightedDays(dayjs());
      return () => requestAbortController.current?.abort();
    }, []);
    
    useEffect(() => {
      if (highlightedDays.includes(selectedDate.date())) {
        const schedule = initialProviderDataOctober[selectedDate.date()]
        setCurrentSchedule(schedule)
      } else {
        setCurrentSchedule(undefined)
      }
    }, [highlightedDays, selectedDate])

  
    const handleMonthChange = (date: Dayjs) => {
      if (requestAbortController.current) {
        requestAbortController.current.abort();
      }
      setIsLoading(true);
      setHighlightedDays([]);
      fetchHighlightedDays(date);
    };

    const submitAvailability = (data) => {
      const startTime = dayjs(data.providerStartTime).format('HH:mm');
      const endTime = dayjs(data.providerEndTime).format('HH:mm')
      const availability = {
        id: 'providerId',
        startTime: startTime,
        endTime: endTime, 
        date: selectedDate.format('YYYY-MM-DD')
      }
      console.log('Submitting Availablity', availability)
      setCurrentSchedule([startTime, endTime])
    }

  return (
    <div>
      <Typography variant='h5' sx={{textAlign: 'left', margin: '20px'}}>Provider Schedule</Typography>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DateCalendar
          value={selectedDate}
          onChange={(newDate) => setSelectedDate(newDate)}
          loading={isLoading}
          minDate={dayjs()}
          onMonthChange={handleMonthChange}
          renderLoading={() => <DayCalendarSkeleton />}
          slots={{
            day: ServerDay,
          }}
          slotProps={{
            day: {
              highlightedDays,
            } as any,
          }}
        />
          <div>
            <Typography sx={{margin: '10px'}}>
              { currentSchedule ? (`Current Schdule: ` + 
                dayjs(currentSchedule[0], 'HH:mm').format('h:mm A') + ` - ` + 
                dayjs(currentSchedule[1], 'HH:mm').format('h:mm A')
              ) : ''
              }
            </Typography>
          </div>
        <Stack 
          direction="row" 
          spacing={2} 
          sx={{justifyContent: 'center', alignItems: 'center', margin: '10px'}}
        >
          <Controller
            name="providerStartTime"
            control={control}
            rules={{
              required: 'Start time is required',
              validate: (value) => {
                if (!value || !providerEndTime) {
                  return true;
                }
                return dayjs(value).isBefore(dayjs(providerEndTime)) || 'Start time must be before end time';
              }
            }}
            render={({ field, fieldState: { error }}) =>
              <FormControl error={!!error} fullWidth>
                <TimePicker 
                  label="Start Time" 
                  minutesStep={15} 
                  {...field} />
                <FormHelperText>{error ? error.message : ''}</FormHelperText>
              </FormControl>
            }
          />
          <Controller
            name="providerEndTime"
            control={control}
            rules={{
              required: 'End time is required',
              validate: (value) => {
                if (!value || !providerStartTime) {
                  return true;
                }
                const isValid = dayjs(value).isAfter(dayjs(providerStartTime));
                trigger('providerStartTime');
                return isValid || 'End time must be after start time';
              }
            }}
            render={({ field, fieldState: { error }}) =>
              <FormControl error={!!error} fullWidth>
                <TimePicker 
                  label="End Time" 
                  minutesStep={15} 
                  {...field} />
                <FormHelperText>{error ? error.message : ''}</FormHelperText>
              </FormControl>
            }
        />
        </Stack>

      </LocalizationProvider>
      <Button variant="outlined" onClick={handleSubmit(submitAvailability)} >
        Submit Availability
      </Button>
    </div>
  )
}