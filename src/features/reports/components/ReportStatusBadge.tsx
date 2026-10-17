import { Badge } from '@/components/ui/badge';
import type { ReportStatus } from '../types/report.types';

const statusConfig = {
  PENDING: { 
    label: 'Pendente', 
    variant: 'default' as const,
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
  },
  UNDER_REVIEW: { 
    label: 'Em Análise', 
    variant: 'secondary' as const,
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
  },
  IN_PROGRESS: { 
    label: 'Em Andamento', 
    variant: 'outline' as const,
    className: 'bg-orange-100 text-orange-800 border-orange-300 hover:bg-orange-200'
  },
  RESOLVED: { 
    label: 'Resolvida', 
    variant: 'default' as const,
    className: 'bg-green-100 text-green-800 hover:bg-green-200'
  },
  UNRESOLVED: {
    label: 'Não resolvida',
    variant: 'destructive' as const,
    className: 'bg-red-100 text-red-800 hover:bg-red-200'
  },
  REJECTED: { 
    label: 'Rejeitada', 
    variant: 'destructive' as const,
    className: 'bg-red-100 text-red-800 hover:bg-red-200'
  }
};

interface ReportStatusBadgeProps {
  status: ReportStatus;
  className?: string;
}

export function ReportStatusBadge({ status, className = '' }: ReportStatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant={config?.variant} 
      className={`${config?.className} ${className}`}
    >
      {config?.label}
    </Badge>
  );
}