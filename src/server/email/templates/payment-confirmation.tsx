import * as React from 'react';

interface PaymentConfirmationEmailProps {
  guestName: string;
  bookingNumber: string;
  paymentAmount: number;
  paymentMethod: string;
  paymentDate: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
}

export function PaymentConfirmationEmail({
  guestName,
  bookingNumber,
  paymentAmount,
  paymentMethod,
  paymentDate,
  roomType,
  checkInDate,
  checkOutDate,
}: PaymentConfirmationEmailProps) {
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
          backgroundColor: '#dcfce7',
          padding: '24px',
          borderRadius: '8px',
          marginBottom: '24px',
          textAlign: 'center' as const,
        }}
      >
        <div
          style={{
            width: '48px',
            height: '48px',
            backgroundColor: '#22c55e',
            borderRadius: '50%',
            margin: '0 auto 16px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ color: '#ffffff', fontSize: '24px', textAlign: 'center' }}>✓</span>
        </div>
        <h2
          style={{
            fontSize: '20px',
            fontWeight: '600',
            margin: '0 0 8px 0',
            color: '#166534',
          }}
        >
          Payment Successful
        </h2>
        <p
          style={{
            fontSize: '14px',
            margin: '0',
            color: '#166534',
          }}
        >
          Your payment has been processed successfully
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
          Payment Receipt
        </p>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '16px' }}>
          <tbody>
            <tr>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '14px',
                  color: '#525252',
                }}
              >
                Booking Number
              </td>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '14px',
                  color: '#171717',
                  fontWeight: '500',
                  textAlign: 'right' as const,
                }}
              >
                {bookingNumber}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '14px',
                  color: '#525252',
                }}
              >
                Guest Name
              </td>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '14px',
                  color: '#171717',
                  textAlign: 'right' as const,
                }}
              >
                {guestName}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '14px',
                  color: '#525252',
                }}
              >
                Room Type
              </td>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '14px',
                  color: '#171717',
                  textAlign: 'right' as const,
                }}
              >
                {roomType}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '14px',
                  color: '#525252',
                }}
              >
                Stay Dates
              </td>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '14px',
                  color: '#171717',
                  textAlign: 'right' as const,
                }}
              >
                {checkInDate} - {checkOutDate}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '14px',
                  color: '#525252',
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
                  textAlign: 'right' as const,
                  borderTop: '1px solid #e5e5e5',
                }}
              >
                {paymentMethod}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '14px',
                  color: '#525252',
                }}
              >
                Payment Date
              </td>
              <td
                style={{
                  padding: '8px 0',
                  fontSize: '14px',
                  color: '#171717',
                  textAlign: 'right' as const,
                }}
              >
                {paymentDate}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  padding: '12px 0',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#171717',
                  borderTop: '1px solid #e5e5e5',
                }}
              >
                Amount Paid
              </td>
              <td
                style={{
                  padding: '12px 0',
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#171717',
                  textAlign: 'right' as const,
                  borderTop: '1px solid #e5e5e5',
                }}
              >
                ${paymentAmount.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
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
            margin: '0',
            color: '#525252',
            lineHeight: '1.6',
          }}
        >
          This email serves as your payment receipt. Please save it for your records. If you have
          any questions about your payment, please contact our support team.
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
          Questions? Reply to this email or call us at +855 23 123 456
        </p>
        <p style={{ margin: '0' }}>LuxeStay • 325 Sisowath Quay, Daun Penh</p>
      </div>
    </div>
  );
}
