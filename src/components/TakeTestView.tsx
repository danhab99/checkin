import { useState, useEffect } from 'react'
import { Assessment, TestResponse } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, CheckCircle } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { Progress } from '@/components/ui/progress'

interface TakeTestViewProps {
  assessment: Assessment
  onSubmit: (assessmentId: string, responses: TestResponse[]) => void
  onBack: () => void
}

export function TakeTestView({ assessment, onSubmit, onBack }: TakeTestViewProps) {
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
              <ArrowLeft className="h-5 w-5" />
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
                {question.type === 'scale' && (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <Input
                        type="number"
                        min={question.scaleMin || 1}
                        max={question.scaleMax || 10}
                        value={responses[question.id] || ''}
                        onChange={(e) => handleResponseChange(question.id, parseInt(e.target.value) || '')}
                        className="w-full sm:w-32 h-11 text-base text-center"
                        placeholder="Enter value"
                      />
                      <span className="text-sm text-muted-foreground">
                        Range: {question.scaleMin || 1} - {question.scaleMax || 10}
                      </span>
                    </div>
                  </div>
                )}

                {question.type === 'yes-no' && (
                  <RadioGroup
                    value={responses[question.id]?.toString() || ''}
                    onValueChange={(value) => handleResponseChange(question.id, value)}
                    className="flex flex-col gap-2"
                  >
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value="yes" id={`${question.id}-yes`} />
                      <Label htmlFor={`${question.id}-yes`} className="font-normal flex-1 cursor-pointer text-base">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent/50 transition-colors">
                      <RadioGroupItem value="no" id={`${question.id}-no`} />
                      <Label htmlFor={`${question.id}-no`} className="font-normal flex-1 cursor-pointer text-base">No</Label>
                    </div>
                  </RadioGroup>
                )}

                {question.type === 'text' && (
                  <Textarea
                    value={responses[question.id]?.toString() || ''}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                    placeholder="Type your response..."
                    rows={4}
                    className="resize-none text-base"
                  />
                )}
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
