import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { formatShortDate } from '../calculations/dates'
import type { DaySnapshot } from '../history/aggregates'

export function HistoryChart({ days }: { days: DaySnapshot[] }) {
  const data = days.map((d) => ({
    date: formatShortDate(d.date),
    cookies: Number(d.categoryServings.cookies.toFixed(1)),
    addedSugar: Number(d.nutrients.addedSugarG.toFixed(1)),
    calories: Math.round(d.nutrients.calories),
    sodium: Math.round(d.nutrients.sodiumMg),
  }))

  return (
    <div className="card-shadow h-80 rounded-3xl bg-card p-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e4d9cb" strokeDasharray="4 4" />
          <XAxis dataKey="date" tick={{ fill: '#5c5148', fontSize: 12 }} />
          <YAxis tick={{ fill: '#5c5148', fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              borderRadius: 16,
              border: '1px solid #e4d9cb',
              background: '#fffaf3',
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="addedSugar" name="Added sugar (g)" stroke="#c47a1a" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="cookies" name="Cookies" stroke="#6b3f2a" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="calories" name="Calories" stroke="#2f5d4a" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
