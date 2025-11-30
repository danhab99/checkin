export type QuestionType = 'scale' | 'text' | 'yes-no'

export interface Question {
  id: string
  text: string
  type: QuestionType
  scaleMin?: number
  scaleMax?: number
}

export interface Assessment {
  id: string
  title: string
  description: string
  questions: Question[]
  createdAt: number
  updatedAt: number
}

export interface TestResponse {
  questionId: string
  value: string | number
}

export interface TestResult {
  id: string
  assessmentId: string
  timestamp: number
  responses: TestResponse[]
}
