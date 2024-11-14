import React from 'react';
import { format } from 'date-fns';
import { Check, CheckCheck, Clock } from 'lucide-react';

interface MessageStatusProps {
  status: 'sending' | 'sent' | 'delivered' | 'read';
  timestamp: string;
  className?: string;
}

export default function MessageStatus({
  status,
  timestamp,
  className = ''
}: MessageStatusProps) {
  const StatusIcon = {
    sending: Clock,
    sent: Check,
    delivered: CheckCheck,
    read: CheckCheck
  }[status];

  return (
    <div className={`flex items-center space-x-1.5 ${className}`}>
      <span>{format(new Date(timestamp), 'HH:mm')}</span>
      <StatusIcon className={`w-3.5 h-3.5 ${status === 'read' ? 'text-blue-400' : ''}`} />
    </div>
  );
}