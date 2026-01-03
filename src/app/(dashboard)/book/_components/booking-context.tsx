'use client';

import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { PaymentMethod } from '~/lib/schemas';

interface BookingState {
  step: 1 | 2 | 3;
  roomTypeId: string | null;
  roomTypeName: string | null;
  roomTypeSlug: string | null;
  basePrice: number | null;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  specialRequests: string;
  paymentMethod: PaymentMethod | null;
  totalNights: number;
  totalPrice: number;
}

type BookingAction =
  | { type: 'SET_STEP'; step: 1 | 2 | 3 }
  | {
      type: 'SET_ROOM';
      payload: {
        roomTypeId: string;
        roomTypeName: string;
        roomTypeSlug: string;
        basePrice: number;
        checkIn: Date;
        checkOut: Date;
        guests: number;
      };
    }
  | {
      type: 'SET_GUEST_INFO';
      payload: {
        guestName: string;
        guestEmail: string;
        guestPhone: string;
        specialRequests: string;
      };
    }
  | { type: 'SET_PAYMENT_METHOD'; paymentMethod: PaymentMethod }
  | { type: 'RESET' };

const initialState: BookingState = {
  step: 1,
  roomTypeId: null,
  roomTypeName: null,
  roomTypeSlug: null,
  basePrice: null,
  checkIn: null,
  checkOut: null,
  guests: 1,
  guestName: '',
  guestEmail: '',
  guestPhone: '',
  specialRequests: '',
  paymentMethod: null,
  totalNights: 0,
  totalPrice: 0,
};

function calculateNights(checkIn: Date, checkOut: Date): number {
  const diffTime = checkOut.getTime() - checkIn.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, step: action.step };

    case 'SET_ROOM': {
      const nights = calculateNights(action.payload.checkIn, action.payload.checkOut);
      return {
        ...state,
        step: 2,
        roomTypeId: action.payload.roomTypeId,
        roomTypeName: action.payload.roomTypeName,
        roomTypeSlug: action.payload.roomTypeSlug,
        basePrice: action.payload.basePrice,
        checkIn: action.payload.checkIn,
        checkOut: action.payload.checkOut,
        guests: action.payload.guests,
        totalNights: nights,
        totalPrice: nights * action.payload.basePrice,
      };
    }

    case 'SET_GUEST_INFO':
      return {
        ...state,
        step: 3,
        guestName: action.payload.guestName,
        guestEmail: action.payload.guestEmail,
        guestPhone: action.payload.guestPhone,
        specialRequests: action.payload.specialRequests,
      };

    case 'SET_PAYMENT_METHOD':
      return { ...state, paymentMethod: action.paymentMethod };

    case 'RESET':
      return initialState;

    default:
      return state;
  }
}

interface BookingContextType {
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
  goToStep: (step: 1 | 2 | 3) => void;
  setRoom: (payload: {
    roomTypeId: string;
    roomTypeName: string;
    roomTypeSlug: string;
    basePrice: number;
    checkIn: Date;
    checkOut: Date;
    guests: number;
  }) => void;
  setGuestInfo: (payload: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    specialRequests: string;
  }) => void;
  setPaymentMethod: (paymentMethod: PaymentMethod) => void;
  reset: () => void;
}

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const goToStep = (step: 1 | 2 | 3) => {
    dispatch({ type: 'SET_STEP', step });
  };

  const setRoom = (payload: {
    roomTypeId: string;
    roomTypeName: string;
    roomTypeSlug: string;
    basePrice: number;
    checkIn: Date;
    checkOut: Date;
    guests: number;
  }) => {
    dispatch({ type: 'SET_ROOM', payload });
  };

  const setGuestInfo = (payload: {
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    specialRequests: string;
  }) => {
    dispatch({ type: 'SET_GUEST_INFO', payload });
  };

  const setPaymentMethod = (paymentMethod: PaymentMethod) => {
    dispatch({ type: 'SET_PAYMENT_METHOD', paymentMethod });
  };

  const reset = () => {
    dispatch({ type: 'RESET' });
  };

  return (
    <BookingContext.Provider
      value={{
        state,
        dispatch,
        goToStep,
        setRoom,
        setGuestInfo,
        setPaymentMethod,
        reset,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}
