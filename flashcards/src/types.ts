export type Difficulty = 'easy' | 'medium' | 'hard'

export interface FlashCard {
  id: string
  question: string
  answer: string
  set: string
  category: string
  topic: string
  difficulty: Difficulty
  probability: number
}

export interface Filters {
  set: string
  category: 'all' | string
  topic: string
  search: string
}
