import { useMemo } from 'react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts'
import { Skeleton } from '@/components/ui/skeleton'

const COLORS = [
  'hsl(199, 89%, 48%)', // primary blue
  'hsl(172, 66%, 50%)', // teal
  'hsl(142, 71%, 45%)', // green
  'hsl(43, 96%, 56%)',  // yellow
  'hsl(262, 83%, 58%)', // purple (just a touch)
  'hsl(346, 87%, 62%)', // pink
  'hsl(24, 95%, 53%)',  // orange
  'hsl(199, 89%, 70%)', // light blue
]

interface RelationshipChartProps {
  data?: Record<string, number>
}

export function RelationshipChart({ data }: RelationshipChartProps) {
  const chartData = useMemo(() => {
    if (!data) return []

    return Object.entries(data)
      .filter(([, value]) => value > 0)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      }))
      .sort((a, b) => b.value - a.value)
  }, [data])

  if (!data) {
    return <Skeleton className="h-[300px] w-full" />
  }

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No data to display
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {chartData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                      {payload[0].name}
                    </span>
                    <span className="font-bold">
                      {payload[0].value} people
                    </span>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
