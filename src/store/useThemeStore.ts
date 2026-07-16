import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  dark: boolean
  toggle: () => void
}

function applyTheme(dark: boolean) {
  document.documentElement.classList.toggle('dark', dark)
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      dark: false,
      toggle: () => {
        const dark = !get().dark
        applyTheme(dark)
        set({ dark })
      },
    }),
    {
      name: 'moinho-theme',
      onRehydrateStorage: () => (state) => {
        if (state) applyTheme(state.dark)
      },
    },
  ),
)
