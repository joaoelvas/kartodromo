'use client'
import { createContext, useContext, useEffect, useState } from 'react'

export type Lang = 'pt' | 'en'

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'pt',
  setLang: () => {},
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('pt')

  useEffect(() => {
    const saved = localStorage.getItem('kv_lang')
    if (saved === 'en' || saved === 'pt') setLangState(saved)
  }, [])

  const setLang = (l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem('kv_lang', l)
    } catch {}
  }

  return <LangCtx.Provider value={{ lang, setLang }}>{children}</LangCtx.Provider>
}

export const useLang = () => useContext(LangCtx)

// t('Português', 'English') — returns the active language string.
export const useT = () => {
  const { lang } = useLang()
  return (pt?: string | null, en?: string | null) =>
    (lang === 'en' ? en || pt : pt) || ''
}
