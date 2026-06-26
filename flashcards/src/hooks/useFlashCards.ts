import { useState, useMemo, useCallback } from 'react'
import type { FlashCard, Category } from '../types'

import qaRaw from '../data/qa-fundamentals.json'
import autoRaw from '../data/test-automation.json'
import aiRaw from '../data/ai-testing.json'

const qaData = qaRaw as FlashCard[]
const autoData = autoRaw as FlashCard[]
const aiData = aiRaw as FlashCard[]

const allCards: FlashCard[] = [...qaData, ...autoData, ...aiData]

const topicsByCategory: Record<string, string[]> = {
  qa: [...new Set(qaData.map((c) => c.topic))].sort(),
  automation: [...new Set(autoData.map((c) => c.topic))].sort(),
  ai: [...new Set(aiData.map((c) => c.topic))].sort(),
}

export function useFlashCards() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [category, setCategory] = useState<'all' | Category>('all')
  const [topic, setTopic] = useState('')
  const [search, setSearch] = useState('')

  const filteredCards = useMemo(() => {
    return allCards.filter((card) => {
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
    }).sort((a, b) => b.probability - a.probability)
  }, [category, topic, search])

  const availableTopics = useMemo(() => {
    if (category === 'all') {
      return [...new Set(allCards.map((c) => c.topic))].sort()
    }
    return topicsByCategory[category] || []
  }, [category])

  const currentCard = filteredCards[currentIndex] || null

  const setCategoryFilter = useCallback((c: 'all' | Category) => {
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
    category,
    topic,
    search,
    availableTopics,
    setCategoryFilter,
    setTopicFilter,
    setSearchFilter,
    nextCard,
    prevCard,
    setFlipped,
  }
}
