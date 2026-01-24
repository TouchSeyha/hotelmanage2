import { Badge } from '~/components/ui/badge';
import { cn } from '~/lib/utils';

type BookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'completed' | 'cancelled';
type PaymentStatus = 'pending' | 'paid' | 'refunded';
type RoomStatus = 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'out_of_service';

interface StatusBadgeProps {
  status: BookingStatus | PaymentStatus | RoomStatus;
  type?: 'booking' | 'payment' | 'room';
  className?: string;
}

const bookingStatusConfig: Record<BookingStatus, { label: string; variant: string }> = {
  pending: { label: 'Pending', variant: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  confirmed: { label: 'Confirmed', variant: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  checked_in: { label: 'Checked In', variant: 'bg-green-100 text-green-800 hover:bg-green-100' },
  checked_out: { label: 'Checked Out', variant: 'bg-purple-100 text-purple-800 hover:bg-purple-100' },
  completed: { label: 'Completed', variant: 'bg-gray-100 text-gray-800 hover:bg-gray-100' },
  cancelled: { label: 'Cancelled', variant: 'bg-red-100 text-red-800 hover:bg-red-100' },
};

const paymentStatusConfig: Record<PaymentStatus, { label: string; variant: string }> = {
  pending: { label: 'Pending', variant: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  paid: { label: 'Paid', variant: 'bg-green-100 text-green-800 hover:bg-green-100' },
  refunded: { label: 'Refunded', variant: 'bg-purple-100 text-purple-800 hover:bg-purple-100' },
};

const roomStatusConfig: Record<RoomStatus, { label: string; variant: string }> = {
  available: { label: 'Available', variant: 'bg-green-100 text-green-800 hover:bg-green-100' },
  occupied: { label: 'Occupied', variant: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  cleaning: { label: 'Cleaning', variant: 'bg-orange-100 text-orange-800 hover:bg-orange-100' },
  maintenance: {
    label: 'Maintenance',
    variant: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  out_of_service: { label: 'Out of Service', variant: 'bg-red-100 text-red-800 hover:bg-red-100' },
};

export function StatusBadge({ status, type = 'booking', className }: StatusBadgeProps) {
  let config: { label: string; variant: string };

  switch (type) {
    case 'payment':
      config = paymentStatusConfig[status as PaymentStatus] ?? { label: status, variant: '' };
      break;
    case 'room':
      config = roomStatusConfig[status as RoomStatus] ?? { label: status, variant: '' };
      break;
    default:
      config = bookingStatusConfig[status as BookingStatus] ?? { label: status, variant: '' };
  }

  return (
    <Badge variant="secondary" className={cn(config.variant, className)}>
      {config.label}
    </Badge>
  );
}
