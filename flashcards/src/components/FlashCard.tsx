import { useCallback, useRef, useState } from 'react'
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

const SWIPE_THRESHOLD = 80 // px to trigger navigation
const TAP_SLOP = 10 // px of movement still counted as a tap

const DEFAULT_TRANSITION = 'transform 0.25s ease-out'

export function FlashCard({ card, flipped, onFlip, onNext, onPrev, hasNext, hasPrev }: Props) {
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)

  const [dragX, setDragX] = useState(0)
  const [transition, setTransition] = useState(DEFAULT_TRANSITION)
  const gesture = useRef<{ x: number; y: number; axis: 'h' | 'v' | null; active: boolean }>({
    x: 0,
    y: 0,
    axis: null,
    active: false,
  })

  const handleMouseMove = useCallback((e: React.MouseEvent, el: HTMLDivElement | null) => {
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mouse-x', `${x}%`)
    el.style.setProperty('--mouse-y', `${y}%`)
  }, [])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    gesture.current = { x: e.clientX, y: e.clientY, axis: null, active: true }
    setTransition('none')
    try {
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    } catch {
      /* ignore */
    }
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const g = gesture.current
    if (!g.active) return
    const dx = e.clientX - g.x
    const dy = e.clientY - g.y
    if (g.axis === null && (Math.abs(dx) > TAP_SLOP || Math.abs(dy) > TAP_SLOP)) {
      g.axis = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v'
    }
    if (g.axis === 'h') setDragX(dx)
  }, [])

  const flyOut = useCallback(
    (dir: -1 | 1) => {
      const w = typeof window !== 'undefined' ? window.innerWidth : 800
      setTransition(DEFAULT_TRANSITION)
      setDragX(dir * (w + 120))
      window.setTimeout(() => {
        if (dir < 0) onNext()
        else onPrev()
        setTransition('none')
        setDragX(0)
        // restore default transition on a later frame so the reset is instant
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setTransition(DEFAULT_TRANSITION)),
        )
      }, 230)
    },
    [onNext, onPrev],
  )

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      const g = gesture.current
      if (!g.active) return
      g.active = false
      const dx = e.clientX - g.x
      const dy = e.clientY - g.y

      // Tap (negligible movement) flips the card.
      if (g.axis !== 'h' && Math.abs(dx) < TAP_SLOP && Math.abs(dy) < TAP_SLOP) {
        onFlip()
        setTransition(DEFAULT_TRANSITION)
        setDragX(0)
        return
      }

      if (g.axis === 'h' && dx <= -SWIPE_THRESHOLD && hasNext) {
        flyOut(-1)
        return
      }
      if (g.axis === 'h' && dx >= SWIPE_THRESHOLD && hasPrev) {
        flyOut(1)
        return
      }
      // snap back
      setTransition(DEFAULT_TRANSITION)
      setDragX(0)
    },
    [flyOut, hasNext, hasPrev, onFlip],
  )

  const opacity = Math.max(0.35, 1 - Math.abs(dragX) / 650)
  const cardStyle = {
    transform: `translateX(${dragX}px) rotate(${dragX / 28}deg)`,
    transition,
    opacity,
  }

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

      <div
        className={`${styles.card} ${flipped ? styles.flipped : ''}`}
        style={cardStyle}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
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
