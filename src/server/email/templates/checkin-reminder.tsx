import * as React from 'react';

interface CheckinReminderEmailProps {
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

export function CheckinReminderEmail({
  guestName,
  bookingNumber,
  roomType,
  roomNumber,
  checkInDate,
  checkOutDate,
  numberOfGuests,
  totalPrice,
  paymentStatus,
}: CheckinReminderEmailProps) {
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
          backgroundColor: '#dbeafe',
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
            color: '#1e40af',
          }}
        >
          Your Stay Begins Tomorrow!
        </h2>
        <p
          style={{
            fontSize: '14px',
            margin: '0',
            color: '#1e40af',
          }}
        >
          Hi {guestName}, we&apos;re excited to welcome you!
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
                fontSize: '16px',
                fontWeight: '600',
                margin: '0',
                color: '#171717',
              }}
            >
              {checkInDate}
            </p>
            <p
              style={{
                fontSize: '12px',
                margin: '4px 0 0 0',
                color: '#525252',
              }}
            >
              From 2:00 PM
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
                fontSize: '16px',
                fontWeight: '600',
                margin: '0',
                color: '#171717',
              }}
            >
              {checkOutDate}
            </p>
            <p
              style={{
                fontSize: '12px',
                margin: '4px 0 0 0',
                color: '#525252',
              }}
            >
              By 12:00 PM
            </p>
          </div>
        </div>

        <div
          style={{
            borderTop: '1px solid #e5e5e5',
            paddingTop: '16px',
            marginTop: '16px',
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
            Your Room
          </p>
          <p
            style={{
              fontSize: '16px',
              fontWeight: '500',
              margin: '0 0 4px 0',
              color: '#171717',
            }}
          >
            {roomType}
          </p>
          <p
            style={{
              fontSize: '14px',
              margin: '0',
              color: '#525252',
            }}
          >
            Room {roomNumber} • {numberOfGuests} {numberOfGuests === 1 ? 'guest' : 'guests'}
          </p>
        </div>

        {paymentStatus !== 'paid' && (
          <div
            style={{
              backgroundColor: '#fef3c7',
              padding: '12px 16px',
              borderRadius: '8px',
              marginTop: '16px',
            }}
          >
            <p
              style={{
                fontSize: '14px',
                margin: '0',
                color: '#92400e',
                fontWeight: '500',
              }}
            >
              Payment Due: ${totalPrice.toLocaleString()}
            </p>
            <p
              style={{
                fontSize: '13px',
                margin: '4px 0 0 0',
                color: '#92400e',
              }}
            >
              Please settle your payment at the front desk during check-in.
            </p>
          </div>
        )}
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
            margin: '0 0 12px 0',
            fontWeight: '500',
            color: '#171717',
          }}
        >
          What to Bring
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
          <li>Valid photo ID (passport or national ID)</li>
          <li>Booking confirmation (this email)</li>
          <li>Credit card for incidentals (if applicable)</li>
        </ul>
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
            margin: '0 0 12px 0',
            fontWeight: '500',
            color: '#171717',
          }}
        >
          Getting Here
        </p>
        <p
          style={{
            fontSize: '13px',
            color: '#525252',
            margin: '0',
            lineHeight: '1.6',
          }}
        >
          <strong>Address:</strong> 325 Sisowath Quay, Daun Penh, Phnom Penh
          <br />
          <strong>From Airport:</strong> Approximately 30 minutes by taxi
          <br />
          <strong>Parking:</strong> Complimentary valet parking available
        </p>
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
          Need to modify your reservation? Reply to this email or call +855 23 123 456
        </p>
        <p style={{ margin: '0' }}>LuxeStay • 325 Sisowath Quay, Daun Penh</p>
      </div>
    </div>
  );
}
