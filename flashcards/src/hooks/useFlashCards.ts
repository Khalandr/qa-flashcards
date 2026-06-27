import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import type { FlashCard } from '../types'

import qaRaw from '../data/qa-fundamentals.json'
import autoRaw from '../data/test-automation.json'
import aiRaw from '../data/ai-testing.json'
import istqbRaw from '../data/istqb.json'
import webRaw from '../data/web-set2.json'

const allCards: FlashCard[] = [
  ...(qaRaw as FlashCard[]),
  ...(autoRaw as FlashCard[]),
  ...(aiRaw as FlashCard[]),
  ...(istqbRaw as FlashCard[]),
  ...(webRaw as FlashCard[]),
]

// Explicit display order for the set selector; any unknown sets are appended.
const SET_ORDER = ['Interview Set 1', 'ISTQB Top 100', 'Interview Set 2']
const sets: string[] = [
  ...SET_ORDER.filter((s) => allCards.some((c) => c.set === s)),
  ...[...new Set(allCards.map((c) => c.set))].filter((s) => !SET_ORDER.includes(s)).sort(),
]

const categoriesBySet: Record<string, string[]> = {}
for (const s of sets) {
  categoriesBySet[s] = [...new Set(allCards.filter((c) => c.set === s).map((c) => c.category))].sort()
}

// ---- persistence ----
const STORAGE_KEY = 'flashcards-state-v1'
interface Saved {
  set?: string
  category?: string
  topic?: string
  search?: string
  cardId?: string
}
function loadSaved(): Saved {
  try {
    if (typeof localStorage === 'undefined') return {}
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}
  } catch {
    return {}
  }
}
const saved = loadSaved()

// Resolve valid initial filter values from saved state (falling back to defaults).
const initSet = saved.set && sets.includes(saved.set) ? saved.set : sets[0] || ''
const initCats = categoriesBySet[initSet] || []
const initCategory: 'all' | string =
  saved.category && (saved.category === 'all' || initCats.includes(saved.category))
    ? saved.category
    : 'all'
const initTopicScope = allCards
  .filter((c) => c.set === initSet && (initCategory === 'all' || c.category === initCategory))
  .map((c) => c.topic)
const initTopic = saved.topic && initTopicScope.includes(saved.topic) ? saved.topic : ''
const initSearch = typeof saved.search === 'string' ? saved.search : ''

export function useFlashCards() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [set, setSet] = useState<string>(initSet)
  const [category, setCategory] = useState<'all' | string>(initCategory)
  const [topic, setTopic] = useState(initTopic)
  const [search, setSearch] = useState(initSearch)

  const filteredCards = useMemo(() => {
    return allCards
      .filter((card) => {
        if (set && card.set !== set) return false
        if (category !== 'all' && card.category !== category) return false
        if (topic && card.topic !== topic) return false
        if (search) {
          const q = search.toLowerCase()
          if (
            !card.question.toLowerCase().includes(q) &&
            !card.answer.toLowerCase().includes(q)
          ) {
            return false
          }
        }
        return true
      })
      .sort((a, b) => b.probability - a.probability)
  }, [set, category, topic, search])

  // Restore the last viewed card once, after the filtered list is available.
  const restored = useRef(false)
  useEffect(() => {
    if (restored.current) return
    restored.current = true
    if (saved.cardId) {
      const idx = filteredCards.findIndex((c) => c.id === saved.cardId)
      if (idx > 0) setCurrentIndex(idx)
    }
  }, [filteredCards])

  // Persist filters + current card on every change.
  useEffect(() => {
    try {
      if (typeof localStorage === 'undefined') return
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ set, category, topic, search, cardId: filteredCards[currentIndex]?.id }),
      )
    } catch {
      /* ignore */
    }
  }, [set, category, topic, search, currentIndex, filteredCards])

  const availableCategories = useMemo(() => categoriesBySet[set] || [], [set])

  const availableTopics = useMemo(() => {
    const inSet = allCards.filter((c) => c.set === set)
    const scoped = category === 'all' ? inSet : inSet.filter((c) => c.category === category)
    return [...new Set(scoped.map((c) => c.topic))].sort()
  }, [set, category])

  const currentCard = filteredCards[currentIndex] || null

  const setSetFilter = useCallback((s: string) => {
    setSet(s)
    setCategory('all')
    setTopic('')
    setCurrentIndex(0)
    setFlipped(false)
  }, [])

  const setCategoryFilter = useCallback((c: 'all' | string) => {
    setCategory(c)
    setTopic('')
    setCurrentIndex(0)
    setFlipped(false)
  }, [])

  const setTopicFilter = useCallback((t: string) => {
    setTopic(t)
    setCurrentIndex(0)
    setFlipped(false)
  }, [])

  const setSearchFilter = useCallback((s: string) => {
    setSearch(s)
    setCurrentIndex(0)
    setFlipped(false)
  }, [])

  const nextCard = useCallback(() => {
    setCurrentIndex((i) => (i < filteredCards.length - 1 ? i + 1 : i))
    setFlipped(false)
  }, [filteredCards.length])

  const prevCard = useCallback(() => {
    setCurrentIndex((i) => (i > 0 ? i - 1 : i))
    setFlipped(false)
  }, [])

  return {
    currentCard,
    currentIndex,
    filteredCards,
    flipped,
    sets,
    set,
    category,
    topic,
    availableCategories,
    availableTopics,
    setSetFilter,
    setCategoryFilter,
    setTopicFilter,
    setSearchFilter,
    nextCard,
    prevCard,
    setFlipped,
  }
}
