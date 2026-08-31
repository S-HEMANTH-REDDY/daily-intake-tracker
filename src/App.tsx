import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Layout } from './components/Layout'
import { DashboardPage } from './pages/Dashboard'
import { LogPage } from './pages/Log'
import { ProfilePage } from './pages/Profile'
import { SourcesPage } from './pages/Sources'
import { AppProvider } from './storage/AppProvider'

const HistoryPage = lazy(async () => {
  const m = await import('./pages/History')
  return { default: m.HistoryPage }
})
const CustomFoodPage = lazy(async () => {
  const m = await import('./pages/CustomFood')
  return { default: m.CustomFoodPage }
})

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={<p className="p-6 text-ink-soft">Loading…</p>}>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<DashboardPage />} />
              <Route path="log" element={<LogPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="sources" element={<SourcesPage />} />
              <Route path="custom" element={<CustomFoodPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  )
}
