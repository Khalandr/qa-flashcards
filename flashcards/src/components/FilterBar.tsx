import { Dropdown } from './Dropdown'
import styles from './FilterBar.module.css'

interface Props {
  sets: string[]
  set: string
  category: 'all' | string
  topic: string
  availableCategories: string[]
  availableTopics: string[]
  onSetChange: (s: string) => void
  onCategoryChange: (c: 'all' | string) => void
  onTopicChange: (t: string) => void
}

export function FilterBar({
  sets,
  set,
  category,
  topic,
  availableCategories,
  availableTopics,
  onSetChange,
  onCategoryChange,
  onTopicChange,
}: Props) {
  return (
    <div className={styles.bar}>
      <Dropdown
        value={set}
        options={sets.map((s) => ({ value: s, label: s }))}
        onChange={onSetChange}
        placeholder="Select set"
      />
      <Dropdown
        value={category}
        options={[
          { value: 'all', label: 'All domains' },
          ...availableCategories.map((c) => ({ value: c, label: c })),
        ]}
        onChange={onCategoryChange}
        placeholder="Select domain"
      />
      <Dropdown
        value={topic}
        options={availableTopics.map((t) => ({ value: t, label: t }))}
        onChange={onTopicChange}
        placeholder="Select topic"
      />
    </div>
  )
}
