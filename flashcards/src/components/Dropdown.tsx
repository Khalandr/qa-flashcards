'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import styles from './Dropdown.module.css'

interface Option {
  value: string
  label: string
}

interface Props {
  value: string
  options: Option[]
  onChange: (value: string) => void
  disabled?: boolean
  placeholder: string
}

export function Dropdown({ value, options, onChange, disabled, placeholder }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const selected = options.find((o) => o.value === value)

  const handleKey = useCallback(
    (opt: Option) => (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        onChange(opt.value)
        setOpen(false)
      }
    },
    [onChange],
  )

  return (
    <div className={styles.wrapper} ref={ref}>
      <button
        className={`${styles.trigger} ${disabled ? styles.disabled : ''}`}
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
      >
        <span className={styles.value}>{selected ? selected.label : placeholder}</span>
        <span className={styles.arrow}>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className={styles.list} role="listbox">
          {options.map((opt) => (
            <div
              key={opt.value}
              className={`${styles.item} ${opt.value === value ? styles.selected : ''}`}
              onClick={() => {
                onChange(opt.value)
                setOpen(false)
              }}
              onKeyDown={handleKey(opt)}
              tabIndex={0}
              role="option"
              aria-selected={opt.value === value}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
