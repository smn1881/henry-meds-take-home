import { render, screen } from '@testing-library/react';
import { ClientConfirm } from './ClientConfirm';
import dayjs from 'dayjs';

describe('ClientConfirm Component', () => {
  const mockSetShowConfirmPage = jest.fn();

  const renderComponent = (appointmentTime) => {
    render(<ClientConfirm setShowConfirmPage={mockSetShowConfirmPage} appointmentTime={appointmentTime} />);
  };

  it('should show an error if the appointment was created more than 30 minutes ago', () => {
    const appointmentTime = {
      appointmentCreatedTime: dayjs().subtract(60, 'minute'),
      reservationTime: '2024-10-24 13:00',
    };

    renderComponent(appointmentTime);

    expect(screen.getByText('Appointment time has expired. Please go back and make a new reservation.')).toBeInTheDocument();
    expect(screen.getByText('Confirm Appointment')).toBeDisabled();
  });
});