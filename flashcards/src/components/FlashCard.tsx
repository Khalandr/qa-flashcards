import { useCallback } from 'react'
import { motion, useMotionValue, useTransform, animate, type PanInfo } from 'framer-motion'
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

const SWIPE_DIST = 80 // px of horizontal travel that counts as a swipe
const SWIPE_VEL = 450 // px/s flick velocity that counts as a swipe

export function FlashCard({ card, flipped, onFlip, onNext, onPrev, hasNext, hasPrev }: Props) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-260, 260], [-9, 9])
  const opacity = useTransform(x, [-340, -140, 0, 140, 340], [0.35, 1, 1, 1, 0.35])

  const screenW = () => (typeof window !== 'undefined' ? window.innerWidth : 800) + 140

  // dir: -1 = next (card exits left), +1 = prev (card exits right)
  const go = useCallback(
    (dir: -1 | 1) => {
      const w = screenW()
      animate(x, dir * w, {
        duration: 0.22,
        ease: [0.4, 0, 1, 1],
        onComplete: () => {
          if (dir < 0) onNext()
          else onPrev()
          // place the incoming card on the opposite edge, then glide it in
          x.set(-dir * w)
          animate(x, 0, { type: 'spring', stiffness: 280, damping: 32 })
        },
      })
    },
    [onNext, onPrev, x],
  )

  const handleDragEnd = useCallback(
    (_e: PointerEvent, info: PanInfo) => {
      const swiped = Math.abs(info.offset.x) > SWIPE_DIST || Math.abs(info.velocity.x) > SWIPE_VEL
      if (swiped && info.offset.x < 0 && hasNext) return go(-1)
      if (swiped && info.offset.x > 0 && hasPrev) return go(1)
      animate(x, 0, { type: 'spring', stiffness: 320, damping: 32 })
    },
    [go, hasNext, hasPrev, x],
  )

  const glow = useCallback((e: React.MouseEvent, el: HTMLDivElement) => {
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--mouse-x', `${((e.clientX - rect.left) / rect.width) * 100}%`)
    el.style.setProperty('--mouse-y', `${((e.clientY - rect.top) / rect.height) * 100}%`)
  }, [])

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.arrow} ${!hasPrev ? styles.arrowHidden : ''}`}
        onClick={() => hasPrev && go(1)}
        disabled={!hasPrev}
        aria-label="Previous"
      >
        ‹
      </button>

      <motion.div
        className={styles.card}
        style={{ x, rotate, opacity }}
        drag="x"
        dragMomentum={false}
        dragElastic={1}
        onDragEnd={handleDragEnd}
        onTap={onFlip}
      >
        <div className={`${styles.flipper} ${flipped ? styles.flipped : ''}`}>
          <div
            className={styles.front}
            onMouseMove={(e) => glow(e, e.currentTarget)}
          >
            <p className={styles.text}>{card.question}</p>
          </div>
          <div
            className={styles.back}
            onMouseMove={(e) => glow(e, e.currentTarget)}
          >
            <p className={styles.text}>{card.answer}</p>
          </div>
        </div>
      </motion.div>

      <button
        className={`${styles.arrow} ${!hasNext ? styles.arrowHidden : ''}`}
        onClick={() => hasNext && go(-1)}
        disabled={!hasNext}
        aria-label="Next"
      >
        ›
      </button>
    </div>
  )
}
