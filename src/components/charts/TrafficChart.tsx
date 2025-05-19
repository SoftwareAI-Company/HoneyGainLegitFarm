import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface ChartData {
  date: string;
  value: number;
}

interface TrafficChartProps {
  title: string;
  data: ChartData[];
  className?: string;
  loading?: boolean;
}

const TrafficChart = ({ title, data, className, loading = false }: TrafficChartProps) => {
  return (
    <Card className={cn("bg-honeygain-card border-[#2d3749]", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-honeygain-muted">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-[200px] flex items-center justify-center text-honeygain-muted">
            Loading data...
          </div>
        ) : (
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3284c0" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3284c0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3749" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#8a8d93' }} 
                  axisLine={{ stroke: '#2d3749' }} 
                />
                <YAxis 
                  tick={{ fill: '#8a8d93' }} 
                  axisLine={{ stroke: '#2d3749' }} 
                />
                <Tooltip 
                  formatter={(value: number) => [`${value}`, 'Shared GB']} 
                  contentStyle={{ 
                    backgroundColor: '#222b3c', 
                    borderColor: '#2d3749',
                    color: '#fff'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3284c0" 
                  strokeWidth={2}
                  activeDot={{ r: 6, fill: '#ffb100' }}
                  dot={false}
                  fill="url(#blueGradient)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrafficChart;
