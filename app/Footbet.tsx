"use client"

import type React from "react"


import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  Search,
  Bell,
  Settings,
  X,
  Check,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Filter,
  Star,
  Menu,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Mail,
} from "lucide-react"

// Types
interface Team {
  id: string
  name: string
  shortName: string
  logo: string
  primaryColor: string
  secondaryColor: string
}

interface Match {
  id: string
  homeTeam: Team
  awayTeam: Team
  startTime: Date
  league: string
  isFeatured: boolean
  status: "upcoming" | "live" | "finished"
  score?: {
    home: number
    away: number
  }
  stats: {
    possession: {
      home: number
      away: number
    }
    shotsOnTarget: {
      home: number
      away: number
    }
    corners: {
      home: number
      away: number
    }
    fouls: {
      home: number
      away: number
    }
  }
  currentMinute?: number
}


interface Odds {
  matchId: string
  homeWin: number
  draw: number
  awayWin: number
  history: {
    timestamp: Date
    homeWin: number
    draw: number
    awayWin: number
  }[]
  movement: "up" | "down" | "stable"
  bettingFlow: {
    home: number
    draw: number
    away: number
  }
}

interface Alert {
  id: string
  matchId: string
  type: "value" | "movement" | "opportunity" | "warning"
  message: string
  timestamp: Date
  isRead: boolean
  actionable: boolean
}

interface User {
  id: string
  name: string
  avatar: string
  preferences: {
    notifications: {
      valueAlerts: boolean
      movementAlerts: boolean
      opportunityAlerts: boolean
      warningAlerts: boolean
    }
    favoriteTeams: string[]
  }
}

// Mock Data Generator
const generateMockData = () => {
  // Teams
  const teams: Team[] = [
    {
      id: "t1",
      name: "Manchester United",
      shortName: "MUN",
      logo: "/placeholder.svg?height=40&width=40",
      primaryColor: "#DA291C",
      secondaryColor: "#FBE122",
    },
    {
      id: "t2",
      name: "Liverpool",
      shortName: "LIV",
      logo: "/placeholder.svg?height=40&width=40",
      primaryColor: "#C8102E",
      secondaryColor: "#00B2A9",
    },
    {
      id: "t3",
      name: "Arsenal",
      shortName: "ARS",
      logo: "/placeholder.svg?height=40&width=40",
      primaryColor: "#EF0107",
      secondaryColor: "#063672",
    },
    {
      id: "t4",
      name: "Chelsea",
      shortName: "CHE",
      logo: "/placeholder.svg?height=40&width=40",
      primaryColor: "#034694",
      secondaryColor: "#EE242C",
    },
    {
      id: "t5",
      name: "Manchester City",
      shortName: "MCI",
      logo: "/placeholder.svg?height=40&width=40",
      primaryColor: "#6CABDD",
      secondaryColor: "#1C2C5B",
    },
    {
      id: "t6",
      name: "Tottenham Hotspur",
      shortName: "TOT",
      logo: "/placeholder.svg?height=40&width=40",
      primaryColor: "#132257",
      secondaryColor: "#FFFFFF",
    },
    {
      id: "t7",
      name: "Real Madrid",
      shortName: "RMA",
      logo: "/placeholder.svg?height=40&width=40",
      primaryColor: "#FFFFFF",
      secondaryColor: "#00529F",
    },
    {
      id: "t8",
      name: "Barcelona",
      shortName: "BAR",
      logo: "/placeholder.svg?height=40&width=40",
      primaryColor: "#A50044",
      secondaryColor: "#004D98",
    },
    {
      id: "t9",
      name: "Bayern Munich",
      shortName: "BAY",
      logo: "/placeholder.svg?height=40&width=40",
      primaryColor: "#DC052D",
      secondaryColor: "#0066B2",
    },
    {
      id: "t10",
      name: "Paris Saint-Germain",
      shortName: "PSG",
      logo: "/placeholder.svg?height=40&width=40",
      primaryColor: "#004170",
      secondaryColor: "#DA291C",
    },
  ]

  // Matches
  const now = new Date()
  const matches: Match[] = [
    {
      id: "m1",
      homeTeam: teams[0],
      awayTeam: teams[1],
      startTime: new Date(now.getTime() - 45 * 60000),
      league: "Premier League",
      isFeatured: true,
      status: "live",
      score: {
        home: 1,
        away: 2,
      },
      currentMinute: 67,
      stats: {
        possession: {
          home: 42,
          away: 58,
        },
        shotsOnTarget: {
          home: 3,
          away: 7,
        },
        corners: {
          home: 4,
          away: 6,
        },
        fouls: {
          home: 8,
          away: 5,
        },
      },
    },
    {
      id: "m2",
      homeTeam: teams[2],
      awayTeam: teams[3],
      startTime: new Date(now.getTime() - 30 * 60000),
      league: "Premier League",
      isFeatured: true,
      status: "live",
      score: {
        home: 0,
        away: 0,
      },
      currentMinute: 32,
      stats: {
        possession: {
          home: 55,
          away: 45,
        },
        shotsOnTarget: {
          home: 2,
          away: 1,
        },
        corners: {
          home: 3,
          away: 2,
        },
        fouls: {
          home: 4,
          away: 7,
        },
      },
    },
    {
      id: "m3",
      homeTeam: teams[4],
      awayTeam: teams[5],
      startTime: new Date(now.getTime() + 60 * 60000),
      league: "Premier League",
      isFeatured: true,
      status: "upcoming",
      stats: {
        possession: {
          home: 0,
          away: 0,
        },
        shotsOnTarget: {
          home: 0,
          away: 0,
        },
        corners: {
          home: 0,
          away: 0,
        },
        fouls: {
          home: 0,
          away: 0,
        },
      },
    },
    {
      id: "m4",
      homeTeam: teams[6],
      awayTeam: teams[7],
      startTime: new Date(now.getTime() + 120 * 60000),
      league: "La Liga",
      isFeatured: false,
      status: "upcoming",
      stats: {
        possession: {
          home: 0,
          away: 0,
        },
        shotsOnTarget: {
          home: 0,
          away: 0,
        },
        corners: {
          home: 0,
          away: 0,
        },
        fouls: {
          home: 0,
          away: 0,
        },
      },
    },
    {
      id: "m5",
      homeTeam: teams[8],
      awayTeam: teams[9],
      startTime: new Date(now.getTime() - 15 * 60000),
      league: "Champions League",
      isFeatured: true,
      status: "live",
      score: {
        home: 3,
        away: 1,
      },
      currentMinute: 18,
      stats: {
        possession: {
          home: 62,
          away: 38,
        },
        shotsOnTarget: {
          home: 5,
          away: 2,
        },
        corners: {
          home: 2,
          away: 1,
        },
        fouls: {
          home: 3,
          away: 6,
        },
      },
    },
    {
      id: "m6",
      homeTeam: teams[1],
      awayTeam: teams[3],
      startTime: new Date(now.getTime() + 180 * 60000),
      league: "Premier League",
      isFeatured: false,
      status: "upcoming",
      stats: {
        possession: {
          home: 0,
          away: 0,
        },
        shotsOnTarget: {
          home: 0,
          away: 0,
        },
        corners: {
          home: 0,
          away: 0,
        },
        fouls: {
          home: 0,
          away: 0,
        },
      },
    },
    {
      id: "m7",
      homeTeam: teams[5],
      awayTeam: teams[7],
      startTime: new Date(now.getTime() + 240 * 60000),
      league: "Champions League",
      isFeatured: false,
      status: "upcoming",
      stats: {
        possession: {
          home: 0,
          away: 0,
        },
        shotsOnTarget: {
          home: 0,
          away: 0,
        },
        corners: {
          home: 0,
          away: 0,
        },
        fouls: {
          home: 0,
          away: 0,
        },
      },
    },
  ]

  // Generate historical odds data
  const generateOddsHistory = (initialHome: number, initialDraw: number, initialAway: number) => {
    const history = []
    const now = new Date()

    for (let i = 0; i < 24; i++) {
      const timestamp = new Date(now.getTime() - (24 - i) * 30 * 60000)

      // Add some random fluctuation to odds
      const homeVariation = (Math.random() - 0.5) * 0.2
      const drawVariation = (Math.random() - 0.5) * 0.15
      const awayVariation = (Math.random() - 0.5) * 0.25

      const homeWin = Math.max(1.1, initialHome + homeVariation * i)
      const draw = Math.max(1.1, initialDraw + drawVariation * i)
      const awayWin = Math.max(1.1, initialAway + awayVariation * i)

      history.push({
        timestamp,
        homeWin: Number.parseFloat(homeWin.toFixed(2)),
        draw: Number.parseFloat(draw.toFixed(2)),
        awayWin: Number.parseFloat(awayWin.toFixed(2)),
      })
    }

    return history
  }

  // Odds
  const odds: Odds[] = matches.map((match) => {
    const baseHomeWin = match.homeTeam.id === "t5" || match.homeTeam.id === "t8" ? 1.8 : 2.2
    const baseDraw = 3.5
    const baseAwayWin = match.awayTeam.id === "t5" || match.awayTeam.id === "t8" ? 2.0 : 2.8

    const history = generateOddsHistory(baseHomeWin, baseDraw, baseAwayWin)
    const latestOdds = history[history.length - 1]

    // Determine movement based on last two entries
    const prevOdds = history[history.length - 2]
    let movement: "up" | "down" | "stable" = "stable"

    if (latestOdds.homeWin < prevOdds.homeWin) {
      movement = "down" // Odds decreasing means probability increasing
    } else if (latestOdds.homeWin > prevOdds.homeWin) {
      movement = "up"
    }

    return {
      matchId: match.id,
      homeWin: latestOdds.homeWin,
      draw: latestOdds.draw,
      awayWin: latestOdds.awayWin,
      history,
      movement,
      bettingFlow: {
        home: Math.floor(Math.random() * 70) + 10,
        draw: Math.floor(Math.random() * 30) + 5,
        away: Math.floor(Math.random() * 60) + 10,
      },
    }
  })

  // Alerts
  const alerts: Alert[] = [
    {
      id: "a1",
      matchId: "m1",
      type: "value",
      message: "Value opportunity: Liverpool odds drifting despite strong performance",
      timestamp: new Date(),
      isRead: false,
      actionable: true,
    },
    {
      id: "a2",
      matchId: "m2",
      type: "movement",
      message: "Significant odds movement for Arsenal in the last 10 minutes",
      timestamp: new Date(now.getTime() - 10 * 60000),
      isRead: false,
      actionable: true,
    },
    {
      id: "a3",
      matchId: "m5",
      type: "opportunity",
      message: "Bayern Munich scoring probability increased by 35% after recent goal",
      timestamp: new Date(now.getTime() - 5 * 60000),
      isRead: false,
      actionable: true,
    },
    {
      id: "a4",
      matchId: "m3",
      type: "warning",
      message: "Unusual betting patterns detected in Man City vs Tottenham match",
      timestamp: new Date(now.getTime() - 30 * 60000),
      isRead: true,
      actionable: false,
    },
    {
      id: "a5",
      matchId: "m1",
      type: "movement",
      message: "Draw odds shortening rapidly in Man United vs Liverpool",
      timestamp: new Date(now.getTime() - 15 * 60000),
      isRead: false,
      actionable: true,
    },
  ]

  // User
  const user: User = {
    id: "u1",
    name: "Alex Thompson",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    preferences: {
      notifications: {
        valueAlerts: true,
        movementAlerts: true,
        opportunityAlerts: true,
        warningAlerts: true,
      },
      favoriteTeams: ["t1", "t5", "t8"],
    },
  }

  return { matches, odds, alerts, user }
}

export default function Footbet() {
  // State
  const [data, setData] = useState(() => generateMockData())
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedAlerts, setExpandedAlerts] = useState<string[]>([])
  const [notificationPreferences, setNotificationPreferences] = useState(data.user.preferences.notifications)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"matches" | "alerts">("matches")
  const [isNewsletterSubmitted, setIsNewsletterSubmitted] = useState(false)
  const [emailInput, setEmailInput] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    leagues: ["Premier League", "La Liga", "Champions League"],
    status: ["live", "upcoming"],
  })

  // Refs
  const settingsRef = useRef<HTMLDivElement>(null)

  // Effects
  useEffect(() => {
    // Auto-select the first featured match if none selected
    if (!selectedMatch && data.matches.length > 0) {
      const featuredMatches = data.matches.filter((m) => m.isFeatured)
      if (featuredMatches.length > 0) {
        setSelectedMatch(featuredMatches[0].id)
      } else {
        setSelectedMatch(data.matches[0].id)
      }
    }

    // Simulate real-time updates
    const interval = setInterval(() => {
      setData((prevData) => {
        // Update live match times
        const updatedMatches = prevData.matches.map((match) => {
          if (match.status === "live" && match.currentMinute !== undefined) {
            return {
              ...match,
              currentMinute: Math.min(90, match.currentMinute + 1),
            }
          }
          return match
        })

        // Update odds with small random fluctuations
        const updatedOdds = prevData.odds.map((odd) => {
          // Only update odds for live matches
          const match = updatedMatches.find((m) => m.id === odd.matchId)
          if (match?.status !== "live") return odd

          const homeVariation = (Math.random() - 0.5) * 0.05
          const drawVariation = (Math.random() - 0.5) * 0.04
          const awayVariation = (Math.random() - 0.5) * 0.06

          const newHomeWin = Math.max(1.1, odd.homeWin + homeVariation)
          const newDraw = Math.max(1.1, odd.draw + drawVariation)
          const newAwayWin = Math.max(1.1, odd.awayWin + awayVariation)

          // Determine movement
          let movement: "up" | "down" | "stable" = "stable"
          if (homeVariation < -0.01) movement = "down"
          else if (homeVariation > 0.01) movement = "up"

          // Update history
          const newHistory = [...odd.history]
          if (newHistory.length > 30) newHistory.shift()

          newHistory.push({
            timestamp: new Date(),
            homeWin: Number.parseFloat(newHomeWin.toFixed(2)),
            draw: Number.parseFloat(newDraw.toFixed(2)),
            awayWin: Number.parseFloat(newAwayWin.toFixed(2)),
          })

          // Update betting flow with small random changes
          const homeFlowChange = Math.floor(Math.random() * 5) - 2
          const drawFlowChange = Math.floor(Math.random() * 3) - 1
          const awayFlowChange = Math.floor(Math.random() * 5) - 2

          return {
            ...odd,
            homeWin: Number.parseFloat(newHomeWin.toFixed(2)),
            draw: Number.parseFloat(newDraw.toFixed(2)),
            awayWin: Number.parseFloat(newAwayWin.toFixed(2)),
            history: newHistory,
            movement,
            bettingFlow: {
              home: Math.max(0, odd.bettingFlow.home + homeFlowChange),
              draw: Math.max(0, odd.bettingFlow.draw + drawFlowChange),
              away: Math.max(0, odd.bettingFlow.away + awayFlowChange),
            },
          }
        })

        return {
          ...prevData,
          matches: updatedMatches,
          odds: updatedOdds,
        }
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [selectedMatch, data.matches])

  // Click outside handler for settings modal
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Handlers
  const handleMatchSelect = (matchId: string) => {
    setSelectedMatch(matchId)
    setIsMobileMenuOpen(false)
  }

  const toggleAlert = (alertId: string) => {
    setExpandedAlerts((prev) => (prev.includes(alertId) ? prev.filter((id) => id !== alertId) : [...prev, alertId]))
  }

  const markAlertAsRead = (alertId: string) => {
    setData((prev) => ({
      ...prev,
      alerts: prev.alerts.map((alert) => (alert.id === alertId ? { ...alert, isRead: true } : alert)),
    }))
  }

  const dismissAlert = (alertId: string) => {
    setData((prev) => ({
      ...prev,
      alerts: prev.alerts.filter((alert) => alert.id !== alertId),
    }))
  }

  const toggleFavoriteTeam = (teamId: string) => {
    setData((prev) => {
      const favoriteTeams = prev.user.preferences.favoriteTeams
      const updatedFavorites = favoriteTeams.includes(teamId)
        ? favoriteTeams.filter((id) => id !== teamId)
        : [...favoriteTeams, teamId]

      return {
        ...prev,
        user: {
          ...prev.user,
          preferences: {
            ...prev.user.preferences,
            favoriteTeams: updatedFavorites,
          },
        },
      }
    })
  }

  const handleFilterChange = (type: "leagues" | "status", value: string) => {
    setFilters((prev) => {
      const currentValues = prev[type]
      return {
        ...prev,
        [type]: currentValues.includes(value) ? currentValues.filter((v) => v !== value) : [...currentValues, value],
      }
    })
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (emailInput.trim()) {
      setIsNewsletterSubmitted(true)
      setEmailInput("")
      // In a real app, you would send this to your API
    }
  }

  // Filtered matches
  const filteredMatches = data.matches.filter((match) => {
    // Apply search filter
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch =
      match.homeTeam.name.toLowerCase().includes(searchLower) ||
      match.awayTeam.name.toLowerCase().includes(searchLower) ||
      match.league.toLowerCase().includes(searchLower)

    // Apply category filters
    const matchesLeague = filters.leagues.includes(match.league)
    const matchesStatus = filters.status.includes(match.status)

    return matchesSearch && matchesLeague && matchesStatus
  })

  // Get current match and odds
  const currentMatch = data.matches.find((m) => m.id === selectedMatch) || null
  const currentOdds = currentMatch ? data.odds.find((o) => o.matchId === currentMatch.id) : null

  // Format time
  const formatMatchTime = (match: Match) => {
    if (match.status === "live" && match.currentMinute !== undefined) {
      return `${match.currentMinute}'`
    }

    const now = new Date()
    const matchTime = match.startTime

    if (matchTime.getDate() === now.getDate()) {
      return matchTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    return matchTime.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  // Get alert icon based on type
  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "value":
        return <TrendingUp className="text-green-500" />
      case "movement":
        return <TrendingDown className="text-blue-500" />
      case "opportunity":
        return <Star className="text-amber-500" />
      case "warning":
        return <AlertTriangle className="text-red-500" />
    }
  }

  // Get alert color based on type
  const getAlertColor = (type: Alert["type"]) => {
    switch (type) {
      case "value":
        return "bg-green-50 border-green-200"
      case "movement":
        return "bg-blue-50 border-blue-200"
      case "opportunity":
        return "bg-amber-50 border-amber-200"
      case "warning":
        return "bg-red-50 border-red-200"
    }
  }

  // Get betting status color
  const getBettingStatusColor = (odds: Odds) => {
    const homeRatio = odds.bettingFlow.home / (odds.bettingFlow.home + odds.bettingFlow.draw + odds.bettingFlow.away)
    const awayRatio = odds.bettingFlow.away / (odds.bettingFlow.home + odds.bettingFlow.draw + odds.bettingFlow.away)

    if (homeRatio > 0.6) return "bg-green-500"
    if (awayRatio > 0.6) return "bg-red-500"
    if (Math.abs(homeRatio - awayRatio) < 0.1) return "bg-amber-500"
    return "bg-blue-500"
  }

  // Format odds movement
  const formatOddsMovement = (odds: Odds) => {
    if (odds.movement === "down") {
      return (
        <span className="text-green-600 flex items-center">
          <ArrowDownRight className="w-4 h-4 mr-1" /> Shortening
        </span>
      )
    }
    if (odds.movement === "up") {
      return (
        <span className="text-red-600 flex items-center">
          <ArrowUpRight className="w-4 h-4 mr-1" /> Lengthening
        </span>
      )
    }
    return (
      <span className="text-gray-600 flex items-center">
        <ArrowRight className="w-4 h-4 mr-1" /> Stable
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                className="md:hidden p-2 rounded-md hover:bg-blue-700"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-2xl font-bold tracking-tight">
                Foot<span className="text-green-400"> Bet</span>
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search matches..."
                  className="pl-10 pr-4 py-2 rounded-full bg-blue-700/50 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button className="p-2 rounded-full hover:bg-blue-700 relative" onClick={() => setActiveTab("alerts")}>
                <Bell className="w-5 h-5" />
                {data.alerts.some((a) => !a.isRead) && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              <button className="p-2 rounded-full hover:bg-blue-700" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
                <Settings className="w-5 h-5" />
              </button>

              <div className="flex items-center space-x-2">
                <img
                  src={data.user.avatar || "/placeholder.svg"}
                  alt={data.user.name}
                  className="w-8 h-8 rounded-full border-2 border-blue-400"
                />
                <span className="font-medium hidden lg:inline">{data.user.name}</span>
              </div>
            </div>

            <div className="flex md:hidden items-center space-x-3">
              <button className="p-2 rounded-full hover:bg-blue-700 relative" onClick={() => setActiveTab("alerts")}>
                <Bell className="w-5 h-5" />
                {data.alerts.some((a) => !a.isRead) && (
                  <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              <button className="p-2 rounded-full hover:bg-blue-700" onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              className="absolute top-0 left-0 w-3/4 h-full bg-white shadow-lg overflow-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">Matches</h2>
                  <button onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mt-3 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search matches..."
                    className="pl-10 pr-4 py-2 rounded-full bg-gray-100 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium">Live Matches</h3>
                  <button
                    className="text-sm text-blue-600 flex items-center"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                  >
                    <Filter className="w-4 h-4 mr-1" /> Filter
                  </button>
                </div>
                {filteredMatches
                  .filter((m) => m.status === "live")
                  .map((match) => (
                    <button
                      key={match.id}
                      className={`w-full text-left p-3 rounded-lg mb-2 ${
                        selectedMatch === match.id
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-white border border-gray-200"
                      }`}
                      onClick={() => handleMatchSelect(match.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 mr-2">
                            <img
                              src={match.homeTeam.logo || "/placeholder.svg"}
                              alt={match.homeTeam.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="font-medium">{match.homeTeam.shortName}</span>
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-bold text-red-600">{formatMatchTime(match)}</div>
                          {match.score && (
                            <div className="font-bold">
                              {match.score.home} - {match.score.away}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">{match.awayTeam.shortName}</span>
                          <div className="w-8 h-8 ml-2">
                            <img
                              src={match.awayTeam.logo || "/placeholder.svg"}
                              alt={match.awayTeam.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}

                <h3 className="font-medium mt-4 mb-3">Upcoming Matches</h3>
                {filteredMatches
                  .filter((m) => m.status === "upcoming")
                  .map((match) => (
                    <button
                      key={match.id}
                      className={`w-full text-left p-3 rounded-lg mb-2 ${
                        selectedMatch === match.id
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-white border border-gray-200"
                      }`}
                      onClick={() => handleMatchSelect(match.id)}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-8 h-8 mr-2">
                            <img
                              src={match.homeTeam.logo || "/placeholder.svg"}
                              alt={match.homeTeam.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <span className="font-medium">{match.homeTeam.shortName}</span>
                        </div>
                        <div className="text-center">
                          <div className="text-xs font-medium">{formatMatchTime(match)}</div>
                          <div className="text-xs text-gray-500">{match.league}</div>
                        </div>
                        <div className="flex items-center">
                          <span className="font-medium">{match.awayTeam.shortName}</span>
                          <div className="w-8 h-8 ml-2">
                            <img
                              src={match.awayTeam.logo || "/placeholder.svg"}
                              alt={match.awayTeam.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSettingsOpen(false)}
          >
            <motion.div
              ref={settingsRef}
              className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 bg-blue-800 text-white">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">Settings</h2>
                  <button onClick={() => setIsSettingsOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-5">
                <h3 className="font-bold text-lg mb-3">Notification Preferences</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <span className="mr-2">Value Alerts</span>
                      <span className="text-xs text-gray-500">(Good betting value opportunities)</span>
                    </label>
                    <button
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notificationPreferences.valueAlerts ? "bg-green-500" : "bg-gray-300"
                      } relative`}
                      onClick={() =>
                        setNotificationPreferences((prev) => ({
                          ...prev,
                          valueAlerts: !prev.valueAlerts,
                        }))
                      }
                    >
                      <span
                        className={`absolute top-1 ${
                          notificationPreferences.valueAlerts ? "right-1" : "left-1"
                        } w-4 h-4 rounded-full bg-white transition-all`}
                      ></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <span className="mr-2">Movement Alerts</span>
                      <span className="text-xs text-gray-500">(Significant odds changes)</span>
                    </label>
                    <button
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notificationPreferences.movementAlerts ? "bg-green-500" : "bg-gray-300"
                      } relative`}
                      onClick={() =>
                        setNotificationPreferences((prev) => ({
                          ...prev,
                          movementAlerts: !prev.movementAlerts,
                        }))
                      }
                    >
                      <span
                        className={`absolute top-1 ${
                          notificationPreferences.movementAlerts ? "right-1" : "left-1"
                        } w-4 h-4 rounded-full bg-white transition-all`}
                      ></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <span className="mr-2">Opportunity Alerts</span>
                      <span className="text-xs text-gray-500">(Time-sensitive betting opportunities)</span>
                    </label>
                    <button
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notificationPreferences.opportunityAlerts ? "bg-green-500" : "bg-gray-300"
                      } relative`}
                      onClick={() =>
                        setNotificationPreferences((prev) => ({
                          ...prev,
                          opportunityAlerts: !prev.opportunityAlerts,
                        }))
                      }
                    >
                      <span
                        className={`absolute top-1 ${
                          notificationPreferences.opportunityAlerts ? "right-1" : "left-1"
                        } w-4 h-4 rounded-full bg-white transition-all`}
                      ></span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center">
                      <span className="mr-2">Warning Alerts</span>
                      <span className="text-xs text-gray-500">(Unusual betting patterns)</span>
                    </label>
                    <button
                      className={`w-12 h-6 rounded-full transition-colors ${
                        notificationPreferences.warningAlerts ? "bg-green-500" : "bg-gray-300"
                      } relative`}
                      onClick={() =>
                        setNotificationPreferences((prev) => ({
                          ...prev,
                          warningAlerts: !prev.warningAlerts,
                        }))
                      }
                    >
                      <span
                        className={`absolute top-1 ${
                          notificationPreferences.warningAlerts ? "right-1" : "left-1"
                        } w-4 h-4 rounded-full bg-white transition-all`}
                      ></span>
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-lg mt-6 mb-3">Favorite Teams</h3>
                <div className="grid grid-cols-2 gap-2">
                  {data.matches
                    .flatMap((match) => [match.homeTeam, match.awayTeam])
                    .filter((team, index, self) => index === self.findIndex((t) => t.id === team.id))
                    .map((team) => (
                      <button
                        key={team.id}
                        className={`flex items-center p-2 rounded-lg border ${
                          data.user.preferences.favoriteTeams.includes(team.id)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200"
                        }`}
                        onClick={() => toggleFavoriteTeam(team.id)}
                      >
                        <img src={team.logo || "/placeholder.svg"} alt={team.name} className="w-6 h-6 mr-2" />
                        <span className="text-sm">{team.name}</span>
                        {data.user.preferences.favoriteTeams.includes(team.id) && (
                          <Check className="w-4 h-4 ml-auto text-blue-500" />
                        )}
                      </button>
                    ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    onClick={() => {
                      setData((prev) => ({
                        ...prev,
                        user: {
                          ...prev.user,
                          preferences: {
                            ...prev.user.preferences,
                            notifications: notificationPreferences,
                          },
                        },
                      }))
                      setIsSettingsOpen(false)
                    }}
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Modal */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsFilterOpen(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-4 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold">Filter Matches</h2>
                  <button onClick={() => setIsFilterOpen(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-medium mb-2">Leagues</h3>
                <div className="space-y-2 mb-4">
                  {["Premier League", "La Liga", "Champions League"].map((league) => (
                    <div key={league} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`league-${league}`}
                        checked={filters.leagues.includes(league)}
                        onChange={() => handleFilterChange("leagues", league)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <label htmlFor={`league-${league}`} className="ml-2">
                        {league}
                      </label>
                    </div>
                  ))}
                </div>

                <h3 className="font-medium mb-2">Match Status</h3>
                <div className="space-y-2">
                  {[
                    { value: "live", label: "Live Matches" },
                    { value: "upcoming", label: "Upcoming Matches" },
                  ].map((status) => (
                    <div key={status.value} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`status-${status.value}`}
                        checked={filters.status.includes(status.value)}
                        onChange={() => handleFilterChange("status", status.value)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <label htmlFor={`status-${status.value}`} className="ml-2">
                        {status.label}
                      </label>
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Mobile Tabs */}
        <div className="flex border-b mb-4 md:hidden">
          <button
            className={`flex-1 py-2 text-center font-medium ${
              activeTab === "matches" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("matches")}
          >
            Matches
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium relative ${
              activeTab === "alerts" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("alerts")}
          >
            Alerts
            {data.alerts.some((a) => !a.isRead) && (
              <span className="absolute top-2 right-1/4 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Match List (Desktop) */}
          <div
            className={`hidden md:block w-full md:w-64 lg:w-72 shrink-0 ${activeTab === "alerts" ? "md:hidden" : ""}`}
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-bold">Matches</h2>
                <button
                  className="text-sm text-blue-600 flex items-center"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                >
                  <Filter className="w-4 h-4 mr-1" /> Filter
                </button>
              </div>

              <div className="p-3">
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search matches..."
                    className="pl-10 pr-4 py-2 rounded-lg bg-gray-100 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                <h3 className="font-medium text-sm text-gray-500 mb-2">LIVE MATCHES</h3>
                <div className="space-y-2 mb-4">
                  {filteredMatches
                    .filter((m) => m.status === "live")
                    .map((match) => (
                      <button
                        key={match.id}
                        className={`w-full text-left p-2 rounded-lg ${
                          selectedMatch === match.id
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-gray-50 border border-transparent"
                        }`}
                        onClick={() => handleMatchSelect(match.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-6 h-6 mr-2">
                              <img
                                src={match.homeTeam.logo || "/placeholder.svg"}
                                alt={match.homeTeam.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <span className="font-medium text-sm">{match.homeTeam.shortName}</span>
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-bold text-red-600">{formatMatchTime(match)}</div>
                            {match.score && (
                              <div className="text-sm font-bold">
                                {match.score.home} - {match.score.away}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-sm">{match.awayTeam.shortName}</span>
                            <div className="w-6 h-6 ml-2">
                              <img
                                src={match.awayTeam.logo || "/placeholder.svg"}
                                alt={match.awayTeam.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>

                <h3 className="font-medium text-sm text-gray-500 mb-2">UPCOMING MATCHES</h3>
                <div className="space-y-2">
                  {filteredMatches
                    .filter((m) => m.status === "upcoming")
                    .map((match) => (
                      <button
                        key={match.id}
                        className={`w-full text-left p-2 rounded-lg ${
                          selectedMatch === match.id
                            ? "bg-blue-50 border border-blue-200"
                            : "hover:bg-gray-50 border border-transparent"
                        }`}
                        onClick={() => handleMatchSelect(match.id)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-6 h-6 mr-2">
                              <img
                                src={match.homeTeam.logo || "/placeholder.svg"}
                                alt={match.homeTeam.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <span className="font-medium text-sm">{match.homeTeam.shortName}</span>
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-medium">{formatMatchTime(match)}</div>
                            <div className="text-xs text-gray-500">{match.league}</div>
                          </div>
                          <div className="flex items-center">
                            <span className="font-medium text-sm">{match.awayTeam.shortName}</span>
                            <div className="w-6 h-6 ml-2">
                              <img
                                src={match.awayTeam.logo || "/placeholder.svg"}
                                alt={match.awayTeam.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className={`flex-1 ${activeTab === "alerts" ? "hidden md:block" : ""}`}>
            {/* Hero Section */}
            {currentMatch && currentOdds && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
                <div
                  className="bg-gradient-to-r from-blue-800 to-blue-900 p-4 text-white relative overflow-hidden"
                  style={{
                    backgroundImage: `linear-gradient(to right, ${currentMatch.homeTeam.primaryColor}80, ${currentMatch.awayTeam.primaryColor}80)`,
                  }}
                >
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <img
                          src={currentMatch.homeTeam.logo || "/placeholder.svg"}
                          alt={currentMatch.homeTeam.name}
                          className="w-12 h-12 object-contain bg-white p-1 rounded-full"
                        />
                        <div>
                          <h2 className="font-bold text-xl">{currentMatch.homeTeam.name}</h2>
                          <p className="text-blue-200">{currentMatch.league}</p>
                        </div>
                      </div>

                      <div className="text-center">
                        {currentMatch.status === "live" && (
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                            <span className="text-sm font-medium">LIVE</span>
                          </div>
                        )}
                        {currentMatch.score ? (
                          <div className="text-3xl font-bold">
                            {currentMatch.score.home} - {currentMatch.score.away}
                          </div>
                        ) : (
                          <div className="text-xl font-bold">{formatMatchTime(currentMatch)}</div>
                        )}
                        {currentMatch.currentMinute !== undefined && (
                          <div className="text-sm">{currentMatch.currentMinute}'</div>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <h2 className="font-bold text-xl">{currentMatch.awayTeam.name}</h2>
                          <p className="text-blue-200">{currentMatch.status}</p>
                        </div>
                        <img
                          src={currentMatch.awayTeam.logo || "/placeholder.svg"}
                          alt={currentMatch.awayTeam.name}
                          className="w-12 h-12 object-contain bg-white p-1 rounded-full"
                        />
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 gap-4">
                      <motion.div
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="text-sm text-blue-200">Home Win</div>
                        <motion.div
                          className="text-2xl font-bold"
                          key={currentOdds.homeWin}
                          initial={{ scale: 1.2, color: "#FFFFFF" }}
                          animate={{ scale: 1, color: "#FFFFFF" }}
                          transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        >
                          {currentOdds.homeWin.toFixed(2)}
                        </motion.div>
                        <div className="text-xs mt-1">{formatOddsMovement(currentOdds)}</div>
                      </motion.div>

                      <motion.div
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <div className="text-sm text-blue-200">Draw</div>
                        <motion.div
                          className="text-2xl font-bold"
                          key={currentOdds.draw}
                          initial={{ scale: 1.2, color: "#FFFFFF" }}
                          animate={{ scale: 1, color: "#FFFFFF" }}
                          transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        >
                          {currentOdds.draw.toFixed(2)}
                        </motion.div>
                        <div className="text-xs mt-1">
                          {currentOdds.bettingFlow.draw > 20 ? (
                            <span className="text-green-300 flex items-center justify-center">
                              <TrendingUp className="w-3 h-3 mr-1" /> Popular
                            </span>
                          ) : (
                            <span className="text-gray-300 flex items-center justify-center">
                              <ArrowRight className="w-3 h-3 mr-1" /> Stable
                            </span>
                          )}
                        </div>
                      </motion.div>

                      <motion.div
                        className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <div className="text-sm text-blue-200">Away Win</div>
                        <motion.div
                          className="text-2xl font-bold"
                          key={currentOdds.awayWin}
                          initial={{ scale: 1.2, color: "#FFFFFF" }}
                          animate={{ scale: 1, color: "#FFFFFF" }}
                          transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        >
                          {currentOdds.awayWin.toFixed(2)}
                        </motion.div>
                        <div className="text-xs mt-1">
                          {currentOdds.bettingFlow.away > currentOdds.bettingFlow.home ? (
                            <span className="text-green-300 flex items-center justify-center">
                              <TrendingUp className="w-3 h-3 mr-1" /> Popular
                            </span>
                          ) : (
                            <span className="text-gray-300 flex items-center justify-center">
                              <ArrowRight className="w-3 h-3 mr-1" /> Stable
                            </span>
                          )}
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-bold text-lg mb-3">Odds Movement</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={currentOdds.history.slice(-12)}
                        margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis
                          dataKey="timestamp"
                          tickFormatter={(time) =>
                            new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          }
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis domain={["auto", "auto"]} tick={{ fontSize: 12 }} />
                        <Tooltip
                          formatter={(value) => [Number(value).toFixed(2), "Odds"]}
                          labelFormatter={(label) =>
                            new Date(label).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                          }
                        />
                        <Line
                          type="monotone"
                          dataKey="homeWin"
                          stroke={currentMatch.homeTeam.primaryColor}
                          name={`${currentMatch.homeTeam.name} Win`}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="draw"
                          stroke="#888888"
                          name="Draw"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="awayWin"
                          stroke={currentMatch.awayTeam.primaryColor}
                          name={`${currentMatch.awayTeam.name} Win`}
                          strokeWidth={2}
                          dot={false}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Match Dashboard */}
            {currentMatch && currentOdds && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Match Stats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-bold">Match Statistics</h3>
                  </div>
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{currentMatch.stats.possession.home}%</span>
                        <span className="font-medium">Possession</span>
                        <span>{currentMatch.stats.possession.away}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            width: `${currentMatch.stats.possession.home}%`,
                            backgroundColor: currentMatch.homeTeam.primaryColor,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${currentMatch.stats.possession.home}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{currentMatch.stats.shotsOnTarget.home}</span>
                        <span className="font-medium">Shots on Target</span>
                        <span>{currentMatch.stats.shotsOnTarget.away}</span>
                      </div>
                      <div className="flex h-6">
                        <div className="flex-1 flex justify-end">
                          {Array.from({ length: currentMatch.stats.shotsOnTarget.home }).map((_, i) => (
                            <motion.div
                              key={`home-shot-${i}`}
                              className="w-3 h-6 mx-0.5 rounded"
                              style={{ backgroundColor: currentMatch.homeTeam.primaryColor }}
                              initial={{ height: 0 }}
                              animate={{ height: 24 }}
                              transition={{ delay: i * 0.1, duration: 0.5 }}
                            />
                          ))}
                        </div>
                        <div className="w-px bg-gray-300 mx-2"></div>
                        <div className="flex-1">
                          {Array.from({ length: currentMatch.stats.shotsOnTarget.away }).map((_, i) => (
                            <motion.div
                              key={`away-shot-${i}`}
                              className="w-3 h-6 mx-0.5 rounded"
                              style={{ backgroundColor: currentMatch.awayTeam.primaryColor }}
                              initial={{ height: 0 }}
                              animate={{ height: 24 }}
                              transition={{ delay: i * 0.1, duration: 0.5 }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{currentMatch.stats.corners.home}</span>
                        <span className="font-medium">Corners</span>
                        <span>{currentMatch.stats.corners.away}</span>
                      </div>
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              {
                                name: "Corners",
                                home: currentMatch.stats.corners.home,
                                away: currentMatch.stats.corners.away,
                              },
                            ]}
                            layout="vertical"
                            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" domain={[0, "dataMax + 2"]} />
                            <YAxis type="category" dataKey="name" hide />
                            <Tooltip />
                            <Bar
                              dataKey="home"
                              name={`${currentMatch.homeTeam.name}`}
                              fill={currentMatch.homeTeam.primaryColor}
                              barSize={20}
                            />
                            <Bar
                              dataKey="away"
                              name={`${currentMatch.awayTeam.name}`}
                              fill={currentMatch.awayTeam.primaryColor}
                              barSize={20}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>{currentMatch.stats.fouls.home}</span>
                        <span className="font-medium">Fouls</span>
                        <span>{currentMatch.stats.fouls.away}</span>
                      </div>
                      <div className="h-32">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: currentMatch.homeTeam.name, value: currentMatch.stats.fouls.home },
                                { name: currentMatch.awayTeam.name, value: currentMatch.stats.fouls.away },
                              ]}
                              cx="50%"
                              cy="50%"
                              outerRadius={60}
                              innerRadius={30}
                              dataKey="value"
                              nameKey="name"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              <Cell fill={currentMatch.homeTeam.primaryColor} />
                              <Cell fill={currentMatch.awayTeam.primaryColor} />
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} fouls`, ""]} />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Betting Flow */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="font-bold">Betting Flow</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-6">
                      <div className={`w-3 h-3 rounded-full ${getBettingStatusColor(currentOdds)} mr-2`}></div>
                      <span className="text-sm font-medium">
                        {currentOdds.bettingFlow.home > currentOdds.bettingFlow.away + 20
                          ? `Heavy betting on ${currentMatch.homeTeam.name}`
                          : currentOdds.bettingFlow.away > currentOdds.bettingFlow.home + 20
                            ? `Heavy betting on ${currentMatch.awayTeam.name}`
                            : "Balanced betting flow"}
                      </span>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{currentMatch.homeTeam.name}</span>
                        <span>{currentOdds.bettingFlow.home}%</span>
                      </div>
                      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full"
                          style={{
                            width: `${currentOdds.bettingFlow.home}%`,
                            backgroundColor: currentMatch.homeTeam.primaryColor,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${currentOdds.bettingFlow.home}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Draw</span>
                        <span>{currentOdds.bettingFlow.draw}%</span>
                      </div>
                      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gray-500"
                          style={{ width: `${currentOdds.bettingFlow.draw}%` }}
                          initial={{ width: 0 }}
                          animate={{ width: `${currentOdds.bettingFlow.draw}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">{currentMatch.awayTeam.name}</span>
                        <span>{currentOdds.bettingFlow.away}%</span>
                      </div>
                      <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full"
                          style={{
                            width: `${currentOdds.bettingFlow.away}%`,
                            backgroundColor: currentMatch.awayTeam.primaryColor,
                          }}
                          initial={{ width: 0 }}
                          animate={{ width: `${currentOdds.bettingFlow.away}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>

                    <div className="mt-8">
                      <h4 className="font-medium mb-3">Betting Recommendations</h4>
                      <div className="space-y-3">
                        {currentOdds.homeWin < 1.5 && (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start">
                            <AlertTriangle className="w-5 h-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm">
                                <span className="font-medium">{currentMatch.homeTeam.name} odds are very short.</span>{" "}
                                Consider alternative markets like handicaps or goals.
                              </p>
                            </div>
                          </div>
                        )}

                        {currentOdds.movement === "down" && (
                          <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-start">
                            <TrendingDown className="w-5 h-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm">
                                <span className="font-medium">Odds are shortening rapidly.</span> Consider placing your
                                bet soon if you agree with the market movement.
                              </p>
                            </div>
                          </div>
                        )}

                        {currentOdds.bettingFlow.home > 60 && currentOdds.homeWin > 2.0 && (
                          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start">
                            <Info className="w-5 h-5 text-blue-500 mr-2 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm">
                                <span className="font-medium">Value opportunity detected.</span>{" "}
                                {currentMatch.homeTeam.name} has high betting volume but odds remain good value.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alerts */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-bold">Betting Alerts</h3>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {data.alerts.filter((a) => !a.isRead).length} New
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {data.alerts.map((alert) => (
                        <motion.div
                          key={alert.id}
                          className={`border rounded-lg overflow-hidden ${getAlertColor(
                            alert.type,
                          )} ${!alert.isRead ? "ring-2 ring-blue-400" : ""}`}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ type: "spring" }}
                        >
                          <div
                            className="p-3 flex items-start cursor-pointer"
                            onClick={() => {
                              toggleAlert(alert.id)
                              if (!alert.isRead) markAlertAsRead(alert.id)
                            }}
                          >
                            <div className="mr-3 mt-0.5">{getAlertIcon(alert.type)}</div>
                            <div className="flex-1">
                              <p className={`text-sm ${!alert.isRead ? "font-medium" : ""}`}>{alert.message}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(alert.timestamp).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                            <button
                              className="ml-2 text-gray-400 hover:text-gray-600"
                              onClick={(e) => {
                                e.stopPropagation()
                                dismissAlert(alert.id)
                              }}
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {expandedAlerts.includes(alert.id) && alert.actionable && (
                            <div className="px-3 pb-3 pt-0">
                              <div className="pl-8">
                                <div className="p-3 bg-white/60 rounded-lg">
                                  <p className="text-sm mb-2">
                                    {alert.type === "value" &&
                                      "This alert indicates a potential value opportunity based on odds movement and betting patterns."}
                                    {alert.type === "movement" &&
                                      "Significant odds movement detected. This could indicate new information affecting the match."}
                                    {alert.type === "opportunity" &&
                                      "Time-sensitive betting opportunity based on recent match events."}
                                    {alert.type === "warning" &&
                                      "Unusual betting patterns detected. Exercise caution when placing bets."}
                                  </p>
                                  <div className="flex space-x-2">
                                    <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                      View Details
                                    </button>
                                    <button className="px-3 py-1.5 bg-white border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                                      Dismiss
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      ))}

                      {data.alerts.length === 0 && (
                        <div className="text-center py-6 text-gray-500">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p>No alerts at the moment</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Alerts Panel (Mobile & Desktop) */}
          <div className={`${activeTab === "alerts" ? "block" : "hidden md:block"} w-full md:w-64 lg:w-72 shrink-0`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-3 border-b border-gray-200 flex justify-between items-center">
                <h2 className="font-bold">Alerts</h2>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {data.alerts.filter((a) => !a.isRead).length} New
                </span>
              </div>

              <div className="p-3">
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {data.alerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      className={`border rounded-lg overflow-hidden ${getAlertColor(
                        alert.type,
                      )} ${!alert.isRead ? "ring-2 ring-blue-400" : ""}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ type: "spring" }}
                    >
                      <div
                        className="p-3 flex items-start cursor-pointer"
                        onClick={() => {
                          toggleAlert(alert.id)
                          if (!alert.isRead) markAlertAsRead(alert.id)
                        }}
                      >
                        <div className="mr-3 mt-0.5">{getAlertIcon(alert.type)}</div>
                        <div className="flex-1">
                          <p className={`text-sm ${!alert.isRead ? "font-medium" : ""}`}>{alert.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(alert.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <button
                          className="ml-2 text-gray-400 hover:text-gray-600"
                          onClick={(e) => {
                            e.stopPropagation()
                            dismissAlert(alert.id)
                          }}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {expandedAlerts.includes(alert.id) && alert.actionable && (
                        <div className="px-3 pb-3 pt-0">
                          <div className="pl-8">
                            <div className="p-3 bg-white/60 rounded-lg">
                              <p className="text-sm mb-2">
                                {alert.type === "value" &&
                                  "This alert indicates a potential value opportunity based on odds movement and betting patterns."}
                                {alert.type === "movement" &&
                                  "Significant odds movement detected. This could indicate new information affecting the match."}
                                {alert.type === "opportunity" &&
                                  "Time-sensitive betting opportunity based on recent match events."}
                                {alert.type === "warning" &&
                                  "Unusual betting patterns detected. Exercise caution when placing bets."}
                              </p>
                              <div className="flex space-x-2">
                                <button className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                  View Details
                                </button>
                                <button className="px-3 py-1.5 bg-white border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors">
                                  Dismiss
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {data.alerts.length === 0 && (
                    <div className="text-center py-6 text-gray-500">
                      <Bell className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <p>No alerts at the moment</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">
                Foot<span className="text-green-400">Bet</span>
              </h3>
              <p className="text-gray-400 text-sm">
                Real-time Football betting tracker with live odds, statistics, and actionable insights.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Betting Resources</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Betting Glossary
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Odds Explained
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Betting Strategies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Responsible Gambling
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-4">Newsletter</h3>
              <p className="text-gray-400 text-sm mb-3">Subscribe to get betting tips and exclusive offers.</p>

              {isNewsletterSubmitted ? (
                <div className="bg-green-900/30 border border-green-800 rounded-lg p-3 text-sm">
                  <p className="flex items-center">
                    <Check className="w-5 h-5 mr-2 text-green-500" />
                    Thanks for subscribing!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 bg-gray-800 rounded-l-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    required
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Footbet. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Terms
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
