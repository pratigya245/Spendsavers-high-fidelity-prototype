import React, { useState, useRef, useEffect } from 'react'

// ── Tokens ────────────────────────────────────────────────────────

const C = {
  primary:      '#0D9488',
  primaryDark:  '#0F766E',
  primaryLight: '#F0FDFA',
  primaryMid:   '#CCFBF1',
  success:      '#059669',
  successLight: '#ECFDF5',
  amber:        '#D97706',
  amberLight:   '#FEF3C7',
  amberBg:      '#FFFBEB',
  red:          '#EF4444',
  redLight:     '#FEF2F2',
  bg:           '#F1F5F9',
  white:        '#FFFFFF',
  text:         '#1E293B',
  textMid:      '#475569',
  muted:        '#94A3B8',
  border:       '#E2E8F0',
  indigo:       '#6366F1',
  indigoLight:  '#EEF2FF',
  purple:       '#8B5CF6',
  purpleLight:  '#F5F3FF',
  pink:         '#EC4899',
}
const shadow   = '0 2px 8px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)'
const shadowMd = '0 4px 16px rgba(0,0,0,0.10), 0 2px 4px rgba(0,0,0,0.06)'

// ── Types ─────────────────────────────────────────────────────────

type Screen =
  | 'landing' | 'onboarding' | 'signup'
  | 'connect-bank' | 'bank-consent' | 'bank-connected'
  | 'home' | 'budget' | 'forecast' | 'shortfall'
  | 'save' | 'assistant' | 'profile'

type SaveSubTab = 'compare' | 'discounts' | 'challenges'
interface ChatMsg { role: 'user' | 'assistant'; text: string }

// ── Data ──────────────────────────────────────────────────────────

const TRANSACTIONS = [
  { id: 1,  merchant: 'Aldi Burwood East',    date: '27/09/2026', amount: -22.40, category: 'Groceries',      icon: '🛒', color: C.primary },
  { id: 2,  merchant: 'Myki Top-Up',           date: '27/09/2026', amount: -20.00, category: 'Transport',       icon: '🚌', color: C.indigo  },
  { id: 3,  merchant: 'Guzman y Gomez',        date: '26/09/2026', amount: -14.50, category: 'Eating Out',      icon: '🍜', color: C.amber   },
  { id: 4,  merchant: 'Woolworths Metro',      date: '25/09/2026', amount: -38.80, category: 'Groceries',      icon: '🛒', color: C.primary },
  { id: 5,  merchant: '7-Eleven Petrol',       date: '25/09/2026', amount: -4.50,  category: 'Transport',       icon: '⛽', color: C.indigo  },
  { id: 6,  merchant: 'Boost Juice Bar',       date: '24/09/2026', amount: -8.50,  category: 'Eating Out',      icon: '🥤', color: C.amber   },
  { id: 7,  merchant: 'Netflix Australia',     date: '23/09/2026', amount: -9.99,  category: 'Entertainment',   icon: '📺', color: C.pink    },
  { id: 8,  merchant: 'Coles Express',         date: '22/09/2026', amount: -16.20, category: 'Groceries',      icon: '🛒', color: C.primary },
  { id: 9,  merchant: 'Optus Mobile',          date: '22/09/2026', amount: -19.00, category: 'Phone & Internet',icon: '📱', color: C.purple  },
  { id: 10, merchant: "McDonald's Kingsford",  date: '21/09/2026', amount: -19.10, category: 'Eating Out',      icon: '🍔', color: C.amber   },
  { id: 11, merchant: 'Myki Top-Up',           date: '21/09/2026', amount: -12.00, category: 'Transport',       icon: '🚌', color: C.indigo  },
  { id: 12, merchant: 'Ventura Pty Ltd',       date: '14/09/2026', amount: -280.00,category: 'Rent',            icon: '🏠', color: C.success },
]

const CATEGORIES = [
  { name: 'Groceries',       icon: '🛒', spent: 61.40,  budget: 100, color: C.primary, lightColor: C.primaryLight },
  { name: 'Transport',       icon: '🚌', spent: 36.50,  budget: 60,  color: C.indigo,  lightColor: C.indigoLight  },
  { name: 'Eating Out',      icon: '🍜', spent: 42.10,  budget: 40,  color: C.amber,   lightColor: C.amberLight   },
  { name: 'Rent',            icon: '🏠', spent: 280,    budget: 280, color: C.success, lightColor: C.successLight },
  { name: 'Entertainment',   icon: '🎮', spent: 9.99,   budget: 20,  color: C.pink,    lightColor: '#FDF2F8'      },
  { name: 'Phone & Internet',icon: '📱', spent: 19,     budget: 25,  color: C.purple,  lightColor: C.purpleLight  },
]

const BANKS = [
  { name: 'Commonwealth Bank',   abbr: 'CBA', bg: '#FFE900', fg: '#1C1C1E' },
  { name: 'ANZ',                 abbr: 'ANZ', bg: '#007DBA', fg: '#fff'    },
  { name: 'Westpac',             abbr: 'WBC', bg: '#DA1710', fg: '#fff'    },
  { name: 'NAB',                 abbr: 'NAB', bg: '#E02626', fg: '#fff'    },
  { name: 'Macquarie Bank',      abbr: 'MQG', bg: '#1C1C1E', fg: '#fff'   },
  { name: 'ING Australia',       abbr: 'ING', bg: '#FF6200', fg: '#fff'   },
  { name: 'Bendigo Bank',        abbr: 'BEN', bg: '#C8102E', fg: '#fff'   },
  { name: 'Bank of Queensland',  abbr: 'BOQ', bg: '#AA0928', fg: '#fff'   },
]

const GROCERY = [
  { name: 'Full Cream Milk 2L',    coles: 2.80, woolies: 2.80, aldi: 2.39 },
  { name: 'White Bread 700g',      coles: 3.50, woolies: 3.20, aldi: 1.89 },
  { name: 'SunRice White 2kg',     coles: 4.50, woolies: 4.00, aldi: 3.29 },
  { name: 'Free Range Eggs 12pk',  coles: 5.50, woolies: 5.50, aldi: 4.99 },
  { name: 'Chicken Breast 500g',   coles: 8.00, woolies: 7.50, aldi: 6.49 },
  { name: 'Barilla Pasta 500g',    coles: 2.00, woolies: 1.80, aldi: 1.29 },
  { name: 'Frozen Peas 500g',      coles: 2.50, woolies: 2.50, aldi: 1.99 },
  { name: 'Greek Yoghurt 500g',    coles: 4.00, woolies: 3.80, aldi: 2.99 },
]

const DISCOUNTS = [
  { name: 'Myki Concession',      cat: 'Transport', saving: '50% off all public transport',    emoji: '🚌', color: C.indigo  },
  { name: 'Student Edge',         cat: 'Shopping',  saving: 'Deals across 100+ brands',        emoji: '🎫', color: C.primary },
  { name: 'UNiDAYS',             cat: 'Various',   saving: 'Tech, food and lifestyle deals',  emoji: '🎓', color: C.purple  },
  { name: 'Spotify Student',      cat: 'Music',     saving: '$7.99/mo — save 47%',             emoji: '🎵', color: '#1DB954' },
  { name: 'Microsoft 365',        cat: 'Software',  saving: 'Free via your university',        emoji: '💻', color: '#0078D4' },
  { name: 'Adobe Creative Cloud', cat: 'Software',  saving: '65% off — $27.99/mo',             emoji: '🎨', color: '#E1251B' },
  { name: 'ISIC Card',            cat: 'Travel',    saving: 'Worldwide student benefits',      emoji: '🌏', color: C.amber   },
]

const CHALLENGES = [
  { name: 'No Eating Out Week',  desc: 'Cook all meals at home this week',          reward: 'Save ~$45',      progress: 3,  total: 7,  active: true,  emoji: '🍳' },
  { name: '52-Week Challenge',   desc: 'Save $1 in week 1, $2 in week 2...',        reward: '$1,378/year',    progress: 22, total: 52, active: false, emoji: '📈' },
  { name: 'Skip the Café',       desc: 'Make coffee at home for 30 days',           reward: 'Save ~$120',     progress: 0,  total: 30, active: false, emoji: '☕' },
]

const FORECAST = [
  { week: 1,  balance: 1850, event: null         },
  { week: 2,  balance: 1670, event: null         },
  { week: 3,  balance: 1490, event: null         },
  { week: 4,  balance: 1160, event: 'rent'       },
  { week: 5,  balance: 1080, event: null         },
  { week: 6,  balance:  900, event: null         },
  { week: 7,  balance:  720, event: null         },
  { week: 8,  balance:  434, event: 'rent+fees'  },
  { week: 9,  balance:  330, event: 'risk'       },
  { week: 10, balance:  250, event: null         },
  { week: 11, balance:  160, event: null         },
  { week: 12, balance:   60, event: null         },
]

const UNIS = [
  'University of Sydney', 'University of New South Wales',
  'University of Melbourne', 'Monash University',
  'Australian National University', 'University of Queensland',
  'Macquarie University', 'RMIT University',
  'Deakin University', 'La Trobe University',
  'University of Technology Sydney', 'Western Sydney University',
]

const ONBOARDING = [
  { gradient: `linear-gradient(155deg, ${C.primary} 0%, ${C.primaryDark} 100%)`, solidBg: C.primary,  emoji: '📊', title: 'See where your\nmoney goes',       desc: "Your spending is sorted automatically. Groceries, transport, eating out — no manual entry, ever." },
  { gradient: 'linear-gradient(155deg, #6366F1 0%, #4338CA 100%)',               solidBg: '#6366F1',  emoji: '📅', title: 'Plan your\nwhole semester',      desc: "Forecast rent, uni fees, and bills ahead of time. Know when your balance might dip — before it happens." },
  { gradient: 'linear-gradient(155deg, #059669 0%, #047857 100%)',               solidBg: '#059669',  emoji: '💡', title: 'Save on\nessentials',             desc: "Compare grocery prices at Coles, Woolworths and Aldi. Access student discounts you didn't know about." },
]

// ── Primitives ────────────────────────────────────────────────────

function ProgressRing({ pct, size = 72, stroke = 7, color = C.primary, trackColor = '#E2E8F0' }: {
  pct: number; size?: number; stroke?: number; color?: string; trackColor?: string
}) {
  const r = (size - stroke) / 2
  const cx = size / 2, cy = size / 2
  const circ = 2 * Math.PI * r
  const filled = circ * Math.min(pct, 100) / 100
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={`${filled} ${circ - filled}`} strokeLinecap="round" />
    </svg>
  )
}

function StatusBar({ light = false }: { light?: boolean }) {
  const col = light ? '#fff' : C.text
  const op  = light ? 0.85 : 1
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px 0', height: 50 }}>
      <span style={{ fontSize: 15, fontWeight: 600, color: col, opacity: op }}>9:41</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <svg width="17" height="12" viewBox="0 0 17 12" fill={col} style={{ opacity: op }}>
          <rect x="0"    y="7"   width="3"   height="5"  rx="0.5" />
          <rect x="4.5"  y="4.5" width="3"   height="7.5" rx="0.5" />
          <rect x="9"    y="2"   width="3"   height="10" rx="0.5" />
          <rect x="13.5" y="0"   width="3.5" height="12" rx="0.5" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 20 15" fill={col} style={{ opacity: op }}>
          <path d="M10 12a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm0-4c1.86 0 3.55.7 4.82 1.85l1.52-1.52A8.92 8.92 0 0 0 10 6a8.92 8.92 0 0 0-6.34 2.33l1.52 1.52A6.91 6.91 0 0 1 10 8zm0-4c2.85 0 5.43 1.08 7.37 2.84l1.52-1.52A12.93 12.93 0 0 0 10 0C6.83 0 3.96 1.28 1.9 3.34l1.52 1.52A10.95 10.95 0 0 1 10 2z"/>
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" style={{ opacity: op }}>
          <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke={col} strokeOpacity="0.45" fill="none"/>
          <rect x="2" y="2" width="17" height="8" rx="1.5" fill={col}/>
          <path d="M23 4.5v3c.9-.35 1.5-1 1.5-1.5S23.9 4.85 23 4.5z" fill={col} fillOpacity="0.5"/>
        </svg>
      </div>
    </div>
  )
}

const NAV_TABS = [
  { key: 'home'      as Screen, label: 'Home'     },
  { key: 'budget'    as Screen, label: 'Budget'   },
  { key: 'forecast'  as Screen, label: 'Forecast' },
  { key: 'save'      as Screen, label: 'Save'     },
  { key: 'assistant' as Screen, label: 'AI Help'  },
]

function NavIcon({ name, active }: { name: string; active: boolean }) {
  const col = active ? C.primary : C.muted
  if (name === 'home') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={col}><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
  )
  if (name === 'budget') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={col}><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>
  )
  if (name === 'forecast') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={col}><path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/></svg>
  )
  if (name === 'save') return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={col}><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
  )
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill={col}><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/></svg>
  )
}

function BottomNav({ active, onNav }: { active: Screen; onNav: (s: Screen) => void }) {
  return (
    <div style={{ background: C.white, borderTop: `1px solid ${C.border}`, paddingBottom: 20 }}>
      <div style={{ display: 'flex' }}>
        {NAV_TABS.map(tab => {
          const isActive = active === tab.key
          return (
            <button key={tab.key} onClick={() => onNav(tab.key)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 0 4px', gap: 2, background: 'none', border: 'none', cursor: 'pointer', WebkitTapHighlightColor: 'transparent' }}>
              <NavIcon name={tab.key} active={isActive} />
              <span style={{ fontSize: 10, fontWeight: isActive ? 600 : 400, color: isActive ? C.primary : C.muted }}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function BackBtn({ onBack, light = false }: { onBack: () => void; light?: boolean }) {
  const col = light ? '#fff' : C.text
  return (
    <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: col, padding: 0 }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill={col}><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
      <span style={{ fontSize: 16, fontWeight: 500, fontFamily: 'Inter, sans-serif' }}>Back</span>
    </button>
  )
}

function Card({ children, style, onClick }: { children: React.ReactNode; style?: React.CSSProperties; onClick?: () => void }) {
  return (
    <div onClick={onClick} style={{ background: C.white, borderRadius: 16, padding: 16, boxShadow: shadow, cursor: onClick ? 'pointer' : undefined, ...style }}>
      {children}
    </div>
  )
}

// ── Forecast SVG Chart ────────────────────────────────────────────

function ForecastChart() {
  const W = 300, H = 130, padL = 6, padR = 6, padT = 12, padB = 22
  const iW = W - padL - padR, iH = H - padT - padB
  const maxBal = 2000

  const pts = FORECAST.map((d, i) => ({
    x: padL + (i / (FORECAST.length - 1)) * iW,
    y: padT + iH - (d.balance / maxBal) * iH,
    ...d,
  }))

  const linePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${pts[11].x.toFixed(1)},${(padT + iH).toFixed(1)} L${padL},${(padT + iH).toFixed(1)} Z`

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={C.primary} stopOpacity="0.18" />
          <stop offset="100%" stopColor={C.primary} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {/* Grid */}
      {[500, 1000, 1500].map(v => {
        const y = padT + iH - (v / maxBal) * iH
        return <line key={v} x1={padL} y1={y} x2={padL + iW} y2={y} stroke={C.border} strokeWidth="0.5" />
      })}
      {/* Risk zone */}
      <rect x={pts[8].x - 10} y={padT} width={20} height={iH} fill={C.amberLight} rx="2" opacity="0.7" />
      {/* Rent markers */}
      {[3, 7].map(i => (
        <line key={i} x1={pts[i].x} y1={padT} x2={pts[i].x} y2={padT + iH}
          stroke={C.success} strokeWidth="1.2" strokeDasharray="3,2" opacity="0.7" />
      ))}
      {/* Area fill */}
      <path d={areaPath} fill="url(#areaGrad)" />
      {/* Line */}
      <path d={linePath} fill="none" stroke={C.primary} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Key dots */}
      {pts.map((p, i) => {
        const isRent = i === 3 || i === 7
        const isRisk = i === 8
        const isEdge = i === 0 || i === 11
        if (!isRent && !isRisk && !isEdge) return null
        return (
          <circle key={i} cx={p.x} cy={p.y} r={isRisk ? 5 : 4}
            fill={isRisk ? C.amber : (isRent ? C.success : C.primary)} stroke="white" strokeWidth="1.5" />
        )
      })}
      {/* X labels */}
      {pts.filter((_, i) => i % 2 === 0).map(p => (
        <text key={p.week} x={p.x} y={H - 4} textAnchor="middle"
          fontSize="8.5" fill={C.muted} fontFamily="Inter, sans-serif" fontWeight="500">
          W{p.week}
        </text>
      ))}
    </svg>
  )
}

// ── Screen: Landing ───────────────────────────────────────────────

function LandingScreen({ nav }: { nav: (s: Screen) => void }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: `linear-gradient(155deg, ${C.primary} 0%, ${C.primaryDark} 55%, #134E4A 100%)` }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', gap: 24 }}>
        <div style={{ width: 90, height: 90, borderRadius: 28, background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(20px)', border: '1.5px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.25)', fontSize: 44 }}>
          💰
        </div>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: 38, fontWeight: 800, color: '#fff', letterSpacing: -1.5, lineHeight: 1.1, margin: 0 }}>SpendSavers</h1>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.75)', marginTop: 8, fontWeight: 500, letterSpacing: 0.1 }}>Spend Smarter, Save Better</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[{ e: '🎓', l: 'Students' }, { e: '🤖', l: 'AI-Powered' }, { e: '🇦🇺', l: 'Australia' }].map(item => (
            <div key={item.l} style={{ textAlign: 'center' }}>
              <div style={{ width: 54, height: 54, borderRadius: 18, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, border: '1px solid rgba(255,255,255,0.2)' }}>
                {item.e}
              </div>
              <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.65)', marginTop: 5, fontWeight: 500 }}>{item.l}</p>
            </div>
          ))}
        </div>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.65, maxWidth: 260 }}>
          AI-powered budgeting designed for international students navigating finances in Australia
        </p>
      </div>
      <div style={{ padding: '0 20px 32px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <button onClick={() => nav('onboarding')}
          style={{ width: '100%', padding: 16, background: '#fff', color: C.primary, fontWeight: 700, fontSize: 17, borderRadius: 16, border: 'none', boxShadow: '0 8px 24px rgba(0,0,0,0.25)', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          Get Started
        </button>
        <button onClick={() => nav('home')}
          style={{ width: '100%', padding: 16, background: 'rgba(255,255,255,0.12)', color: '#fff', fontWeight: 600, fontSize: 17, borderRadius: 16, border: '1.5px solid rgba(255,255,255,0.4)', cursor: 'pointer', fontFamily: 'Inter, sans-serif', backdropFilter: 'blur(10px)' }}>
          Log in
        </button>
      </div>
    </div>
  )
}

// ── Screen: Onboarding ────────────────────────────────────────────

function OnboardingScreen({ nav, step, setStep }: { nav: (s: Screen) => void; step: number; setStep: (n: number) => void }) {
  const slide = ONBOARDING[step]
  const touchStart = useRef(0)

  const handleNext = () => step < ONBOARDING.length - 1 ? setStep(step + 1) : nav('signup')
  const onTouchStart = (e: React.TouchEvent) => { touchStart.current = e.touches[0].clientX }
  const onTouchEnd   = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX
    if (diff > 40) handleNext()
    else if (diff < -40 && step > 0) setStep(step - 1)
  }

  const btnColor = step === 0 ? C.primary : step === 1 ? '#6366F1' : '#059669'

  return (
    <div className="screen-enter" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: slide.gradient }}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px 20px 0' }}>
        <button onClick={() => nav('signup')}
          style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          Skip
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', gap: 28 }}>
        <div style={{ width: 120, height: 120, borderRadius: 40, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 58, boxShadow: '0 16px 40px rgba(0,0,0,0.15)' }}>
          {slide.emoji}
        </div>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 0 14px', lineHeight: 1.2, letterSpacing: -0.8, whiteSpace: 'pre-line' }}>
            {slide.title}
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.65, margin: 0 }}>{slide.desc}</p>
        </div>
      </div>
      <div style={{ padding: '0 20px 36px' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 20 }}>
          {ONBOARDING.map((_, i) => (
            <button key={i} onClick={() => setStep(i)}
              style={{ width: i === step ? 24 : 8, height: 8, borderRadius: 4, background: i === step ? '#fff' : 'rgba(255,255,255,0.35)', border: 'none', cursor: 'pointer', padding: 0, transition: 'all 0.2s' }} />
          ))}
        </div>
        <button onClick={handleNext}
          style={{ width: '100%', padding: 16, background: '#fff', color: btnColor, fontWeight: 700, fontSize: 17, borderRadius: 16, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          {step === ONBOARDING.length - 1 ? 'Create Account' : 'Next'}
        </button>
      </div>
    </div>
  )
}

// ── Screen: Sign Up ───────────────────────────────────────────────

function SignUpScreen({ nav }: { nav: (s: Screen) => void }) {
  const [form, setForm] = useState({ name: '', email: '', university: '', studentType: '', income: '' })
  const up = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const input: React.CSSProperties = {
    width: '100%', padding: '13px 14px', borderRadius: 12,
    border: `1.5px solid ${C.border}`, fontSize: 15, fontFamily: 'Inter, sans-serif',
    color: C.text, background: '#fff', outline: 'none',
  }
  const label: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: C.textMid, marginBottom: 6, display: 'block' }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 20px 0', flexShrink: 0 }}>
        <BackBtn onBack={() => nav('onboarding')} />
        <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, marginTop: 14, marginBottom: 4, letterSpacing: -0.8 }}>Create your account</h1>
        <p style={{ fontSize: 14, color: C.muted, margin: 0 }}>Let's get to know you</p>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px 0' }} className="hide-scroll">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={label}>Full name</label>
            <input style={input} placeholder="e.g. Aarav Sharma" value={form.name} onChange={e => up('name', e.target.value)} />
          </div>
          <div>
            <label style={label}>Email address</label>
            <input style={input} type="email" placeholder="student@university.edu.au" value={form.email} onChange={e => up('email', e.target.value)} />
          </div>
          <div>
            <label style={label}>University</label>
            <select style={{ ...input, appearance: 'none' as any }} value={form.university} onChange={e => up('university', e.target.value)}>
              <option value="">Select your university</option>
              {UNIS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <label style={label}>Student type</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['International', 'Domestic'].map(t => (
                <button key={t} onClick={() => up('studentType', t)}
                  style={{ flex: 1, padding: '12px 8px', borderRadius: 12, border: `1.5px solid ${form.studentType === t ? C.primary : C.border}`, background: form.studentType === t ? C.primaryLight : '#fff', color: form.studentType === t ? C.primary : C.text, fontWeight: form.studentType === t ? 600 : 400, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label style={label}>Main income source</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {([['💼', 'Casual job'], ['💸', 'Family transfers'], ['🎓', 'Scholarship']] as [string, string][]).map(([e, t]) => (
                <button key={t} onClick={() => up('income', t)}
                  style={{ padding: '12px 14px', borderRadius: 12, border: `1.5px solid ${form.income === t ? C.primary : C.border}`, background: form.income === t ? C.primaryLight : '#fff', color: form.income === t ? C.primary : C.text, fontWeight: form.income === t ? 600 : 400, fontSize: 14, cursor: 'pointer', fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}>
                  <span>{e}</span><span>{t}</span>
                </button>
              ))}
            </div>
          </div>
          <div style={{ height: 4 }} />
        </div>
      </div>
      <div style={{ padding: '12px 20px 20px', flexShrink: 0 }}>
        <button onClick={() => nav('connect-bank')}
          style={{ width: '100%', padding: 16, background: C.primary, color: '#fff', fontWeight: 700, fontSize: 17, borderRadius: 16, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          Continue →
        </button>
      </div>
    </div>
  )
}

// ── Screen: Connect Bank ──────────────────────────────────────────

function ConnectBankScreen({ nav, setBank }: { nav: (s: Screen) => void; setBank: (b: string) => void }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 20px 0', flexShrink: 0 }}>
        <BackBtn onBack={() => nav('signup')} />
        <h1 style={{ fontSize: 26, fontWeight: 800, color: C.text, marginTop: 14, marginBottom: 4, letterSpacing: -0.8 }}>Connect your bank</h1>
        <p style={{ fontSize: 14, color: C.muted, margin: '0 0 12px' }}>Choose your bank via Australian Open Banking</p>
        <div style={{ padding: '10px 14px', borderRadius: 12, background: C.successLight, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 16 }}>🔒</span>
          <span style={{ fontSize: 12, color: C.success, fontWeight: 500, lineHeight: 1.4 }}>Read-only access · Bank-grade encryption · CDR accredited</span>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }} className="hide-scroll">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {BANKS.map(bank => (
            <button key={bank.name} onClick={() => { setBank(bank.name); nav('bank-consent') }}
              style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px', borderRadius: 16, background: C.white, border: `1px solid ${C.border}`, cursor: 'pointer', boxShadow: shadow, textAlign: 'left', width: '100%', fontFamily: 'Inter, sans-serif' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: bank.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: bank.fg, letterSpacing: -0.3 }}>{bank.abbr}</span>
              </div>
              <span style={{ fontSize: 15, fontWeight: 500, color: C.text, flex: 1 }}>{bank.name}</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={C.muted}><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Screen: Bank Consent ──────────────────────────────────────────

function BankConsentScreen({ nav, bank }: { nav: (s: Screen) => void; bank: string }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 20px', flexShrink: 0 }}>
        <BackBtn onBack={() => nav('connect-bank')} />
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }} className="hide-scroll">
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ width: 68, height: 68, borderRadius: 22, background: C.primaryLight, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 34 }}>🏦</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: '0 0 8px', letterSpacing: -0.5 }}>Connect to {bank}</h2>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.6, margin: 0 }}>SpendSavers is requesting <strong>read-only</strong> access to your account</p>
        </div>
        <Card style={{ marginBottom: 12 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 12, textTransform: 'uppercase', letterSpacing: 0.6, margin: '0 0 12px' }}>What we access</p>
          {([['📊', 'Account balance', 'To show your available funds'], ['🔄', 'Transactions', 'To categorise your spending automatically'], ['📅', 'Statement data', 'To identify recurring bills and forecast']] as [string,string,string][]).map(([e, t, d]) => (
            <div key={t} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{e}</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>{t}</p>
                <p style={{ fontSize: 12, color: C.muted, margin: '2px 0 0' }}>{d}</p>
              </div>
            </div>
          ))}
        </Card>
        <Card style={{ background: '#F8FAFC', marginBottom: 12 }}>
          <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.6, margin: '0 0 10px' }}>What we never do</p>
          {['Make payments or transfers', 'Store your banking password', 'Sell your data to third parties', 'Access your bank without consent'].map(t => (
            <div key={t} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill={C.success} style={{ flexShrink: 0, marginTop: 1 }}><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              <span style={{ fontSize: 13, color: C.text }}>{t}</span>
            </div>
          ))}
        </Card>
        <p style={{ fontSize: 11, color: C.muted, textAlign: 'center', lineHeight: 1.6 }}>
          Powered by the Australian Consumer Data Right (CDR). Revoke access at any time in Settings.
        </p>
        <div style={{ height: 8 }} />
      </div>
      <div style={{ padding: '12px 20px 20px', flexShrink: 0 }}>
        <button onClick={() => nav('bank-connected')}
          style={{ width: '100%', padding: 16, background: C.primary, color: '#fff', fontWeight: 700, fontSize: 17, borderRadius: 16, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          Authorise — Read Only
        </button>
      </div>
    </div>
  )
}

// ── Screen: Bank Connected ────────────────────────────────────────

function BankConnectedScreen({ nav }: { nav: (s: Screen) => void }) {
  return (
    <div className="screen-enter" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 28px', background: `linear-gradient(155deg, ${C.success} 0%, #047857 100%)` }}>
      <div style={{ width: 96, height: 96, borderRadius: 48, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <svg width="52" height="52" viewBox="0 0 24 24" fill="#fff"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
      </div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: '#fff', margin: '0 0 10px', letterSpacing: -0.8 }}>Bank connected ✓</h2>
      <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 1.65, marginBottom: 28 }}>
        Your account is linked. SpendSavers is analysing your transactions and building your spending profile.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', marginBottom: 32 }}>
        {['📊 Transactions imported', '🏷️ Categories assigned', '📅 Bills detected'].map(t => (
          <div key={t} style={{ padding: '10px 14px', background: 'rgba(255,255,255,0.18)', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: '#fff', fontWeight: 500 }}>{t}</span>
          </div>
        ))}
      </div>
      <button onClick={() => nav('home')}
        style={{ width: '100%', padding: 16, background: '#fff', color: C.success, fontWeight: 700, fontSize: 17, borderRadius: 16, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
        Let's see my dashboard →
      </button>
    </div>
  )
}

// ── Screen: Home ──────────────────────────────────────────────────

function HomeScreen({ nav }: { nav: (s: Screen) => void }) {
  const leftPct = Math.round((142.50 / 320) * 100)
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 20px 0', flexShrink: 0, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: 0, letterSpacing: -0.5 }}>Hi Aarav 👋</h1>
          <p style={{ fontSize: 13, color: C.muted, margin: '4px 0 0' }}>21/09 – 27/09/2026</p>
        </div>
        <button onClick={() => nav('profile')}
          style={{ width: 40, height: 40, borderRadius: 20, background: `linear-gradient(135deg, ${C.primary}, ${C.indigo})`, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: '#fff' }}>
          A
        </button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px' }} className="hide-scroll">

        {/* Hero card */}
        <Card style={{ marginBottom: 12, background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryDark} 100%)`, padding: '18px 18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.75)', fontWeight: 500, margin: '0 0 6px', letterSpacing: 0.2 }}>Left to spend this week</p>
              <p style={{ fontSize: 36, fontWeight: 800, color: '#fff', margin: 0, letterSpacing: -1.5, lineHeight: 1 }}>$142.50</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: '5px 0 12px' }}>of $320.00 weekly budget</p>
              <div style={{ height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${leftPct}%`, background: '#fff', borderRadius: 3 }} />
              </div>
              <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', margin: '5px 0 0' }}>{leftPct}% of budget remaining</p>
            </div>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <ProgressRing pct={leftPct} size={82} stroke={8} color="#fff" trackColor="rgba(255,255,255,0.22)" />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: 17, fontWeight: 800, color: '#fff', lineHeight: 1 }}>{leftPct}%</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.7)', fontWeight: 500 }}>left</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Semester outlook */}
        <Card style={{ marginBottom: 10 }} onClick={() => nav('forecast')}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: C.successLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📅</div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 2px' }}>Semester outlook</p>
                <p style={{ fontSize: 13, color: C.success, margin: 0, fontWeight: 600 }}>On track until Week 9</p>
              </div>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill={C.muted}><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6z"/></svg>
          </div>
        </Card>

        {/* Amber alert */}
        <div onClick={() => nav('shortfall')}
          style={{ marginBottom: 12, padding: '14px 14px 12px', borderRadius: 16, background: C.amberBg, border: `1px solid ${C.amberLight}`, cursor: 'pointer' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', margin: '0 0 3px' }}>Heads up!</p>
              <p style={{ fontSize: 13, color: '#92400E', margin: 0, lineHeight: 1.5 }}>Your balance may be <strong>$86 short</strong> before rent is due on <strong>14/10/2026</strong></p>
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <span style={{ display: 'inline-block', padding: '7px 14px', background: C.amber, color: '#fff', borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
              See options →
            </span>
          </div>
        </div>

        {/* Top spending */}
        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: '0 0 10px', letterSpacing: -0.3 }}>Top spending this week</h3>
        <Card style={{ marginBottom: 12 }}>
          {[
            { e: '🛒', cat: 'Groceries',       amt: 61.40,  color: C.primary },
            { e: '🍜', cat: 'Eating out',       amt: 42.10,  color: C.amber   },
            { e: '🏠', cat: 'Rent',             amt: 280.00, color: C.success },
            { e: '🚌', cat: 'Transport',        amt: 36.50,  color: C.indigo  },
            { e: '📱', cat: 'Phone & internet', amt: 19.00,  color: C.purple  },
          ].map((item, idx) => (
            <div key={item.cat} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: idx > 0 ? 10 : 0, paddingBottom: idx < 4 ? 10 : 0, borderBottom: idx < 4 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, background: item.color + '1A' }}>
                {item.e}
              </div>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: C.text }}>{item.cat}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>${item.amt.toFixed(2)}</span>
            </div>
          ))}
        </Card>

        {/* Quick actions */}
        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: '0 0 10px', letterSpacing: -0.3 }}>Quick actions</h3>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          {([['🛒', 'Compare\ngroceries', 'save'], ['🎫', 'Find\ndiscounts', 'save'], ['🤖', 'Ask\nAssistant', 'assistant']] as [string,string,Screen][]).map(([e, label, sc]) => (
            <button key={label} onClick={() => nav(sc)}
              style={{ flex: 1, padding: '12px 8px', borderRadius: 14, background: C.white, border: `1px solid ${C.border}`, cursor: 'pointer', boxShadow: shadow, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, fontFamily: 'Inter, sans-serif' }}>
              <span style={{ fontSize: 24 }}>{e}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.textMid, textAlign: 'center', whiteSpace: 'pre-line', lineHeight: 1.3 }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Emergency buffer */}
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 3px' }}>🎯 Emergency buffer</p>
              <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Nice work, you're 36% of the way there!</p>
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: C.primary }}>36%</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, height: 8, borderRadius: 4, background: C.border, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '36%', background: C.primary, borderRadius: 4 }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: C.text, flexShrink: 0 }}>$180 / $500</span>
          </div>
        </Card>

        <div style={{ height: 16 }} />
      </div>
    </div>
  )
}

// ── Screen: Budget ────────────────────────────────────────────────

function BudgetScreen({ nav: _nav }: { nav: (s: Screen) => void }) {
  const [editing, setEditing] = useState<string | null>(null)
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 20px 0', flexShrink: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: 0, letterSpacing: -0.5 }}>Budget</h1>
        <p style={{ fontSize: 13, color: C.muted, margin: '4px 0 14px' }}>Week of 21/09 – 27/09/2026</p>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }} className="hide-scroll">
        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.muted, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 0.6 }}>Category budgets</h3>
        <Card style={{ marginBottom: 14 }}>
          {CATEGORIES.map((cat, idx) => {
            const pct = Math.min((cat.spent / cat.budget) * 100, 100)
            const over = cat.spent > cat.budget
            return (
              <div key={cat.name} style={{ paddingTop: idx > 0 ? 12 : 0, paddingBottom: idx < CATEGORIES.length - 1 ? 12 : 0, borderBottom: idx < CATEGORIES.length - 1 ? `1px solid ${C.border}` : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{cat.icon}</span>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: C.text }}>{cat.name}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: over ? C.red : C.muted }}>
                    ${cat.spent.toFixed(2)} / ${cat.budget.toFixed(2)}
                  </span>
                  <button onClick={() => setEditing(editing === cat.name ? null : cat.name)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill={C.muted}><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1 1 0 0 0 0-1.41l-2.34-2.34a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                  </button>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: C.border, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: over ? C.red : cat.color, borderRadius: 3, transition: 'width 0.3s' }} />
                </div>
                {over && <p style={{ fontSize: 11, color: C.red, margin: '4px 0 0', fontWeight: 500 }}>Over budget by ${(cat.spent - cat.budget).toFixed(2)}</p>}
                {editing === cat.name && (
                  <div style={{ marginTop: 8, padding: '10px 12px', background: C.bg, borderRadius: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: C.textMid, flexShrink: 0 }}>New budget $</span>
                    <input defaultValue={cat.budget} type="number"
                      style={{ flex: 1, padding: '6px 8px', borderRadius: 8, border: `1px solid ${C.border}`, fontSize: 13, fontFamily: 'Inter, sans-serif', outline: 'none' }} />
                    <button onClick={() => setEditing(null)}
                      style={{ padding: '6px 12px', background: C.primary, color: '#fff', borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', flexShrink: 0 }}>Save</button>
                  </div>
                )}
              </div>
            )
          })}
        </Card>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.muted, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 0.6 }}>Transactions</h3>
        <Card>
          {TRANSACTIONS.map((t, idx) => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: idx > 0 ? 11 : 0, paddingBottom: idx < TRANSACTIONS.length - 1 ? 11 : 0, borderBottom: idx < TRANSACTIONS.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: t.color + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>
                {t.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.merchant}</p>
                <div style={{ display: 'flex', gap: 6, marginTop: 2, alignItems: 'center' }}>
                  <span style={{ fontSize: 11, color: C.muted }}>{t.date}</span>
                  <span style={{ fontSize: 10, color: t.color, fontWeight: 600, background: t.color + '18', padding: '1px 6px', borderRadius: 4 }}>{t.category}</span>
                </div>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.text, flexShrink: 0 }}>-${Math.abs(t.amount).toFixed(2)}</span>
            </div>
          ))}
        </Card>
        <div style={{ height: 16 }} />
      </div>
    </div>
  )
}

// ── Screen: Forecast ──────────────────────────────────────────────

function ForecastScreen({ nav }: { nav: (s: Screen) => void }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 20px 0', flexShrink: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: 0, letterSpacing: -0.5 }}>Semester Forecast</h1>
        <p style={{ fontSize: 13, color: C.muted, margin: '4px 0 14px' }}>Sem 2 2026 · Weeks 1–12</p>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }} className="hide-scroll">
        <div style={{ display: 'flex', gap: 10, marginBottom: 14 }}>
          {([['$1,850', 'Starting', C.primary], ['$60', 'Projected end', C.amber], ['Week 9', 'Risk week', C.red]] as [string,string,string][]).map(([val, label, col]) => (
            <div key={label} style={{ flex: 1, padding: '10px 8px', borderRadius: 12, background: C.white, textAlign: 'center', boxShadow: shadow }}>
              <p style={{ fontSize: 15, fontWeight: 800, color: col, margin: 0 }}>{val}</p>
              <p style={{ fontSize: 10, color: C.muted, margin: '3px 0 0', fontWeight: 500 }}>{label}</p>
            </div>
          ))}
        </div>
        <Card style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: C.text, margin: 0 }}>Projected balance</p>
            <div style={{ display: 'flex', gap: 10 }}>
              {([C.success, C.amber] as string[]).map((col, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 7, height: 7, borderRadius: 4, background: col }} />
                  <span style={{ fontSize: 10, color: C.muted }}>{i === 0 ? 'Rent' : 'Risk zone'}</span>
                </div>
              ))}
            </div>
          </div>
          <ForecastChart />
        </Card>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: C.muted, margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: 0.6 }}>Upcoming payments</h3>
        <Card style={{ marginBottom: 12 }}>
          {([
            ['14/10/2026', 'Rent due',          '$280.00',    '🏠', C.success],
            ['27/10/2026', 'Tuition fee',        '$1,200.00',  '🎓', C.indigo ],
            ['01/11/2026', 'Rent due',           '$280.00',    '🏠', C.success],
            ['22/10/2026', 'Optus billing',      '$19.00',     '📱', C.purple ],
          ] as [string,string,string,string,string][]).map(([date, label, amt, e, col], idx) => (
            <div key={date+label} style={{ display: 'flex', gap: 12, alignItems: 'center', paddingTop: idx > 0 ? 11 : 0, paddingBottom: idx < 3 ? 11 : 0, borderBottom: idx < 3 ? `1px solid ${C.border}` : 'none' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: col + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>{e}</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>{label}</p>
                <p style={{ fontSize: 11, color: C.muted, margin: '2px 0 0' }}>{date}</p>
              </div>
              <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{amt}</span>
            </div>
          ))}
        </Card>
        <div onClick={() => nav('shortfall')}
          style={{ padding: 14, borderRadius: 16, background: '#FFF7ED', border: '1px solid #FED7AA', marginBottom: 16, cursor: 'pointer' }}>
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ fontSize: 20, flexShrink: 0 }}>⚠️</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#92400E', margin: '0 0 4px' }}>Week 9 is your risk week</p>
              <p style={{ fontSize: 12, color: '#B45309', margin: 0, lineHeight: 1.55 }}>
                Balance projected at $330 — rent of $280 due just 5 days later. Tap to see shortfall options.
              </p>
            </div>
          </div>
        </div>
        <div style={{ height: 4 }} />
      </div>
    </div>
  )
}

// ── Screen: Shortfall ─────────────────────────────────────────────

function ShortfallScreen({ nav }: { nav: (s: Screen) => void }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 20px 0', flexShrink: 0 }}>
        <BackBtn onBack={() => nav('home')} />
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text, marginTop: 14, marginBottom: 2, letterSpacing: -0.5 }}>Shortfall options</h1>
        <p style={{ fontSize: 13, color: C.muted, margin: '0 0 0' }}>Rent due 14/10/2026 · $280.00</p>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px' }} className="hide-scroll">
        {/* Gap card */}
        <div style={{ padding: 16, borderRadius: 16, background: C.amberBg, border: `1px solid ${C.amberLight}`, marginBottom: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 700, color: '#92400E', margin: '0 0 8px' }}>⚠️ You're $86 short</p>
          <p style={{ fontSize: 13, color: '#B45309', margin: '0 0 14px', lineHeight: 1.6 }}>
            At your current spending rate, your balance on 14/10 is projected to be <strong>$194</strong> — $86 short of your $280 rent.
          </p>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: 22, fontWeight: 800, color: '#92400E', margin: 0 }}>$194</p>
              <p style={{ fontSize: 11, color: '#B45309', margin: '2px 0 0' }}>projected balance</p>
            </div>
            <span style={{ fontSize: 18, color: '#B45309', fontWeight: 700 }}>vs</span>
            <div style={{ textAlign: 'center', flex: 1 }}>
              <p style={{ fontSize: 22, fontWeight: 800, color: '#92400E', margin: 0 }}>$280</p>
              <p style={{ fontSize: 11, color: '#B45309', margin: '2px 0 0' }}>rent amount</p>
            </div>
          </div>
        </div>

        <h3 style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: '0 0 12px', letterSpacing: -0.3 }}>How to close the gap</h3>

        {/* Option 1 */}
        <Card style={{ marginBottom: 12, border: `1.5px solid ${C.amberLight}` }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🍜</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 4px' }}>Cut eating out this week</p>
              <p style={{ fontSize: 13, color: C.muted, margin: '0 0 10px', lineHeight: 1.5 }}>You've spent $42.10 eating out, $2.10 over budget. Cutting back this fortnight could save ~$60–80.</p>
              <div style={{ padding: '8px 12px', background: C.successLight, borderRadius: 10 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: C.success, margin: 0 }}>✓ Projected result: Close gap by ~$70</p>
              </div>
            </div>
          </div>
          <button style={{ marginTop: 12, width: '100%', padding: 10, background: C.amber, color: '#fff', fontWeight: 600, fontSize: 13, borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            Set eating out limit to $20 this week
          </button>
        </Card>

        {/* Option 2 */}
        <Card style={{ marginBottom: 12, border: `1.5px solid ${C.indigoLight}` }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: C.indigoLight, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>💼</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 4px' }}>Pick up an extra shift</p>
              <p style={{ fontSize: 13, color: C.muted, margin: '0 0 10px', lineHeight: 1.5 }}>One extra 5-hour shift at the student casual rate (~$25/hr) brings in $125 — more than enough.</p>
              <div style={{ padding: '8px 12px', background: C.successLight, borderRadius: 10 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: C.success, margin: 0 }}>✓ Projected result: +$125 income</p>
              </div>
            </div>
          </div>
          <button style={{ marginTop: 12, width: '100%', padding: 10, background: C.indigo, color: '#fff', fontWeight: 600, fontSize: 13, borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            Set a reminder to arrange a shift
          </button>
        </Card>

        {/* Option 3 */}
        <Card style={{ marginBottom: 16, border: `1px solid ${C.border}` }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>🐷</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 4px' }}>Move $86 from emergency buffer</p>
              <p style={{ fontSize: 13, color: C.muted, margin: '0 0 10px', lineHeight: 1.5 }}>Your buffer has $180. Moving $86 covers rent but leaves $94 — only 19% of your goal.</p>
              <div style={{ padding: '8px 12px', background: C.redLight, borderRadius: 10 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: C.red, margin: 0 }}>⚠ Buffer would drop to $94 (last resort)</p>
              </div>
            </div>
          </div>
          <button style={{ marginTop: 12, width: '100%', padding: 10, background: '#F1F5F9', color: C.textMid, fontWeight: 600, fontSize: 13, borderRadius: 10, border: `1px solid ${C.border}`, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
            Use emergency buffer
          </button>
        </Card>
      </div>
    </div>
  )
}

// ── Save sub-screens ──────────────────────────────────────────────

function GroceryCompare() {
  const stores  = ['Coles', 'Woolies', 'Aldi']
  const colors  = [C.red, '#047857', C.primary]
  const getBest = (item: typeof GROCERY[0]) => Math.min(item.coles, item.woolies, item.aldi)
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        {stores.map((s, i) => (
          <div key={s} style={{ flex: 1, padding: '8px 4px', borderRadius: 12, background: colors[i] + '14', textAlign: 'center', border: `1px solid ${colors[i]}22` }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: colors[i], margin: 0 }}>{s}</p>
          </div>
        ))}
      </div>
      <Card>
        {GROCERY.map((item, idx) => {
          const best = getBest(item)
          const vals = [item.coles, item.woolies, item.aldi]
          return (
            <div key={item.name} style={{ paddingTop: idx > 0 ? 10 : 0, paddingBottom: idx < GROCERY.length - 1 ? 10 : 0, borderBottom: idx < GROCERY.length - 1 ? `1px solid ${C.border}` : 'none' }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: '0 0 7px' }}>{item.name}</p>
              <div style={{ display: 'flex', gap: 8 }}>
                {vals.map((v, i) => (
                  <div key={stores[i]} style={{ flex: 1, padding: '6px 4px', borderRadius: 8, background: v === best ? colors[i] + '18' : '#F8FAFC', border: v === best ? `1.5px solid ${colors[i]}40` : `1px solid ${C.border}`, textAlign: 'center' }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: v === best ? colors[i] : C.textMid, margin: 0 }}>${v.toFixed(2)}</p>
                    {v === best && <p style={{ fontSize: 8, fontWeight: 700, color: colors[i], margin: '1px 0 0', letterSpacing: 0.3 }}>BEST</p>}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </Card>
      <div style={{ marginTop: 12, padding: '12px 14px', borderRadius: 14, background: C.successLight }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: C.success, margin: '0 0 4px' }}>💡 Potential weekly saving</p>
        <p style={{ fontSize: 13, color: C.success, margin: 0 }}>Switching to Aldi for this list saves ~<strong>$8.20/week</strong> or ~<strong>$426/year</strong></p>
      </div>
    </div>
  )
}

function DiscountsList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {DISCOUNTS.map(d => (
        <Card key={d.name}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: d.color + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{d.emoji}</div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 3px' }}>{d.name}</p>
                  <span style={{ fontSize: 10, color: d.color, fontWeight: 600, background: d.color + '18', padding: '2px 7px', borderRadius: 5 }}>{d.cat}</span>
                </div>
                <button style={{ padding: '6px 10px', background: d.color, color: '#fff', borderRadius: 8, border: 'none', fontSize: 11, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif', flexShrink: 0, marginLeft: 8 }}>
                  Get deal
                </button>
              </div>
              <p style={{ fontSize: 12, color: C.textMid, margin: '6px 0 0' }}>{d.saving}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}

function ChallengesList() {
  return (
    <div>
      <Card style={{ marginBottom: 12, border: `1.5px solid ${C.primaryMid}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <div>
            <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 3px' }}>🎯 Emergency Buffer</p>
            <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>Target: $500 · Current: $180</p>
          </div>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <ProgressRing pct={36} size={52} stroke={6} color={C.primary} />
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: C.primary }}>36%</span>
            </div>
          </div>
        </div>
        <div style={{ height: 8, borderRadius: 4, background: C.border, overflow: 'hidden', marginBottom: 6 }}>
          <div style={{ height: '100%', width: '36%', background: C.primary, borderRadius: 4 }} />
        </div>
        <p style={{ fontSize: 12, color: C.muted, margin: '0 0 10px' }}>$320 to go · At $20/week you'll reach this in ~16 weeks</p>
        <button style={{ width: '100%', padding: 10, background: C.primary, color: '#fff', fontWeight: 600, fontSize: 13, borderRadius: 10, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          Add $20 this week
        </button>
      </Card>
      <h3 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 10px', letterSpacing: -0.3 }}>Savings challenges</h3>
      {CHALLENGES.map(ch => {
        const pct = ch.total > 0 ? (ch.progress / ch.total) * 100 : 0
        return (
          <Card key={ch.name} style={{ marginBottom: 10, border: ch.active ? `1.5px solid ${C.primaryMid}` : `1px solid ${C.border}` }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{ch.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>{ch.name}</p>
                  {ch.active && <span style={{ fontSize: 10, fontWeight: 600, color: C.primary, background: C.primaryLight, padding: '2px 7px', borderRadius: 5 }}>ACTIVE</span>}
                </div>
                <p style={{ fontSize: 12, color: C.muted, margin: '0 0 8px', lineHeight: 1.5 }}>{ch.desc}</p>
                <div style={{ height: 6, borderRadius: 3, background: C.border, overflow: 'hidden', marginBottom: 5 }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: ch.active ? C.primary : C.muted, borderRadius: 3 }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 11, color: C.muted }}>Day {ch.progress} of {ch.total}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: C.success }}>{ch.reward}</span>
                </div>
              </div>
            </div>
            {!ch.active && (
              <button style={{ marginTop: 10, width: '100%', padding: 8, background: '#F1F5F9', color: C.text, fontWeight: 600, fontSize: 12, borderRadius: 10, border: `1px solid ${C.border}`, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                Start this challenge
              </button>
            )}
          </Card>
        )
      })}
    </div>
  )
}

// ── Screen: Save ──────────────────────────────────────────────────

function SaveScreen({ nav: _nav, tab, setTab }: { nav: (s: Screen) => void; tab: SaveSubTab; setTab: (t: SaveSubTab) => void }) {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 20px 0', flexShrink: 0 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: 0, letterSpacing: -0.5 }}>Save Hub</h1>
        <p style={{ fontSize: 13, color: C.muted, margin: '4px 0 14px' }}>Tools to help you spend less</p>
        <div style={{ display: 'flex', gap: 0, background: '#E8EDF5', borderRadius: 12, padding: 3, marginBottom: 16 }}>
          {([['compare', '🛒 Compare'], ['discounts', '🎫 Discounts'], ['challenges', '🎯 Challenges']] as [SaveSubTab, string][]).map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ flex: 1, padding: '8px 4px', borderRadius: 10, background: tab === key ? C.white : 'transparent', color: tab === key ? C.text : C.muted, fontWeight: tab === key ? 600 : 500, fontSize: 12, border: 'none', cursor: 'pointer', boxShadow: tab === key ? shadow : 'none', fontFamily: 'Inter, sans-serif', transition: 'all 0.15s' }}>
              {label}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px' }} className="hide-scroll">
        {tab === 'compare'   && <GroceryCompare />}
        {tab === 'discounts' && <DiscountsList />}
        {tab === 'challenges'&& <ChallengesList />}
        <div style={{ height: 16 }} />
      </div>
    </div>
  )
}

// ── Screen: Assistant ─────────────────────────────────────────────

function AssistantScreen({ nav: _nav, msgs, setMsgs, input, setInput }: {
  nav: (s: Screen) => void
  msgs: ChatMsg[]
  setMsgs: React.Dispatch<React.SetStateAction<ChatMsg[]>>
  input: string
  setInput: (v: string) => void
}) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, typing])

  const send = (text: string) => {
    if (!text.trim()) return
    setMsgs(prev => [...prev, { role: 'user', text: text.trim() }])
    setInput('')
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const lower = text.toLowerCase()
      let reply = ''
      if (lower.includes('concert') || lower.includes('afford') || lower.includes('ticket') || lower.includes('60')) {
        reply = "Based on your current budget, you have $142.50 left this week. A $60 ticket is possible, but it would leave you with just $82.50 — which is tight.\n\nA few things to consider:\n• Your eating out budget is already $2.10 over this week\n• Your weekly budget resets on 28/09, so waiting a day could help\n• Check if your student union has discounted tickets — you might save 20–30%\n\nWould you like me to look for student discounts for this event?"
      } else if (lower.includes('grocer') || lower.includes('food') || lower.includes('shop')) {
        reply = "Great question! Here are quick wins based on your recent spending:\n\n🛒 You've spent $61.40 on groceries this week (budget: $100) — you're on track.\n\nTop tips:\n• Aldi is 20–40% cheaper than Coles/Woolworths on staples\n• Wednesdays have reduced-price items at most supermarkets\n• Buying rice, pasta and canned goods in bulk saves ~$8/week\n\nShall I show you a price comparison for your usual items?"
      } else if (lower.includes('balance') || lower.includes('semester') || lower.includes('lowest')) {
        reply = "Your balance is projected to be lowest at Week 12 ($60), but Week 9 is your riskiest point:\n\n📊 Semester overview:\n• Week 4: Rent -$280 → $1,160\n• Week 8: Rent + fees → $434\n• Week 9: Risk point ($330)\n• Week 12: End of semester ($60)\n\nI'd recommend setting $20/week aside into your emergency buffer to give yourself more cushion. Want me to set a weekly reminder?"
      } else {
        reply = "I can help with that! 💡\n\nLooking at your finances this week:\n• You've used 55% of your weekly budget with 1 day remaining\n• Eating out is $2.10 over your budget\n• Your biggest upcoming expense is rent on 14/10/2026\n\nWhat would you like to explore? I can help with budgeting, saving tips, forecasting, or finding student deals."
      }
      setMsgs(prev => [...prev, { role: 'assistant', text: reply }])
    }, 1200)
  }

  const PROMPTS = ["Can I afford a $60 concert ticket?", "How do I save on groceries?", "When is my balance lowest this semester?"]

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 20px 12px', flexShrink: 0, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 20, background: `linear-gradient(135deg, ${C.primary}, ${C.indigo})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>🤖</div>
          <div>
            <p style={{ fontSize: 15, fontWeight: 700, color: C.text, margin: 0 }}>SpendSavers AI</p>
            <p style={{ fontSize: 12, color: C.success, margin: 0, fontWeight: 500 }}>● Online · Budget-aware</p>
          </div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 10 }} className="hide-scroll">
        {msgs.length === 1 && (
          <div style={{ marginBottom: 4 }}>
            <p style={{ fontSize: 12, color: C.muted, marginBottom: 8, fontWeight: 500 }}>Suggested questions</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {PROMPTS.map(p => (
                <button key={p} onClick={() => send(p)}
                  style={{ padding: '10px 14px', borderRadius: 12, background: C.primaryLight, border: `1px solid ${C.primaryMid}`, color: C.primary, fontSize: 13, fontWeight: 500, textAlign: 'left', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
            {m.role === 'assistant' && (
              <div style={{ width: 26, height: 26, borderRadius: 13, background: `linear-gradient(135deg, ${C.primary}, ${C.indigo})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13 }}>🤖</div>
            )}
            <div style={{
              maxWidth: '78%', padding: '10px 13px',
              borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: m.role === 'user' ? C.primary : C.white,
              color: m.role === 'user' ? '#fff' : C.text,
              boxShadow: shadow, fontSize: 13, lineHeight: 1.55, whiteSpace: 'pre-line',
            }}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ width: 26, height: 26, borderRadius: 13, background: `linear-gradient(135deg, ${C.primary}, ${C.indigo})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13 }}>🤖</div>
            <div style={{ padding: '10px 14px', borderRadius: '16px 16px 16px 4px', background: C.white, boxShadow: shadow, display: 'flex', gap: 4, alignItems: 'center' }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: C.muted, animation: `bounce-dot 1.2s ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: '10px 14px 14px', flexShrink: 0, borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
            placeholder="Ask anything about your budget..."
            style={{ flex: 1, padding: '11px 14px', borderRadius: 24, border: `1.5px solid ${C.border}`, fontSize: 14, fontFamily: 'Inter, sans-serif', outline: 'none', color: C.text, background: '#fff' }}
          />
          <button onClick={() => send(input)}
            style={{ width: 42, height: 42, borderRadius: 21, background: C.primary, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Screen: Profile ───────────────────────────────────────────────

function ProfileScreen({ nav }: { nav: (s: Screen) => void }) {
  const [notifs, setNotifs] = useState({ weekly: true, alerts: true, tips: false })
  const toggle = (k: keyof typeof notifs) => setNotifs(n => ({ ...n, [k]: !n[k] }))
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 20px 0', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12 }}>
        <BackBtn onBack={() => nav('home')} />
        <h1 style={{ fontSize: 22, fontWeight: 800, color: C.text, margin: 0, letterSpacing: -0.5 }}>Profile</h1>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px' }} className="hide-scroll">
        <Card style={{ marginBottom: 14, textAlign: 'center' }}>
          <div style={{ width: 72, height: 72, borderRadius: 36, background: `linear-gradient(135deg, ${C.primary}, ${C.indigo})`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 30, fontWeight: 800, color: '#fff' }}>A</div>
          <p style={{ fontSize: 18, fontWeight: 800, color: C.text, margin: '0 0 3px' }}>Aarav Sharma</p>
          <p style={{ fontSize: 13, color: C.muted, margin: '0 0 10px' }}>aarav.sharma@student.unsw.edu.au</p>
          <span style={{ fontSize: 11, fontWeight: 600, color: C.indigo, background: C.indigoLight, padding: '3px 10px', borderRadius: 6 }}>🎓 International Student</span>
        </Card>
        <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 8px' }}>Account details</p>
        <Card style={{ marginBottom: 14 }}>
          {([['🏫', 'University', 'UNSW Sydney'], ['📚', 'Student type', 'International'], ['💰', 'Income source', 'Family transfers'], ['🌏', 'Currency', 'AUD ($)']] as [string,string,string][]).map(([e, k, v], idx) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 12, paddingTop: idx > 0 ? 12 : 0, paddingBottom: idx < 3 ? 12 : 0, borderBottom: idx < 3 ? `1px solid ${C.border}` : 'none' }}>
              <span style={{ fontSize: 17, width: 24, textAlign: 'center' }}>{e}</span>
              <span style={{ flex: 1, fontSize: 14, color: C.textMid }}>{k}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{v}</span>
            </div>
          ))}
        </Card>
        <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 8px' }}>Connected bank</p>
        <Card style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#007DBA', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#fff' }}>ANZ</span>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: C.text, margin: 0 }}>ANZ Everyday Account</p>
              <p style={{ fontSize: 12, color: C.success, margin: '3px 0 0', fontWeight: 500 }}>● Connected · Read-only</p>
            </div>
            <button style={{ padding: '6px 12px', background: C.redLight, color: C.red, borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
              Remove
            </button>
          </div>
        </Card>
        <p style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.8, margin: '0 0 8px' }}>Notifications</p>
        <Card style={{ marginBottom: 14 }}>
          {([['Weekly spending summary', 'weekly'], ['Balance shortage alerts', 'alerts'], ['Saving tips & challenges', 'tips']] as [string, keyof typeof notifs][]).map(([label, key], idx) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', paddingTop: idx > 0 ? 12 : 0, paddingBottom: idx < 2 ? 12 : 0, borderBottom: idx < 2 ? `1px solid ${C.border}` : 'none' }}>
              <span style={{ flex: 1, fontSize: 14, color: C.text }}>{label}</span>
              <button onClick={() => toggle(key)}
                style={{ width: 48, height: 28, borderRadius: 14, background: notifs[key] ? C.primary : C.border, border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
                <div style={{ width: 22, height: 22, borderRadius: 11, background: '#fff', position: 'absolute', top: 3, left: notifs[key] ? 23 : 3, transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
              </button>
            </div>
          ))}
        </Card>
        <button onClick={() => nav('landing')}
          style={{ width: '100%', padding: 16, background: C.redLight, color: C.red, fontWeight: 700, fontSize: 15, borderRadius: 16, border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
          Log out
        </button>
        <div style={{ height: 16 }} />
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────

export default function App() {
  const [screen,        setScreen]       = useState<Screen>('landing')
  const [onboardStep,   setOnboardStep]  = useState(0)
  const [selectedBank,  setSelectedBank] = useState('ANZ')
  const [saveTab,       setSaveTab]      = useState<SaveSubTab>('compare')
  const [msgs,          setMsgs]         = useState<ChatMsg[]>([
    { role: 'assistant', text: "Hi Aarav! 👋 I'm your SpendSavers AI. I can help you budget smarter, find savings, and plan ahead. What would you like to know?" }
  ])
  const [chatInput, setChatInput] = useState('')

  const nav = (s: Screen) => setScreen(s)

  const MAIN_SCREENS: Screen[] = ['home', 'budget', 'forecast', 'save', 'assistant']
  const showNav     = MAIN_SCREENS.includes(screen)

  const LIGHT_SCREENS: Screen[] = ['landing', 'onboarding', 'bank-connected']
  const lightStatus = LIGHT_SCREENS.includes(screen)

  const containerBg =
    screen === 'landing'       ? C.primary :
    screen === 'bank-connected'? C.success  :
    screen === 'onboarding'    ? ONBOARDING[onboardStep].solidBg :
    C.bg

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(145deg, #0F172A 0%, #1A2D40 50%, #0D3347 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      {/* iPhone 14 frame */}
      <div style={{ position: 'relative', width: 390, height: 844, flexShrink: 0 }}>
        {/* Outer body */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: 54, background: '#1E1E20', boxShadow: '0 0 0 1.5px #3A3A3C, 0 60px 120px rgba(0,0,0,0.8), 0 30px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)' }} />
        {/* Side buttons (decorative) */}
        <div style={{ position: 'absolute', left: -3, top: 148, width: 3, height: 30, background: '#2C2C2E', borderRadius: '2px 0 0 2px' }} />
        <div style={{ position: 'absolute', left: -3, top: 196, width: 3, height: 62, background: '#2C2C2E', borderRadius: '2px 0 0 2px' }} />
        <div style={{ position: 'absolute', left: -3, top: 276, width: 3, height: 62, background: '#2C2C2E', borderRadius: '2px 0 0 2px' }} />
        <div style={{ position: 'absolute', right: -3, top: 214, width: 3, height: 84, background: '#2C2C2E', borderRadius: '0 2px 2px 0' }} />

        {/* Inner screen */}
        <div style={{ position: 'absolute', top: 6, left: 6, right: 6, bottom: 6, borderRadius: 48, overflow: 'hidden', background: containerBg, transition: 'background 0.25s' }}>

          {/* Status bar */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 40 }}>
            <StatusBar light={lightStatus} />
          </div>

          {/* Dynamic island */}
          <div style={{ position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)', width: 120, height: 34, background: '#000', borderRadius: 22, zIndex: 50 }} />

          {/* Content */}
          <div style={{ position: 'absolute', top: 50, left: 0, right: 0, bottom: showNav ? 82 : 0, overflow: 'hidden' }}>
            {screen === 'landing'       && <LandingScreen nav={nav} />}
            {screen === 'onboarding'    && <OnboardingScreen nav={nav} step={onboardStep} setStep={setOnboardStep} />}
            {screen === 'signup'        && <SignUpScreen nav={nav} />}
            {screen === 'connect-bank'  && <ConnectBankScreen nav={nav} setBank={setSelectedBank} />}
            {screen === 'bank-consent'  && <BankConsentScreen nav={nav} bank={selectedBank} />}
            {screen === 'bank-connected'&& <BankConnectedScreen nav={nav} />}
            {screen === 'home'          && <HomeScreen nav={nav} />}
            {screen === 'budget'        && <BudgetScreen nav={nav} />}
            {screen === 'forecast'      && <ForecastScreen nav={nav} />}
            {screen === 'shortfall'     && <ShortfallScreen nav={nav} />}
            {screen === 'save'          && <SaveScreen nav={nav} tab={saveTab} setTab={setSaveTab} />}
            {screen === 'assistant'     && <AssistantScreen nav={nav} msgs={msgs} setMsgs={setMsgs} input={chatInput} setInput={setChatInput} />}
            {screen === 'profile'       && <ProfileScreen nav={nav} />}
          </div>

          {/* Bottom nav */}
          {showNav && (
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
              <BottomNav active={screen} onNav={nav} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
