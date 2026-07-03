'use client'
import { createContext, useContext, useState } from 'react'

type QuoteContextType = {
  isOpen: boolean
  openQuote: () => void
  closeQuote: () => void
}

const QuoteContext = createContext<QuoteContextType>({
  isOpen: false,
  openQuote: () => {},
  closeQuote: () => {},
})

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <QuoteContext.Provider value={{ isOpen, openQuote: () => setIsOpen(true), closeQuote: () => setIsOpen(false) }}>
      {children}
    </QuoteContext.Provider>
  )
}

export const useQuote = () => useContext(QuoteContext)
