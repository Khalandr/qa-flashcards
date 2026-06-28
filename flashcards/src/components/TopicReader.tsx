import type { Topic } from '../types'
import styles from './TopicReader.module.css'

interface Props {
  topic: Topic | null
  onBack: () => void
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

export function TopicReader({ topic, onBack, onPrev, onNext, hasPrev, hasNext }: Props) {
  return (
    <div className={styles.reader}>
      <button className={styles.back} onClick={onBack} aria-label="Back to topics">
        ‹ Topics
      </button>

      {!topic ? (
        <div className={styles.empty}>Select a topic to read its explanation.</div>
      ) : (
        <>
          <div className={styles.body}>
            <div className={styles.crumb}>
              <span className={styles.crumbNum}>{topic.sIdx}</span>
              <span>{topic.section}</span>
              {topic.subgroup && <span className={styles.crumbSub}>· {topic.subgroup}</span>}
            </div>
            <h2 className={styles.title}>{topic.title}</h2>
            <p className={styles.explanation}>{topic.explanation}</p>
          </div>

          <div className={styles.nav}>
            <button onClick={onPrev} disabled={!hasPrev}>
              ‹ Prev
            </button>
            <button onClick={onNext} disabled={!hasNext}>
              Next ›
            </button>
          </div>
        </>
      )}
    </div>
  )
}
