import { render, screen, cleanup, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PlayerAuth } from '../PlayerAuth'
import { useAuth } from '@/hooks/useAuth.ts'
import { useAuthStore } from '@/stores/authStore'
import { useGameDataStore } from '@/stores/gameDataStore'

// Test component to access auth state
function TestAuthDisplay() {
  const { player, isLoggedIn, logout } = useAuth()
  
  if (!isLoggedIn) {
    return <PlayerAuth />
  }
  
  return (
    <div>
      <p data-testid="welcome-message">Welcome, {player?.name}!</p>
      <button onClick={logout} data-testid="logout-btn">Logout</button>
    </div>
  )
}

// Full app wrapper with all providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}

describe('User Management Integration', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    
    // Reset Zustand stores
    useAuthStore.setState({ player: null, isLoggedIn: false })
    useGameDataStore.setState({ allPlayers: [] })
    
    cleanup()
  })

  it('should handle complete login → logout → persistence flow', async () => {
    const user = userEvent.setup()
    
    // 1. Initial render - should show login form
    const { unmount } = render(
      <TestWrapper>
        <TestAuthDisplay />
      </TestWrapper>
    )
    
    // Verify login form is shown
    expect(screen.getByLabelText(/how can we call you/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start playing/i })).toBeInTheDocument()
    
    // 2. Login with username (keep it short due to maxLength={20})
    const nameInput = screen.getByLabelText(/how can we call you/i)
    await user.type(nameInput, 'TestUser')
    
    // Wait for button to be enabled
    const submitButton = screen.getByRole('button', { name: /start playing/i })
    expect(submitButton).not.toBeDisabled()
    
    await user.click(submitButton)
    
    // 3. Wait for and verify logged in state
    await waitFor(() => {
      expect(screen.getByTestId('welcome-message')).toHaveTextContent('Welcome, TestUser!')
    })
    expect(screen.getByTestId('logout-btn')).toBeInTheDocument()
    
    // 4. Verify localStorage was updated
    await waitFor(() => {
      const storedAuth = localStorage.getItem('who-sings-auth')
      expect(storedAuth).toBeTruthy()
      const authData = JSON.parse(storedAuth!)
      expect(authData.state.player).toMatchObject({
        name: 'TestUser',
        id: expect.any(String)
      })
    })
    
    // 5. Logout
    await user.click(screen.getByTestId('logout-btn'))
    
    // 6. Verify logged out state
    expect(screen.getByLabelText(/how can we call you/i)).toBeInTheDocument()
    expect(screen.queryByTestId('welcome-message')).not.toBeInTheDocument()
    
    // 7. Verify localStorage was cleared
    const authData = localStorage.getItem('who-sings-auth')
    expect(authData ? JSON.parse(authData).state.player : null).toBeNull()
    
    // 8. Unmount and re-mount (simulates page refresh/navigation)
    unmount()
    
    render(
      <TestWrapper>
        <TestAuthDisplay />
      </TestWrapper>
    )
    
    // 9. Should show login form again (no persistence after logout)
    expect(screen.getByLabelText(/how can we call you/i)).toBeInTheDocument()
    expect(screen.queryByTestId('welcome-message')).not.toBeInTheDocument()
  })

  it('should persist login state across component remounts', async () => {
    const user = userEvent.setup()
    
    // 1. Login
    const { unmount } = render(
      <TestWrapper>
        <TestAuthDisplay />
      </TestWrapper>
    )
    
    await user.type(screen.getByLabelText(/how can we call you/i), 'Persistent User')
    await user.click(screen.getByRole('button', { name: /start playing/i }))
    
    // Verify logged in
    expect(screen.getByTestId('welcome-message')).toHaveTextContent('Welcome, Persistent User!')
    
    // 2. Unmount component (simulate navigation)
    unmount()
    
    // 3. Re-mount component (simulate coming back)
    render(
      <TestWrapper>
        <TestAuthDisplay />
      </TestWrapper>
    )
    
    // 4. Should automatically be logged in (persistence)
    expect(screen.getByTestId('welcome-message')).toHaveTextContent('Welcome, Persistent User!')
    expect(screen.getByTestId('logout-btn')).toBeInTheDocument()
    expect(screen.queryByLabelText(/how can we call you/i)).not.toBeInTheDocument()
  })

  it('should handle empty username submission', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <TestAuthDisplay />
      </TestWrapper>
    )
    
    // Try to submit empty form
    const submitButton = screen.getByRole('button', { name: /start playing/i })
    await user.click(submitButton)
    
    // Should still show login form (validation)
    expect(screen.getByLabelText(/how can we call you/i)).toBeInTheDocument()
    expect(screen.queryByTestId('welcome-message')).not.toBeInTheDocument()
  })

  it('should handle whitespace-only username', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <TestAuthDisplay />
      </TestWrapper>
    )
    
    // Submit form with only whitespace
    await user.type(screen.getByLabelText(/how can we call you/i), '   ')
    await user.click(screen.getByRole('button', { name: /start playing/i }))
    
    // Should still show login form
    expect(screen.getByLabelText(/how can we call you/i)).toBeInTheDocument()
    expect(screen.queryByTestId('welcome-message')).not.toBeInTheDocument()
  })

  it('should handle multiple login/logout cycles', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <TestAuthDisplay />
      </TestWrapper>
    )
    
    // First cycle
    await user.type(screen.getByLabelText(/how can we call you/i), 'User One')
    await user.click(screen.getByRole('button', { name: /start playing/i }))
    expect(screen.getByTestId('welcome-message')).toHaveTextContent('Welcome, User One!')
    
    await user.click(screen.getByTestId('logout-btn'))
    expect(screen.getByLabelText(/how can we call you/i)).toBeInTheDocument()
    
    // Second cycle with different user
    await user.type(screen.getByLabelText(/how can we call you/i), 'User Two')
    await user.click(screen.getByRole('button', { name: /start playing/i }))
    expect(screen.getByTestId('welcome-message')).toHaveTextContent('Welcome, User Two!')
    
    // Verify localStorage has the latest user
    const storedAuth = localStorage.getItem('who-sings-auth')
    expect(storedAuth).toBeTruthy()
    const authData = JSON.parse(storedAuth!)
    expect(authData.state.player.name).toBe('User Two')
  })

  it('should generate unique user IDs', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <TestAuthDisplay />
      </TestWrapper>
    )
    
    // Login first user
    await user.type(screen.getByLabelText(/how can we call you/i), 'User Alpha')
    await user.click(screen.getByRole('button', { name: /start playing/i }))
    
    const firstAuthData = localStorage.getItem('who-sings-auth')
    expect(firstAuthData).toBeTruthy()
    const firstUserId = JSON.parse(firstAuthData!).state.player.id
    
    // Logout and login second user
    await user.click(screen.getByTestId('logout-btn'))
    await user.type(screen.getByLabelText(/how can we call you/i), 'User Beta')
    await user.click(screen.getByRole('button', { name: /start playing/i }))
    
    const secondAuthData = localStorage.getItem('who-sings-auth')
    expect(secondAuthData).toBeTruthy()
    const secondUserId = JSON.parse(secondAuthData!).state.player.id
    
    // Should have different IDs
    expect(firstUserId).not.toBe(secondUserId)
    expect(firstUserId).toMatch(/^player-/)
    expect(secondUserId).toMatch(/^player-/)
  })
})