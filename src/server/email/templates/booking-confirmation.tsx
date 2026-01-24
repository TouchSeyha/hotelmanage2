import * as React from 'react';

interface BookingConfirmationEmailProps {
  guestName: string;
  bookingNumber: string;
  roomType: string;
  roomNumber: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  totalPrice: number;
  paymentStatus: string;
}

export function BookingConfirmationEmail({
  guestName,
  bookingNumber,
  roomType,
  roomNumber,
  checkInDate,
  checkOutDate,
  numberOfGuests,
  totalPrice,
  paymentStatus,
}: BookingConfirmationEmailProps) {
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
        LuxeStay
      </h1>

      <div
        style={{
          backgroundColor: '#f5f5f5',
          padding: '24px',
          borderRadius: '8px',
          marginBottom: '24px',
        }}
      >
        <h2
          style={{
            fontSize: '20px',
            fontWeight: '600',
            margin: '0 0 8px 0',
            color: '#171717',
          }}
        >
          Booking Confirmed
        </h2>
        <p
          style={{
            fontSize: '14px',
            margin: '0',
            color: '#525252',
          }}
        >
          Thank you for your reservation, {guestName}!
        </p>
      </div>

      <div
        style={{
          border: '1px solid #e5e5e5',
          borderRadius: '8px',
          padding: '24px',
          marginBottom: '24px',
        }}
      >
        <p
          style={{
            fontSize: '12px',
            fontWeight: '600',
            margin: '0 0 4px 0',
            color: '#737373',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Booking Number
        </p>
        <p
          style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: '0 0 20px 0',
            color: '#171717',
          }}
        >
          {bookingNumber}
        </p>

        <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: '12px',
                fontWeight: '600',
                margin: '0 0 4px 0',
                color: '#737373',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Check-in
            </p>
            <p
              style={{
                fontSize: '14px',
                margin: '0',
                color: '#171717',
              }}
            >
              {checkInDate}
            </p>
          </div>
          <div style={{ flex: 1 }}>
            <p
              style={{
                fontSize: '12px',
                fontWeight: '600',
                margin: '0 0 4px 0',
                color: '#737373',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Check-out
            </p>
            <p
              style={{
                fontSize: '14px',
                margin: '0',
                color: '#171717',
              }}
            >
              {checkOutDate}
            </p>
          </div>
        </div>

        <p
          style={{
            fontSize: '12px',
            fontWeight: '600',
            margin: '0 0 4px 0',
            color: '#737373',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Room
        </p>
        <p
          style={{
            fontSize: '14px',
            margin: '0 0 16px 0',
            color: '#171717',
          }}
        >
          {roomType} - Room {roomNumber}
        </p>

        <p
          style={{
            fontSize: '12px',
            fontWeight: '600',
            margin: '0 0 4px 0',
            color: '#737373',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Guests
        </p>
        <p
          style={{
            fontSize: '14px',
            margin: '0 0 16px 0',
            color: '#171717',
          }}
        >
          {numberOfGuests} {numberOfGuests === 1 ? 'guest' : 'guests'}
        </p>

        <div
          style={{
            borderTop: '1px solid #e5e5e5',
            paddingTop: '16px',
            marginTop: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  margin: '0 0 4px 0',
                  color: '#737373',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                Total
              </p>
              <p
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  margin: '0',
                  color: '#171717',
                }}
              >
                ${totalPrice.toLocaleString()}
              </p>
            </div>
            <span
              style={{
                backgroundColor: paymentStatus === 'paid' ? '#dcfce7' : '#fef3c7',
                color: paymentStatus === 'paid' ? '#166534' : '#92400e',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: '500',
              }}
            >
              {paymentStatus === 'paid' ? 'Paid' : 'Payment Pending'}
            </span>
          </div>
        </div>
      </div>

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
            fontSize: '14px',
            margin: '0 0 8px 0',
            fontWeight: '500',
            color: '#171717',
          }}
        >
          Important Information
        </p>
        <ul
          style={{
            fontSize: '13px',
            color: '#525252',
            margin: '0',
            paddingLeft: '20px',
            lineHeight: '1.6',
          }}
        >
          <li>Check-in time: 2:00 PM</li>
          <li>Check-out time: 12:00 PM</li>
          <li>Please bring a valid ID for check-in</li>
          <li>Free cancellation up to 24 hours before check-in</li>
        </ul>
      </div>

      <div
        style={{
          marginTop: '32px',
          paddingTop: '16px',
          borderTop: '1px solid #e5e5e5',
          fontSize: '12px',
          color: '#737373',
        }}
      >
        <p style={{ margin: '0 0 8px 0' }}>
          Questions? Reply to this email or call us at +855 23 123 456
        </p>
        <p style={{ margin: '0' }}>LuxeStay • 325 Sisowath Quay, Daun Penh</p>
      </div>
    </div>
  );
}
