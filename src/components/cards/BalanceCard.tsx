// src/components/cards/BalanceCard.tsx
import { CircleDollarSign, Package as ContainerIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import HoneycombIcon from '../icons/HoneycombIcon';

interface BalanceCardProps {
  title: string;
  balance: number;
  unit: 'cents' | 'int' | 'credits';
  className?: string;
}

const BalanceCard = ({ title, balance, unit, className }: BalanceCardProps) => {
  // Determine icon based on unit
  let IconComponent;
  let iconColor = 'text-honeygain';

  switch (unit) {
    case 'cents':
      IconComponent = CircleDollarSign;
      iconColor = 'text-green-500';
      break;
    case 'int':
      IconComponent = ContainerIcon;
      break;
    case 'credits':
    default:
      IconComponent = HoneycombIcon;
      break;
  }

  // Format the balance value
  let formattedValue: string;
  if (unit === 'cents') {
    formattedValue = (balance / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  } else if (unit === 'int') {
    formattedValue = balance.toString();
  } else {
    formattedValue = balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  return (
    <Card className={cn('bg-honeygain-card border-[#2d3749]', className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-honeygain-muted">
          {title}
        </CardTitle>
        <IconComponent className={cn('h-5 w-5', iconColor)} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formattedValue}
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;