import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from 'react'

export type Lang = 'en' | 'zh'

interface LanguageContextType {
  lang: Lang
  toggleLang: () => void
  t: (en: string, zh: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === 'undefined') return 'en'
    return (localStorage.getItem('lang') as Lang) || 'en'
  })

  const toggleLang = useCallback(() => {
    setLang(prev => {
      const next = prev === 'en' ? 'zh' : 'en'
      localStorage.setItem('lang', next)
      return next
    })
  }, [])

  const t = useCallback(
    (en: string, zh: string) => (lang === 'en' ? en : zh),
    [lang]
  )

  const value = useMemo(() => ({ lang, toggleLang, t }), [lang, toggleLang, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}
