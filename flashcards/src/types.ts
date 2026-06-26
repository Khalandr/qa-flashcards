export type Difficulty = 'easy' | 'medium' | 'hard'
export type Category = 'qa' | 'automation' | 'ai'

export interface FlashCard {
  id: string
  question: string
  answer: string
  topic: string
  difficulty: Difficulty
  probability: number
  category: Category
}

export interface Filters {
  category: 'all' | Category
  topic: string
  search: string
}
