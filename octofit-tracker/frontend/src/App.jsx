import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useParams } from 'react-router-dom'

const sections = ['Activities', 'Teams', 'Leaderboard', 'Workouts']
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL

function App() {
  const [service, setService] = useState({ status: 'checking', database: 'checking' })

  useEffect(() => {
    let active = true

    fetch(`${apiBaseUrl}/api/health`)
      .then((response) => {
        if (!response.ok) throw new Error('API request failed')
        return response.json()
      })
      .then((health) => {
        if (active) setService({ status: 'online', database: health.database })
      })
      .catch(() => {
        if (active) setService({ status: 'offline', database: 'unavailable' })
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container app-container d-flex align-items-center justify-content-between gap-3">
          <Link className="brand d-flex align-items-center gap-2 text-decoration-none" to="/">
            <img src="/octofitapp-small.png" alt="" />
            <span><strong>OctoFit</strong><small>TRACKER</small></span>
          </Link>
          <div className="service-status" aria-live="polite">
            <span className={`status-dot ${service.status}`} />
            API {service.status}
            <span className="status-divider">/</span>
            MongoDB {service.database}
          </div>
        </div>
      </header>

      <main className="container app-container py-4 py-lg-5">
        <div className="page-heading mb-4">
          <p className="eyebrow mb-2">YOUR FITNESS, TOGETHER</p>
          <h1 className="mb-1">OctoFit Tracker</h1>
          <p className="text-secondary mb-0">A shared space for movement and team momentum.</p>
        </div>

        <nav className="nav nav-tabs app-tabs" aria-label="Tracker sections">
          <NavLink end to="/" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Overview</NavLink>
          {sections.map((section) => (
            <NavLink
              key={section}
              to={`/${section.toLowerCase()}`}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              {section}
            </NavLink>
          ))}
        </nav>

        <Routes>
          <Route path="/" element={<Overview service={service} />} />
          <Route path="/:section" element={<Section />} />
          <Route path="*" element={<Overview service={service} />} />
        </Routes>
      </main>
    </div>
  )
}

function Overview({ service }) {
  return (
    <section className="overview py-4">
      <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-3">
        <div>
          <p className="eyebrow mb-1">WORKSPACE</p>
          <h2 className="h4 mb-0">Your tracker is ready</h2>
        </div>
        <span className="small text-secondary">Services: {service.status} | database {service.database}</span>
      </div>
      <div className="row g-3">
        {sections.map((section, index) => (
          <div className="col-12 col-sm-6 col-xl-3" key={section}>
            <Link className="module-link" to={`/${section.toLowerCase()}`}>
              <span className="module-index">0{index + 1}</span>
              <span className="module-name">{section}</span>
              <span className="module-arrow" aria-hidden="true">&gt;</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}

function Section() {
  const { section: routeSection = '' } = useParams()
  const section = sections.find((item) => item.toLowerCase() === routeSection.toLowerCase()) ?? 'Tracker'

  return (
    <section className="section-placeholder py-5">
      <p className="eyebrow mb-2">OCTOFIT TRACKER</p>
      <h2 className="h4">{section}</h2>
      <p className="text-secondary mb-0">This section is ready to connect to the OctoFit API.</p>
    </section>
  )
}

export default App
