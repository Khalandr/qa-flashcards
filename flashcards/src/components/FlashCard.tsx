import { useCallback, useRef } from 'react'
import type { FlashCard as FlashCardType } from '../types'
import styles from './FlashCard.module.css'

interface Props {
  card: FlashCardType
  flipped: boolean
  onFlip: () => void
  onNext: () => void
  onPrev: () => void
  hasNext: boolean
  hasPrev: boolean
}

export function FlashCard({ card, flipped, onFlip, onNext, onPrev, hasNext, hasPrev }: Props) {
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent, el: HTMLDivElement | null) => {
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mouse-x', `${x}%`)
    el.style.setProperty('--mouse-y', `${y}%`)
  }, [])

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.arrow} ${!hasPrev ? styles.arrowHidden : ''}`}
        onClick={onPrev}
        disabled={!hasPrev}
        aria-label="Previous"
      >
        ‹
      </button>

      <div className={`${styles.card} ${flipped ? styles.flipped : ''}`} onClick={onFlip}>
        <div
          ref={frontRef}
          className={styles.front}
          onMouseMove={(e) => handleMouseMove(e, frontRef.current)}
        >
          <p className={styles.text}>{card.question}</p>
        </div>
        <div
          ref={backRef}
          className={styles.back}
          onMouseMove={(e) => handleMouseMove(e, backRef.current)}
        >
          <p className={styles.text}>{card.answer}</p>
        </div>
      </div>

      <button
        className={`${styles.arrow} ${!hasNext ? styles.arrowHidden : ''}`}
        onClick={onNext}
        disabled={!hasNext}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  )
}
