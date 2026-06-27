import { useFlashCards } from './hooks/useFlashCards'
import { FlashCard } from './components/FlashCard'
import { FilterBar } from './components/FilterBar'
import styles from './App.module.css'

export default function App() {
  const {
    currentCard,
    currentIndex,
    filteredCards,
    flipped,
    sets,
    set,
    category,
    topic,
    availableCategories,
    availableTopics,
    setSetFilter,
    setCategoryFilter,
    setTopicFilter,
    nextCard,
    prevCard,
    setFlipped,
  } = useFlashCards()

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <FilterBar
          sets={sets}
          set={set}
          category={category}
          topic={topic}
          availableCategories={availableCategories}
          availableTopics={availableTopics}
          onSetChange={setSetFilter}
          onCategoryChange={setCategoryFilter}
          onTopicChange={setTopicFilter}
        />
      </header>

      <div className={styles.body}>
        {filteredCards.length === 0 ? (
          <div className={styles.empty}>No cards match.</div>
        ) : (
          <div className={styles.center}>
            <FlashCard
              card={currentCard!}
              flipped={flipped}
              onFlip={() => setFlipped(!flipped)}
              onNext={nextCard}
              onPrev={prevCard}
              hasNext={currentIndex < filteredCards.length - 1}
              hasPrev={currentIndex > 0}
            />
          </div>
        )}
      </div>
    </div>
  )
}
