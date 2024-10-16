import { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import './App.css';
import { ProviderSchedule } from './ProviderSchedule'
import { 
  Button, 
  Stack, 
  Typography 
} from '@mui/material';
import { ClientConfirm } from './ClientConfirm';
import { ClientReservation } from './ClientReservation';

const theme = createTheme({
  palette: {
    primary: {
      light: '#339b89',
      main: '#00836c',
      dark: '#005b4b',
      contrastText: 'white',
    },
    secondary: {
      light: '#c8c8c8',
      main: '#bbbbbb',
      dark: '#828282',
      contrastText: 'black',
    },
  },
});

const App = () => {
  const [signOn, setSignOn] = useState<boolean>(true);
  const [userType, setUserType] = useState<string>('Provider');
  const [showConfirmPage, setShowConfirmPage] = useState<boolean>(false)
  const [appointment, setAppointment] = useState()

  const setSchedule = (userType: string) => {
    setUserType(userType)
    setSignOn(false)
  }

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <header className="App-header">
          <div onClick={() => {setSignOn(true); setShowConfirmPage(false)}}>
            <Typography variant='h3' sx={{cursor: 'pointer'}}>
              Henry Meds
            </Typography>
          </div>
        </header>
        <div style={{marginTop: '30px'}}>
          {signOn &&         
            <Stack direction="column" spacing={2} sx={{justifyContent: 'center', alignItems: 'center'}}>
              <Button variant='contained' onClick={() => setSchedule('Provider')}>
                <Typography variant='body1'>Provider Sign In</Typography>
              </Button>
              <Button variant='contained' onClick={() => setSchedule('Client')}>
                <Typography variant='body1'>Client Sign In</Typography>
              </Button>
            </Stack>
          }
          {!signOn && userType === 'Provider' && <ProviderSchedule />}
          {!signOn && userType === 'Client' && (!showConfirmPage ? (
              <ClientReservation setShowConfirmPage={setShowConfirmPage} setAppointment={setAppointment}/>
            ) : (
              <ClientConfirm setShowConfirmPage={setShowConfirmPage} appointmentTime={appointment} />
            ))
          }
        </div>
      </ThemeProvider>
    </div>
  );
}

export default App;
