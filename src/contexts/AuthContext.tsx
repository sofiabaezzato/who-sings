import { createContext, useState, useEffect, type ReactNode } from 'react'

interface GameResult {
  score: number
  totalQuestions: number
  completedAt: string
  timeSpent: number
}

interface Player {
  name: string
  id: string
  gameHistory: GameResult[]
}

interface AuthContextType {
  player: Player | null
  isLoggedIn: boolean
  login: (name: string) => void
  logout: () => void
  addGameResult: (result: GameResult) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [player, setPlayer] = useState<Player | null>(null)

  useEffect(() => {
    const savedPlayer = localStorage.getItem('who-sings-player')
    if (savedPlayer) {
      try {
        setPlayer(JSON.parse(savedPlayer))
      } catch (error) {
        localStorage.removeItem('who-sings-player')
      }
    }
  }, [])

  const login = (name: string) => {
    const newPlayer: Player = {
      name: name.trim(),
      id: `player-${crypto.randomUUID()}`,
      gameHistory: []
		}
    
    setPlayer(newPlayer)
    localStorage.setItem('who-sings-player', JSON.stringify(newPlayer))
  }

  const addGameResult = (result: GameResult) => {
    if (!player) return
    
    const updatedPlayer: Player = {
      ...player,
      gameHistory: [...player.gameHistory, result]
    }
    
    setPlayer(updatedPlayer)
    localStorage.setItem('who-sings-player', JSON.stringify(updatedPlayer))
  }

  const logout = () => {
    setPlayer(null)
    localStorage.removeItem('who-sings-player')
  }

  const value: AuthContextType = {
    player,
    isLoggedIn: player !== null,
    login,
    logout,
    addGameResult
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext }