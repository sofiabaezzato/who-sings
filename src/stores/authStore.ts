import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AuthPlayer {
	name: string
	id: string
}

interface AuthStore {
	player: AuthPlayer | null
	isLoggedIn: boolean
	login: (name: string, id: string) => void
	logout: () => void
}

export const useAuthStore = create<AuthStore>()(
	persist(
		(set, _get) => ({
			player: null,
			isLoggedIn: false,
			login: (name: string, id: string) => {
				const authPlayer: AuthPlayer = {
					name: name.trim(),
					id,
				}
				set({ player: authPlayer, isLoggedIn: true })
			},
			logout: () => {
				set({ player: null, isLoggedIn: false })
			},
		}),
		{
			name: 'who-sings-auth',
			partialize: (state) => ({ player: state.player }),
			onRehydrateStorage: () => (state) => {
				if (state?.player) {
					state.isLoggedIn = true
				}
			},
		}
	)
)