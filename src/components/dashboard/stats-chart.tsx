import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { useReminders } from '@/hooks/use-reminders'
import { Skeleton } from '@/components/ui/skeleton'

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

export function StatsChart() {
  const { data: reminders, isLoading } = useReminders()

  const chartData = useMemo(() => {
    if (!reminders) {
      return MONTHS.map((month) => ({ name: month, total: 0 }))
    }

    const monthCounts = new Array(12).fill(0)

    reminders.forEach((reminder) => {
      const date = new Date(reminder.birthday)
      const month = date.getMonth()
      monthCounts[month]++
    })

    return MONTHS.map((month, index) => ({
      name: month,
      total: monthCounts[index],
    }))
  }, [reminders])

  if (isLoading) {
    return <Skeleton className="h-[350px] w-full" />
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Birthdays
                      </span>
                      <span className="font-bold text-muted-foreground">
                        {payload[0].value}
                      </span>
                    </div>
                  </div>
                </div>
              )
            }
            return null
          }}
        />
        <Bar
          dataKey="total"
          fill="hsl(var(--primary))"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
