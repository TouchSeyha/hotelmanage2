import * as React from 'react';

interface BookingAdminAlertEmailProps {
  bookingNumber: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  roomType: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string;
  specialRequests?: string;
  bookingType: 'online' | 'walk-in';
}

export function BookingAdminAlertEmail({
  bookingNumber,
  guestName,
  guestEmail,
  guestPhone,
  roomType,
  roomNumber,
  checkInDate,
  checkOutDate,
  numberOfGuests,
  totalPrice,
  paymentMethod,
  paymentStatus,
  specialRequests,
  bookingType,
}: BookingAdminAlertEmailProps) {
  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#ffffff',
        padding: '32px',
        color: '#171717',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <h1
        style={{
          fontSize: '18px',
          fontWeight: '500',
          margin: '0 0 24px 0',
          color: '#171717',
        }}
      >
        LuxeStay Phnom Penh - Admin Alert
      </h1>

      <div
        style={{
          backgroundColor: bookingType === 'walk-in' ? '#dbeafe' : '#dcfce7',
          padding: '16px 24px',
          borderRadius: '8px',
          marginBottom: '24px',
          borderLeft: `4px solid ${bookingType === 'walk-in' ? '#3b82f6' : '#22c55e'}`,
        }}
      >
        <h2
          style={{
            fontSize: '16px',
            fontWeight: '600',
            margin: '0',
            color: bookingType === 'walk-in' ? '#1e40af' : '#166534',
          }}
        >
          New {bookingType === 'walk-in' ? 'Walk-in' : 'Online'} Booking Received
        </h2>
      </div>

      <div
        style={{
          border: '1px solid #e5e5e5',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#737373',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  width: '140px',
                }}
              >
                Booking #
              </td>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#171717',
                }}
              >
                {bookingNumber}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#737373',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Guest Name
              </td>
              <td style={{ padding: '8px 0', fontSize: '14px', color: '#171717' }}>{guestName}</td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#737373',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Email
              </td>
              <td style={{ padding: '8px 0', fontSize: '14px', color: '#171717' }}>{guestEmail}</td>
            </tr>
            {guestPhone && (
              <tr>
                <td
                  style={{
                    padding: '8px 0',
                    fontSize: '12px',
                    fontWeight: '600',
                    color: '#737373',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Phone
                </td>
                <td style={{ padding: '8px 0', fontSize: '14px', color: '#171717' }}>
                  {guestPhone}
                </td>
              </tr>
            )}
            <tr>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#737373',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderTop: '1px solid #e5e5e5',
                }}
              >
                Room
              </td>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '14px',
                  color: '#171717',
                  borderTop: '1px solid #e5e5e5',
                }}
              >
                {roomType} - Room {roomNumber}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#737373',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Check-in
              </td>
              <td style={{ padding: '8px 0', fontSize: '14px', color: '#171717' }}>
                {checkInDate}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#737373',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Check-out
              </td>
              <td style={{ padding: '8px 0', fontSize: '14px', color: '#171717' }}>
                {checkOutDate}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#737373',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Guests
              </td>
              <td style={{ padding: '8px 0', fontSize: '14px', color: '#171717' }}>
                {numberOfGuests}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#737373',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  borderTop: '1px solid #e5e5e5',
                }}
              >
                Payment Method
              </td>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '14px',
                  color: '#171717',
                  borderTop: '1px solid #e5e5e5',
                }}
              >
                {paymentMethod === 'online' ? 'Online Payment' : 'Pay at Counter'}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#737373',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Payment Status
              </td>
              <td style={{ padding: '8px 0', fontSize: '14px' }}>
                <span
                  style={{
                    backgroundColor: paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7',
                    color: paymentStatus === 'paid' ? '#166534' : '#92400e',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                  }}
                >
                  {paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '12px',
                  fontWeight: '600',
                  color: '#737373',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Total Amount
              </td>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#171717',
                }}
              >
                ${totalPrice.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {specialRequests && (
        <div
          style={{
            backgroundColor: '#fafafa',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
          }}
        >
          <p
            style={{
              fontSize: '12px',
              fontWeight: '600',
              margin: '0 0 8px 0',
              color: '#737373',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Special Requests
          </p>
          <p
            style={{
              fontSize: '14px',
              margin: '0',
              color: '#171717',
              whiteSpace: 'pre-wrap',
            }}
          >
            {specialRequests}
          </p>
        </div>
      )}

      <div
        style={{
          marginTop: '32px',
          paddingTop: '16px',
          borderTop: '1px solid #e5e5e5',
          fontSize: '12px',
          color: '#737373',
        }}
      >
        <p style={{ margin: '0' }}>
          This is an automated notification from the LuxeStay booking system.
        </p>
      </div>
    </div>
  );
}
