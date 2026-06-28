import { useState, useMemo, useCallback, useEffect } from 'react'
import type { Topic, Section } from '../types'
import topicsRaw from '../data/topics.json'

const allTopics = topicsRaw as Topic[]

const sections: Section[] = (() => {
  const map = new Map<number, Section>()
  for (const t of allTopics) {
    if (!map.has(t.sIdx)) map.set(t.sIdx, { sIdx: t.sIdx, section: t.section, topics: [] })
    map.get(t.sIdx)!.topics.push(t)
  }
  return [...map.values()].sort((a, b) => a.sIdx - b.sIdx)
})()

const STORAGE_KEY = 'qa-topics-state-v1'
function loadSaved(): { selectedId?: string } {
  try {
    if (typeof localStorage === 'undefined') return {}
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {}
  } catch {
    return {}
  }
}
const saved = loadSaved()
const initSelectedId =
  saved.selectedId && allTopics.some((t) => t.id === saved.selectedId)
    ? saved.selectedId
    : allTopics[0]?.id || ''

export function useTopics() {
  const [selectedId, setSelectedId] = useState(initSelectedId)
  const [search, setSearch] = useState('')

  useEffect(() => {
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ selectedId }))
      }
    } catch {
      /* ignore */
    }
  }, [selectedId])

  const query = search.trim().toLowerCase()

  // Sections filtered by the search query (matches title, subgroup, explanation).
  const filteredSections = useMemo(() => {
    if (!query) return sections
    return sections
      .map((s) => ({
        ...s,
        topics: s.topics.filter(
          (t) =>
            t.title.toLowerCase().includes(query) ||
            (t.subgroup || '').toLowerCase().includes(query) ||
            t.explanation.toLowerCase().includes(query),
        ),
      }))
      .filter((s) => s.topics.length > 0)
  }, [query])

  const flatFiltered = useMemo(() => filteredSections.flatMap((s) => s.topics), [filteredSections])

  const selectedTopic = useMemo(
    () => allTopics.find((t) => t.id === selectedId) || null,
    [selectedId],
  )

  const selectTopic = useCallback((id: string) => setSelectedId(id), [])

  // Move to the previous/next topic in the current (filtered) ordering.
  const step = useCallback(
    (dir: -1 | 1) => {
      const list = flatFiltered.length ? flatFiltered : allTopics
      const idx = list.findIndex((t) => t.id === selectedId)
      const next = list[idx + dir]
      if (next) setSelectedId(next.id)
    },
    [flatFiltered, selectedId],
  )

  const idx = flatFiltered.findIndex((t) => t.id === selectedId)

  return {
    sections,
    filteredSections,
    selectedTopic,
    selectedId,
    search,
    setSearch,
    selectTopic,
    step,
    hasPrev: idx > 0,
    hasNext: idx >= 0 && idx < flatFiltered.length - 1,
    totalCount: allTopics.length,
  }
}
