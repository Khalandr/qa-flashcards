import { useState, useEffect } from 'react'
import type { Section } from '../types'
import styles from './TopicList.module.css'

interface Props {
  sections: Section[]
  selectedId: string
  search: string
  onSearch: (s: string) => void
  onSelect: (id: string) => void
  totalCount: number
}

export function TopicList({ sections, selectedId, search, onSearch, onSelect, totalCount }: Props) {
  const searching = search.trim().length > 0

  const [expanded, setExpanded] = useState<Set<number>>(() => {
    const sel = sections.flatMap((s) => s.topics).find((t) => t.id === selectedId)
    return new Set(sel ? [sel.sIdx] : sections[0] ? [sections[0].sIdx] : [])
  })

  // Keep the selected topic's section open (e.g. when stepping into a new one).
  useEffect(() => {
    const sel = sections.flatMap((s) => s.topics).find((t) => t.id === selectedId)
    if (sel) setExpanded((prev) => (prev.has(sel.sIdx) ? prev : new Set(prev).add(sel.sIdx)))
  }, [selectedId, sections])

  const toggle = (sIdx: number) =>
    setExpanded((prev) => {
      const n = new Set(prev)
      n.has(sIdx) ? n.delete(sIdx) : n.add(sIdx)
      return n
    })

  return (
    <div className={styles.list}>
      <div className={styles.head}>
        <h1 className={styles.appTitle}>QA Interview Prep</h1>
        <p className={styles.sub}>{totalCount} topics · brief explanations</p>
        <input
          className={styles.search}
          placeholder="Search topics…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>

      <div className={styles.sections}>
        {sections.length === 0 && <p className={styles.empty}>No topics match “{search}”.</p>}
        {sections.map((s) => {
          const open = searching || expanded.has(s.sIdx)
          return (
            <div key={s.sIdx} className={styles.section}>
              <button className={styles.secHeader} onClick={() => toggle(s.sIdx)}>
                <span className={styles.secNum}>{s.sIdx}</span>
                <span className={styles.secTitle}>{s.section}</span>
                <span className={styles.secCount}>{s.topics.length}</span>
                <span className={styles.chev}>{open ? '▾' : '▸'}</span>
              </button>

              {open && (
                <div className={styles.topics}>
                  {s.topics.map((t, i) => {
                    const showSub = t.subgroup && t.subgroup !== s.topics[i - 1]?.subgroup
                    return (
                      <div key={t.id}>
                        {showSub && <div className={styles.subgroup}>{t.subgroup}</div>}
                        <button
                          className={`${styles.topic} ${t.id === selectedId ? styles.active : ''}`}
                          onClick={() => onSelect(t.id)}
                        >
                          {t.title}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
