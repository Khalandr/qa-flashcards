export interface Topic {
  id: string
  sIdx: number
  section: string
  subgroup: string | null
  title: string
  explanation: string
}

export interface Section {
  sIdx: number
  section: string
  topics: Topic[]
}
