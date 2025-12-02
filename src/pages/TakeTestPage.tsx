import { useState, useEffect } from 'react'
import { Assessment, TestResponse } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { CheckCircle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'
import { PageHeader } from '@/components/PageHeader'
import { QuestionInput } from '@/components/QuestionInput'

interface TakeTestPageProps {
  assessment: Assessment
  onSubmit: (assessmentId: string, responses: TestResponse[]) => void
  onBack: () => void
}

export function TakeTestPage({ assessment, onSubmit, onBack }: TakeTestPageProps) {
  const [responses, setResponses] = useState<Record<string, string | number>>({})

  useEffect(() => {
    setResponses({})
  }, [assessment])

  const handleResponseChange = (questionId: string, value: string | number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = () => {
    const allAnswered = assessment.questions.every(q => 
      responses[q.id] !== undefined && responses[q.id] !== ''
    )

    if (!allAnswered) return

    const testResponses: TestResponse[] = assessment.questions.map(q => ({
      questionId: q.id,
      value: responses[q.id]
    }))

    onSubmit(assessment.id, testResponses)
  }

  const answeredCount = assessment.questions.filter(q => 
    responses[q.id] !== undefined && responses[q.id] !== ''
  ).length

  const allAnswered = answeredCount === assessment.questions.length
  const progress = (answeredCount / assessment.questions.length) * 100

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen bg-background"
    >
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="max-w-3xl mx-auto px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onBack}
              className="shrink-0"
            >
              <span className="sr-only">Back</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z" />
              </svg>
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold truncate">{assessment.title}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {answeredCount} of {assessment.questions.length} answered
              </p>
            </div>
          </div>
          <Progress value={progress} className="mt-3 h-1" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 pb-24 sm:pb-6">
        {assessment.description && (
          <p className="text-sm text-muted-foreground mb-6">{assessment.description}</p>
        )}

        <div className="space-y-8">
          {assessment.questions.map((question, index) => (
            <motion.div 
              key={question.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <Label className="text-base font-medium leading-relaxed">
                    {question.text}
                  </Label>
                </div>
              </div>

              <div className="pl-11">
                <QuestionInput
                  question={question}
                  value={responses[question.id]}
                  onChange={(value) => handleResponseChange(question.id, value)}
                />
              </div>

              {index < assessment.questions.length - 1 && <Separator className="mt-6" />}
            </motion.div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 sm:relative sm:border-0 sm:p-0 sm:mt-8">
        <div className="max-w-3xl mx-auto flex gap-3">
          <Button 
            variant="outline" 
            onClick={onBack} 
            className="flex-1 sm:flex-none h-11"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!allAnswered} 
            className="flex-1 sm:flex-none h-11"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            Submit Test
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
