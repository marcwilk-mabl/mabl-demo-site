import React, { useEffect, useMemo, useRef, useState } from 'react'
import { IconBeaker, IconBolt, IconCheck, IconChevronDown, IconClose, IconGithub, IconShield } from './icons'

type Toast = { id: string; message: string; kind: 'success' | 'info' | 'error' }

function uid(prefix = 'id') {
  return `${prefix}-${Math.random().toString(16).slice(2)}-${Date.now()}`
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n))
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

const fakePlans = [
  { name: 'Starter', price: '$0', blurb: 'For quick experiments and demos.' },
  { name: 'Team', price: '$49', blurb: 'For teams practicing workflows.' },
  { name: 'Enterprise', price: 'Let’s talk', blurb: 'For full-scale automation programs.' },
] as const

const faqs = [
  { id: 'a1', q: 'Is anything here real?', a: 'Nope — it\'s intentionally fake. Great for automating without fear.' },
  { id: 'a2', q: 'Do you support stable selectors?', a: 'Yes. Key elements include ids and data-testid attributes.' },
  { id: 'a3', q: 'Can I add more pages?', a: 'Absolutely. Add routes or new components and expand the test surface.' },
] as const

function useLockBodyScroll(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [isLocked])
}

export default function App() {
  const [toast, setToast] = useState<Toast | null>(null)
  const toastTimer = useRef<number | null>(null)

  const [modalOpen, setModalOpen] = useState(false)
  useLockBodyScroll(modalOpen)

  const [activeTab, setActiveTab] = useState<'overview' | 'widgets' | 'pricing'>('overview')
  const [accordionOpen, setAccordionOpen] = useState<string | null>('a1')

  // Widgets
  const [counter, setCounter] = useState(0)
  const [slider, setSlider] = useState(35)
  const [toggle, setToggle] = useState(true)

  // Forms
  const [newsletterEmail, setNewsletterEmail] = useState('')
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'ok' | 'bad'>('idle')

  const [login, setLogin] = useState({ email: '', password: '' })
  const [loginStatus, setLoginStatus] = useState<'idle' | 'ok' | 'bad'>('idle')

  // Table
  const [search, setSearch] = useState('')
  const rows = useMemo(() => {
    const all = Array.from({ length: 14 }).map((_, i) => ({
      id: `CUST-${String(i + 1).padStart(3, '0')}`,
      name: ['Acme', 'Northwind', 'Umbrella', 'Globex', 'Initech', 'Hooli'][i % 6] + ` ${i + 1}`,
      status: (['Healthy', 'At Risk', 'Onboarding'] as const)[i % 3],
      lastRun: new Date(Date.now() - (i + 1) * 36e5 * 10).toLocaleString(),
    }))
    if (!search.trim()) return all
    const q = search.toLowerCase()
    return all.filter(r => r.id.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.status.toLowerCase().includes(q))
  }, [search])

  function showToast(message: string, kind: Toast['kind'] = 'info') {
    const id = uid('toast')
    setToast({ id, message, kind })
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => {
      setToast(cur => (cur?.id === id ? null : cur))
    }, 2800)
  }

  function handleNewsletterSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateEmail(newsletterEmail)) {
      setNewsletterStatus('bad')
      showToast('Please enter a valid email address.', 'error')
      return
    }
    setNewsletterStatus('ok')
    showToast('Subscribed! (Not really — this is a demo.)', 'success')
  }

  function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = validateEmail(login.email) && login.password.length >= 6
    setLoginStatus(ok ? 'ok' : 'bad')
    showToast(ok ? 'Login successful (mock).' : 'Login failed — check inputs.', ok ? 'success' : 'error')
  }

  function randomizeWidgets() {
    setCounter(c => c + Math.floor(Math.random() * 4 + 1))
    setSlider(s => clamp(s + (Math.random() > 0.5 ? 8 : -8), 0, 100))
    setToggle(t => !t)
    showToast('Widgets randomized.', 'info')
  }

  return (
    <div className="app">
      <SkipLink />

      <Header
        onOpenModal={() => setModalOpen(true)}
        onToast={() => showToast('This is a toast notification.', 'info')}
        onOpenGithub={() => showToast('Add your own repo remote here.', 'info')}
      />

      <main id="main" className="main">
        <Hero onPrimary={() => showToast('Primary CTA clicked.', 'success')} onSecondary={() => showToast('Secondary CTA clicked.', 'info')} />

        <section className="section" aria-labelledby="tabs-title">
          <div className="container">
            <div className="sectionHeader">
              <h2 id="tabs-title">Sandbox modules</h2>
              <p className="muted">
                UI patterns that are handy for building mabl tests: forms, modals, tables, tabs, toggles, and stateful content.
              </p>
            </div>

            <div className="tabs" role="tablist" aria-label="Demo tabs">
              <button
                id="tab-overview"
                data-testid="tab-overview"
                className={activeTab === 'overview' ? 'tab active' : 'tab'}
                role="tab"
                aria-selected={activeTab === 'overview'}
                aria-controls="panel-overview"
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                id="tab-widgets"
                data-testid="tab-widgets"
                className={activeTab === 'widgets' ? 'tab active' : 'tab'}
                role="tab"
                aria-selected={activeTab === 'widgets'}
                aria-controls="panel-widgets"
                onClick={() => setActiveTab('widgets')}
              >
                Widgets
              </button>
              <button
                id="tab-pricing"
                data-testid="tab-pricing"
                className={activeTab === 'pricing' ? 'tab active' : 'tab'}
                role="tab"
                aria-selected={activeTab === 'pricing'}
                aria-controls="panel-pricing"
                onClick={() => setActiveTab('pricing')}
              >
                Pricing
              </button>
            </div>

            {activeTab === 'overview' && (
              <div id="panel-overview" role="tabpanel" aria-labelledby="tab-overview" className="panel">
                <div className="grid3">
                  <FeatureCard
                    icon={<IconBolt />}
                    title="Stable selectors"
                    text="Key elements include ids and data-testid attributes so your mabl flows can target reliably."
                  />
                  <FeatureCard
                    icon={<IconShield />}
                    title="Form validation"
                    text="Try valid/invalid inputs, error states, and submit handling to practice assertions."
                  />
                  <FeatureCard
                    icon={<IconBeaker />}
                    title="Stateful UI"
                    text="Widgets update and render different states—great for waiting, verifying, and conditional flows."
                  />
                </div>

                <div className="callout" role="note" data-testid="how-to-callout">
                  <div className="calloutTitle">Try it:</div>
                  <ul className="calloutList">
                    <li>Click <strong>Open Modal</strong> in the header, then close it with the X or background.</li>
                    <li>Use the <strong>Newsletter</strong> form with an invalid email to trigger an error.</li>
                    <li>Filter the <strong>Customer table</strong> and verify the row count changes.</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'widgets' && (
              <div id="panel-widgets" role="tabpanel" aria-labelledby="tab-widgets" className="panel">
                <div className="grid2">
                  <div className="card">
                    <div className="cardHeader">
                      <h3>Interactive widgets</h3>
                      <p className="muted">Good for clicking, toggling, typing, and assertions.</p>
                    </div>

                    <div className="widgets">
                      <div className="widgetRow">
                        <div>
                          <div className="label">Counter</div>
                          <div className="bigNumber" data-testid="counter-value">{counter}</div>
                        </div>
                        <div className="btnRow">
                          <button id="btn-counter-dec" data-testid="btn-counter-dec" className="btn ghost" onClick={() => setCounter(c => c - 1)}>
                            -1
                          </button>
                          <button id="btn-counter-inc" data-testid="btn-counter-inc" className="btn" onClick={() => setCounter(c => c + 1)}>
                            +1
                          </button>
                        </div>
                      </div>

                      <div className="divider" />

                      <div className="widgetRow">
                        <div className="label">Toggle</div>
                        <button
                          id="toggle-feature"
                          data-testid="toggle-feature"
                          className={toggle ? 'toggle on' : 'toggle'}
                          role="switch"
                          aria-checked={toggle}
                          onClick={() => setToggle(t => !t)}
                        >
                          <span className="toggleDot" />
                          <span className="toggleText">{toggle ? 'On' : 'Off'}</span>
                        </button>
                      </div>

                      <div className="divider" />

                      <div className="widgetRow">
                        <div style={{ width: '100%' }}>
                          <div className="label">Slider</div>
                          <input
                            id="range-slider"
                            data-testid="range-slider"
                            type="range"
                            min={0}
                            max={100}
                            value={slider}
                            onChange={(e) => setSlider(Number(e.target.value))}
                          />
                          <div className="muted" data-testid="slider-value">{slider}</div>
                        </div>
                      </div>

                      <div className="divider" />

                      <div className="btnRow">
                        <button id="btn-randomize" data-testid="btn-randomize" className="btn" onClick={randomizeWidgets}>
                          Randomize widgets
                        </button>
                        <button
                          id="btn-disabled"
                          data-testid="btn-disabled"
                          className="btn ghost"
                          disabled
                          aria-disabled="true"
                          title="Disabled button for test assertions"
                        >
                          Disabled button
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="card">
                    <div className="cardHeader">
                      <h3>Mock login</h3>
                      <p className="muted">Email must be valid. Password must be 6+ characters.</p>
                    </div>

                    <form onSubmit={handleLoginSubmit} className="form" aria-label="Mock login form">
                      <div className="field">
                        <label htmlFor="login-email">Email</label>
                        <input
                          id="login-email"
                          data-testid="login-email"
                          type="email"
                          value={login.email}
                          onChange={(e) => setLogin(s => ({ ...s, email: e.target.value }))}
                          placeholder="you@company.com"
                          autoComplete="email"
                        />
                      </div>
                      <div className="field">
                        <label htmlFor="login-password">Password</label>
                        <input
                          id="login-password"
                          data-testid="login-password"
                          type="password"
                          value={login.password}
                          onChange={(e) => setLogin(s => ({ ...s, password: e.target.value }))}
                          placeholder="••••••"
                          autoComplete="current-password"
                        />
                      </div>

                      <div className="btnRow">
                        <button id="btn-login" data-testid="btn-login" className="btn" type="submit">
                          Sign in
                        </button>
                        <button
                          id="btn-login-reset"
                          data-testid="btn-login-reset"
                          className="btn ghost"
                          type="button"
                          onClick={() => {
                            setLogin({ email: '', password: '' })
                            setLoginStatus('idle')
                            showToast('Login form cleared.', 'info')
                          }}
                        >
                          Clear
                        </button>
                      </div>

                      <div
                        className={loginStatus === 'idle' ? 'status muted' : loginStatus === 'ok' ? 'status ok' : 'status bad'}
                        data-testid="login-status"
                        role="status"
                        aria-live="polite"
                      >
                        {loginStatus === 'idle' && 'Status: waiting'}
                        {loginStatus === 'ok' && 'Status: success'}
                        {loginStatus === 'bad' && 'Status: error'}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'pricing' && (
              <div id="panel-pricing" role="tabpanel" aria-labelledby="tab-pricing" className="panel">
                <div className="grid3">
                  {fakePlans.map((p) => (
                    <div key={p.name} className="pricingCard" data-testid={`plan-${p.name.toLowerCase()}`}>
                      <div className="pricingTop">
                        <div className="pill">{p.name}</div>
                        <div className="price">{p.price}</div>
                        <p className="muted">{p.blurb}</p>
                      </div>
                      <ul className="checkList" aria-label={`${p.name} features`}>
                        <li><IconCheck size={18} /> Test buttons + stable selectors</li>
                        <li><IconCheck size={18} /> Forms + validation states</li>
                        <li><IconCheck size={18} /> Tables + filtering</li>
                      </ul>
                      <button
                        className="btn wide"
                        id={`btn-select-${p.name.toLowerCase()}`}
                        data-testid={`btn-select-${p.name.toLowerCase()}`}
                        onClick={() => showToast(`${p.name} selected.`, 'success')}
                      >
                        Select {p.name}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="spacer" />

                <div className="grid2">
                  <div className="card">
                    <div className="cardHeader">
                      <h3>FAQ accordion</h3>
                      <p className="muted">Great for expanding/collapsing and verifying text visibility.</p>
                    </div>
                    <div className="accordion" data-testid="faq-accordion">
                      {faqs.map(item => {
                        const open = accordionOpen === item.id
                        return (
                          <div key={item.id} className={open ? 'accItem open' : 'accItem'}>
                            <button
                              className="accBtn"
                              id={`faq-${item.id}`}
                              data-testid={`faq-${item.id}`}
                              aria-expanded={open}
                              aria-controls={`faq-panel-${item.id}`}
                              onClick={() => setAccordionOpen(cur => (cur === item.id ? null : item.id))}
                            >
                              <span>{item.q}</span>
                              <IconChevronDown className="chev" />
                            </button>
                            <div id={`faq-panel-${item.id}`} className="accPanel" role="region" aria-labelledby={`faq-${item.id}`}>
                              <p className="muted">{item.a}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  <div className="card">
                    <div className="cardHeader">
                      <h3>Newsletter</h3>
                      <p className="muted">Practice input, validation, and submit assertions.</p>
                    </div>

                    <form onSubmit={handleNewsletterSubmit} className="form" aria-label="Newsletter form">
                      <div className="field">
                        <label htmlFor="newsletter-email">Email</label>
                        <input
                          id="newsletter-email"
                          data-testid="newsletter-email"
                          type="email"
                          value={newsletterEmail}
                          onChange={(e) => {
                            setNewsletterEmail(e.target.value)
                            setNewsletterStatus('idle')
                          }}
                          placeholder="name@example.com"
                          aria-invalid={newsletterStatus === 'bad'}
                        />
                        {newsletterStatus === 'bad' && (
                          <div className="error" data-testid="newsletter-error">
                            Please enter a valid email (example: name@company.com).
                          </div>
                        )}
                        {newsletterStatus === 'ok' && (
                          <div className="success" data-testid="newsletter-success">
                            You’re subscribed (mock).
                          </div>
                        )}
                      </div>

                      <div className="btnRow">
                        <button id="btn-newsletter-submit" data-testid="btn-newsletter-submit" className="btn" type="submit">
                          Subscribe
                        </button>
                        <button
                          id="btn-newsletter-clear"
                          data-testid="btn-newsletter-clear"
                          className="btn ghost"
                          type="button"
                          onClick={() => {
                            setNewsletterEmail('')
                            setNewsletterStatus('idle')
                            showToast('Newsletter form cleared.', 'info')
                          }}
                        >
                          Clear
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="section" aria-labelledby="table-title">
          <div className="container">
            <div className="sectionHeader">
              <h2 id="table-title">Recent test runs</h2>
              <p className="muted">A searchable table (filtering changes the number of rows).</p>
            </div>

            <div className="tableCard card">
              <div className="tableToolbar">
                <label className="srOnly" htmlFor="table-search">Search</label>
                <input
                  id="table-search"
                  data-testid="table-search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by id, name, or status..."
                />
                <div className="muted" data-testid="table-count">
                  {rows.length} results
                </div>
                <button
                  id="btn-clear-search"
                  data-testid="btn-clear-search"
                  className="btn ghost"
                  type="button"
                  onClick={() => setSearch('')}
                >
                  Clear
                </button>
              </div>

              <div className="tableWrap" role="region" aria-label="Customer table" tabIndex={0}>
                <table className="table" data-testid="customer-table">
                  <thead>
                    <tr>
                      <th scope="col">Customer ID</th>
                      <th scope="col">Name</th>
                      <th scope="col">Status</th>
                      <th scope="col">Last run</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r) => (
                      <tr key={r.id} data-testid={`row-${r.id}`}>
                        <td className="mono">{r.id}</td>
                        <td>{r.name}</td>
                        <td>
                          <span className={r.status === 'Healthy' ? 'badge ok' : r.status === 'At Risk' ? 'badge bad' : 'badge info'}>
                            {r.status}
                          </span>
                        </td>
                        <td className="mono">{r.lastRun}</td>
                      </tr>
                    ))}
                    {rows.length === 0 && (
                      <tr>
                        <td colSpan={4} className="empty" data-testid="table-empty">
                          No matching results.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="footNote muted">
              Tip: use <span className="mono">data-testid</span> attributes for super-stable selectors in your mabl tests.
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {modalOpen && (
        <Modal
          title="Demo modal"
          onClose={() => {
            setModalOpen(false)
            showToast('Modal closed.', 'info')
          }}
        >
          <p className="muted">
            This modal is designed for test practice. Close using the X button, Escape key, or by clicking the overlay.
          </p>

          <div className="btnRow">
            <button
              id="btn-modal-primary"
              data-testid="btn-modal-primary"
              className="btn"
              onClick={() => showToast('Modal primary clicked.', 'success')}
            >
              Confirm
            </button>
            <button
              id="btn-modal-secondary"
              data-testid="btn-modal-secondary"
              className="btn ghost"
              onClick={() => showToast('Modal secondary clicked.', 'info')}
            >
              Secondary
            </button>
          </div>
        </Modal>
      )}

      {toast && (
        <div
          className={toast.kind === 'success' ? 'toast success' : toast.kind === 'error' ? 'toast error' : 'toast info'}
          role="status"
          aria-live="polite"
          data-testid="toast"
        >
          <div className="toastInner">
            <div className="toastMsg">{toast.message}</div>
            <button
              className="toastClose"
              aria-label="Close toast"
              id="btn-toast-close"
              data-testid="btn-toast-close"
              onClick={() => setToast(null)}
            >
              <IconClose size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SkipLink() {
  return (
    <a className="skipLink" href="#main">
      Skip to content
    </a>
  )
}

function Header({
  onOpenModal,
  onToast,
  onOpenGithub,
}: {
  onOpenModal: () => void
  onToast: () => void
  onOpenGithub: () => void
}) {
  return (
    <header className="header">
      <div className="container headerInner">
        <div className="brand" aria-label="mabl demo brand">
          <div className="logoMark" aria-hidden="true" />
          <span className="brandText">mabl sandbox lab</span>
        </div>

        <nav className="nav" aria-label="Primary">
          <a className="navLink" href="#tabs-title" data-testid="nav-modules">Modules</a>
          <a className="navLink" href="#table-title" data-testid="nav-table">Table</a>
        </nav>

        <div className="headerActions">
          <button id="btn-open-modal" data-testid="btn-open-modal" className="btn ghost" onClick={onOpenModal}>
            Open Modal
          </button>
          <button id="btn-toast" data-testid="btn-toast" className="btn" onClick={onToast}>
            Show Toast
          </button>
          <button id="btn-github" data-testid="btn-github" className="iconBtn" onClick={onOpenGithub} aria-label="GitHub">
            <IconGithub />
          </button>
        </div>
      </div>
    </header>
  )
}

function Hero({ onPrimary, onSecondary }: { onPrimary: () => void; onSecondary: () => void }) {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="container heroInner">
        <div className="heroCopy">
          <div className="pill">Local • React • Test-friendly</div>
          <h1 id="hero-title">A polished sandbox for practicing mabl end-to-end tests</h1>
          <p className="muted">
            Built as a simple landing page with reliable selectors, common UI patterns, and state changes you can automate against.
          </p>
          <div className="btnRow">
            <button id="btn-cta-primary" data-testid="btn-cta-primary" className="btn" onClick={onPrimary}>
              Primary CTA
            </button>
            <button id="btn-cta-secondary" data-testid="btn-cta-secondary" className="btn ghost" onClick={onSecondary}>
              Secondary CTA
            </button>
          </div>

          <div className="heroStats" aria-label="Demo stats">
            <div className="stat">
              <div className="statNum" data-testid="stat-selectors">40+</div>
              <div className="muted">selectors</div>
            </div>
            <div className="stat">
              <div className="statNum" data-testid="stat-components">8</div>
              <div className="muted">patterns</div>
            </div>
            <div className="stat">
              <div className="statNum" data-testid="stat-local">100%</div>
              <div className="muted">local</div>
            </div>
          </div>
        </div>

        <div className="heroCard" aria-label="Hero demo card">
          <div className="heroCardTop">
            <div className="heroCardTitle">Workflow actions</div>
            <div className="muted">Fast state changes you can automate against</div>
          </div>

          <div className="heroCardBody">
            <button className="btn wide" id="btn-hero-action-1" data-testid="btn-hero-action-1" onClick={onPrimary}>
              Run a demo action
            </button>
            <button className="btn ghost wide" id="btn-hero-action-2" data-testid="btn-hero-action-2" onClick={onSecondary}>
              View demo details
            </button>
            <div className="miniGrid">
              <MiniCard title="Forms" text="Validate + submit" />
              <MiniCard title="Modals" text="Open + close" />
              <MiniCard title="Tables" text="Search + assert" />
              <MiniCard title="Widgets" text="Toggle + slider" />
            </div>
          </div>
        </div>
      </div>

      <div className="heroGlow" aria-hidden="true" />
    </section>
  )
}

function FeatureCard({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="featureCard">
      <div className="featureIcon">{icon}</div>
      <div className="featureTitle">{title}</div>
      <div className="muted">{text}</div>
    </div>
  )
}

function MiniCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="miniCard">
      <div className="miniTitle">{title}</div>
      <div className="muted">{text}</div>
    </div>
  )
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    // focus dialog for accessibility / testability
    dialogRef.current?.focus()
  }, [])

  return (
    <div
      className="modalOverlay"
      role="presentation"
      data-testid="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        ref={dialogRef}
        data-testid="modal"
      >
        <div className="modalHeader">
          <div className="modalTitle" data-testid="modal-title">{title}</div>
          <button
            className="iconBtn"
            id="btn-modal-close"
            data-testid="btn-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            <IconClose />
          </button>
        </div>
        <div className="modalBody">{children}</div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footerInner">
        <div className="muted">
          Built for local sandbox testing • <span className="mono">data-testid</span> selectors included
        </div>
        <div className="muted">
          Customize freely — add routes, APIs, auth mocks, or whatever you want.
        </div>
      </div>
    </footer>
  )
}
