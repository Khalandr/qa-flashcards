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

const SWIPE_THRESHOLD = 70 // px to trigger navigation
const TAP_SLOP = 10 // px of movement still counted as a tap

// Slow, smooth easing for both the fly-out and the slide-in of the next card.
const ANIM = 'transform 0.42s cubic-bezier(0.22, 0.61, 0.36, 1), opacity 0.42s ease-out'
const ANIM_MS = 420

export function FlashCard({ card, flipped, onFlip, onNext, onPrev, hasNext, hasPrev }: Props) {
  const frontRef = useRef<HTMLDivElement>(null)
  const backRef = useRef<HTMLDivElement>(null)

  const [dragX, setDragX] = useState(0)
  const [transition, setTransition] = useState(ANIM)
  const animating = useRef(false)
  const gesture = useRef<{ x: number; y: number; dx: number; axis: 'h' | 'v' | null; active: boolean }>(
    { x: 0, y: 0, dx: 0, axis: null, active: false },
  )

  const handleMouseMove = useCallback((e: React.MouseEvent, el: HTMLDivElement | null) => {
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty('--mouse-x', `${x}%`)
    el.style.setProperty('--mouse-y', `${y}%`)
  }, [])

  const reset = useCallback(() => {
    setTransition(ANIM)
    setDragX(0)
  }, [])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if (animating.current) return
    gesture.current = { x: e.clientX, y: e.clientY, dx: 0, axis: null, active: true }
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
    g.dx = dx
    if (g.axis === null && (Math.abs(dx) > TAP_SLOP || Math.abs(dy) > TAP_SLOP)) {
      g.axis = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v'
    }
    if (g.axis === 'h') setDragX(dx)
  }, [])

  const flyOut = useCallback(
    (dir: -1 | 1) => {
      const off = (typeof window !== 'undefined' ? window.innerWidth : 800) + 140
      animating.current = true
      // 1. animate the current card off-screen
      setTransition(ANIM)
      setDragX(dir * off)
      window.setTimeout(() => {
        // 2. swap to the next/prev card and drop it on the opposite edge (no transition)
        if (dir < 0) onNext()
        else onPrev()
        setTransition('none')
        setDragX(-dir * off)
        // 3. on the next frames, glide the incoming card to center
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            setTransition(ANIM)
            setDragX(0)
            window.setTimeout(() => {
              animating.current = false
            }, ANIM_MS)
          }),
        )
      }, ANIM_MS)
    },
    [onNext, onPrev],
  )

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      const g = gesture.current
      if (!g.active) return
      g.active = false
      try {
        ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
      const dx = g.dx

      // Horizontal swipe past the threshold navigates.
      if (g.axis === 'h' && dx <= -SWIPE_THRESHOLD && hasNext) {
        flyOut(-1)
        return
      }
      if (g.axis === 'h' && dx >= SWIPE_THRESHOLD && hasPrev) {
        flyOut(1)
        return
      }
      // Tap (no real movement, never became a drag) flips the card.
      if (g.axis === null && Math.abs(dx) < TAP_SLOP) {
        onFlip()
        reset()
        return
      }
      // Anything else (short/incomplete swipe, vertical scroll): snap back.
      reset()
    },
    [flyOut, hasNext, hasPrev, onFlip, reset],
  )

  // The browser aborted the gesture (e.g. it took over for scrolling). Never
  // navigate or flip on a cancel — just settle the card back into place.
  const onPointerCancel = useCallback(() => {
    const g = gesture.current
    if (!g.active) return
    g.active = false
    reset()
  }, [reset])

  const opacity = Math.max(0.45, 1 - Math.abs(dragX) / 900)
  const swiperStyle = {
    transform: `translateX(${dragX}px) rotate(${dragX / 34}deg)`,
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
        className={styles.card}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        {/* drag layer: horizontal translate + tilt, independent of the flip */}
        <div className={styles.swiper} style={swiperStyle}>
          {/* flip layer: rotateY, independent of the drag */}
          <div className={`${styles.flipper} ${flipped ? styles.flipped : ''}`}>
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
