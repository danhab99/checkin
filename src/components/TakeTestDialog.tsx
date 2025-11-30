import { useState, useEffect } from 'react'
import { Assessment, TestResponse } from '@/lib/types'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

interface TakeTestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assessment: Assessment | null
  onSubmit: (assessmentId: string, responses: TestResponse[]) => void
}

export function TakeTestDialog({ open, onOpenChange, assessment, onSubmit }: TakeTestDialogProps) {
  const [responses, setResponses] = useState<Record<string, string | number>>({})

  useEffect(() => {
    setResponses({})
  }, [assessment, open])

  const handleResponseChange = (questionId: string, value: string | number) => {
    setResponses(prev => ({ ...prev, [questionId]: value }))
  }

  const handleSubmit = () => {
    if (!assessment) return

    const allAnswered = assessment.questions.every(q => 
      responses[q.id] !== undefined && responses[q.id] !== ''
    )

    if (!allAnswered) return

    const testResponses: TestResponse[] = assessment.questions.map(q => ({
      questionId: q.id,
      value: responses[q.id]
    }))

    onSubmit(assessment.id, testResponses)
    setResponses({})
  }

  const allAnswered = assessment?.questions.every(q => 
    responses[q.id] !== undefined && responses[q.id] !== ''
  ) || false

  if (!assessment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[95vh] sm:max-h-[90vh] w-[95vw] sm:w-full p-0">
        <DialogHeader className="px-4 pt-6 pb-4 sm:px-6">
          <DialogTitle className="text-xl">{assessment.title}</DialogTitle>
          <DialogDescription>{assessment.description}</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-180px)] px-4 sm:px-6">
          <div className="space-y-6 pb-4">
            {assessment.questions.map((question, index) => (
              <div key={question.id} className="space-y-3">
                <Label className="text-base font-medium">
                  {index + 1}. {question.text}
                </Label>

                {question.type === 'scale' && (
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <Input
                        type="number"
                        min={question.scaleMin || 1}
                        max={question.scaleMax || 10}
                        value={responses[question.id] || ''}
                        onChange={(e) => handleResponseChange(question.id, parseInt(e.target.value) || '')}
                        className="w-full sm:w-32 h-12 text-lg text-center"
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
                    className="flex flex-col gap-3"
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

                {index < assessment.questions.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </ScrollArea>

        <DialogFooter className="px-4 pb-6 sm:px-6 gap-2 flex-col sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!allAnswered} className="w-full sm:w-auto">
            Submit Test
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
