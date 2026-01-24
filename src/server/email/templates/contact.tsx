import * as React from 'react';

interface ContactEmailProps {
  name: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
}

export function ContactEmail({ name, email, phone, topic, message }: ContactEmailProps) {
  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        backgroundColor: '#ffffff',
        padding: '32px',
        color: '#171717',
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
        Topic
      </p>
      <p
        style={{
          fontSize: '14px',
          margin: '0 0 16px 0',
          color: '#171717',
        }}
      >
        {topic === 'booking'
          ? 'New Booking'
          : topic === 'itinerary'
            ? 'Itinerary Design'
            : 'Private Dinner or Event'}
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
        From
      </p>
      <p
        style={{
          fontSize: '14px',
          margin: '0 0 16px 0',
          color: '#171717',
        }}
      >
        {name}
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
        Email
      </p>
      <p
        style={{
          fontSize: '14px',
          margin: '0 0 16px 0',
          color: '#171717',
        }}
      >
        {email}
      </p>

      {phone && (
        <>
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
            Phone
          </p>
          <p
            style={{
              fontSize: '14px',
              margin: '0 0 16px 0',
              color: '#171717',
            }}
          >
            {phone}
          </p>
        </>
      )}

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
        Message
      </p>
      <div
        style={{
          border: '1px solid #e5e5e5',
          padding: '16px',
          lineHeight: '1.6',
          fontSize: '14px',
          color: '#171717',
          whiteSpace: 'pre-wrap',
        }}
      >
        {message}
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
        <p style={{ margin: '0' }}>LuxeStay • 325 Sisowath Quay, Daun Penh</p>
      </div>
    </div>
  );
}
