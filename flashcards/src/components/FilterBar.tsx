import type { Category } from '../types'
import { Dropdown } from './Dropdown'
import styles from './FilterBar.module.css'

interface Props {
  category: 'all' | Category
  topic: string
  availableTopics: string[]
  onCategoryChange: (c: 'all' | Category) => void
  onTopicChange: (t: string) => void
}

const categoryOptions = [
  { value: 'all', label: 'Select domain' },
  { value: 'qa', label: 'QA Fundamentals' },
  { value: 'automation', label: 'Test Automation' },
  { value: 'ai', label: 'AI Testing' },
]

export function FilterBar({
  category,
  topic,
  availableTopics,
  onCategoryChange,
  onTopicChange,
}: Props) {
  const topicDisabled = category === 'all'

  return (
    <div className={styles.bar}>
      <Dropdown
        value={category}
        options={categoryOptions}
        onChange={(v) => onCategoryChange(v as 'all' | Category)}
        placeholder="Select domain"
      />
      <Dropdown
        value={topicDisabled ? '' : topic}
        options={availableTopics.map((t) => ({ value: t, label: t }))}
        onChange={onTopicChange}
        disabled={topicDisabled}
        placeholder="Select topic"
      />
    </div>
  )
}
