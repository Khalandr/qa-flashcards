import { useState, useMemo, useCallback } from 'react'
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

export function useFlashCards() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [set, setSet] = useState<string>(sets[0] || '')
  const [category, setCategory] = useState<'all' | string>('all')
  const [topic, setTopic] = useState('')
  const [search, setSearch] = useState('')

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
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex((i) => i + 1)
      setFlipped(false)
    }
  }, [currentIndex, filteredCards.length])

  const prevCard = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
      setFlipped(false)
    }
  }, [currentIndex])

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
