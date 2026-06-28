import { useState, useEffect } from 'react'
import { useTopics } from './hooks/useTopics'
import { TopicList } from './components/TopicList'
import { TopicReader } from './components/TopicReader'
import styles from './App.module.css'

export default function App() {
  const t = useTopics()
  const [mobileReading, setMobileReading] = useState(false)

  const handleSelect = (id: string) => {
    t.selectTopic(id)
    setMobileReading(true)
  }

  // Arrow-key navigation on desktop.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA')) return
      if (e.key === 'ArrowRight') t.step(1)
      else if (e.key === 'ArrowLeft') t.step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [t])

  return (
    <div className={styles.app}>
      <aside className={`${styles.sidebar} ${mobileReading ? styles.hiddenMobile : ''}`}>
        <TopicList
          sections={t.filteredSections}
          selectedId={t.selectedId}
          search={t.search}
          onSearch={t.setSearch}
          onSelect={handleSelect}
          totalCount={t.totalCount}
        />
      </aside>

      <main className={`${styles.content} ${!mobileReading ? styles.hiddenMobile : ''}`}>
        <TopicReader
          topic={t.selectedTopic}
          onBack={() => setMobileReading(false)}
          onPrev={() => t.step(-1)}
          onNext={() => t.step(1)}
          hasPrev={t.hasPrev}
          hasNext={t.hasNext}
        />
      </main>
    </div>
  )
}
