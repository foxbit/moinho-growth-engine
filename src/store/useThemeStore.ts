import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ThemeState {
  dark: boolean
  toggle: () => void
}

function applyTheme(dark: boolean) {
  // `.dark` drives Tailwind's `dark:` utility variants; `data-theme` drives
  // the CSS custom-property tokens in index.css. Both must flip together —
  // the manual toggle previously only set the class, so every token-based
  // color (the majority of the app) never actually changed on click.
  document.documentElement.classList.toggle('dark', dark)
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
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
