import { useState, useEffect } from 'react'
import { Assessment, Question, QuestionType } from '@/lib/types'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Plus, Trash } from '@phosphor-icons/react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface AssessmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (assessment: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>) => void
  editingAssessment?: Assessment
}

export function AssessmentDialog({ open, onOpenChange, onSave, editingAssessment }: AssessmentDialogProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])

  useEffect(() => {
    if (editingAssessment) {
      setTitle(editingAssessment.title)
      setDescription(editingAssessment.description)
      setQuestions(editingAssessment.questions)
    } else {
      setTitle('')
      setDescription('')
      setQuestions([])
    }
  }, [editingAssessment, open])

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: '',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 10
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], ...updates }
    setQuestions(updated)
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (!title.trim() || questions.length === 0) return
    
    const validQuestions = questions.filter(q => q.text.trim())
    if (validQuestions.length === 0) return

    onSave({
      title: title.trim(),
      description: description.trim(),
      questions: validQuestions
    })

    setTitle('')
    setDescription('')
    setQuestions([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[95vh] sm:max-h-[90vh] w-[95vw] sm:w-full p-0">
        <DialogHeader className="px-4 pt-6 pb-4 sm:px-6">
          <DialogTitle className="text-xl">{editingAssessment ? 'Edit Assessment' : 'Create New Assessment'}</DialogTitle>
          <DialogDescription>
            Build a custom questionnaire to track over time
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="max-h-[calc(95vh-180px)] sm:max-h-[calc(90vh-180px)] px-4 sm:px-6">
          <div className="space-y-6 pb-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Daily Mood Check"
                className="h-10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of what this assessment tracks"
                rows={3}
                className="resize-none"
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-base">Questions</Label>
                <Button onClick={addQuestion} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add
                </Button>
              </div>

              {questions.map((question, index) => (
                <div key={question.id} className="space-y-3 p-3 sm:p-4 border rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-3 min-w-0">
                      <Input
                        value={question.text}
                        onChange={(e) => updateQuestion(index, { text: e.target.value })}
                        placeholder="Question text"
                        className="h-10"
                      />

                      <div className="space-y-3">
                        <div className="flex gap-2 items-center flex-wrap">
                          <Label className="text-sm text-muted-foreground shrink-0">Type:</Label>
                          <Select
                            value={question.type}
                            onValueChange={(value: QuestionType) => updateQuestion(index, { type: value })}
                          >
                            <SelectTrigger className="w-[180px] h-10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="scale">Scale (1-10)</SelectItem>
                              <SelectItem value="yes-no">Yes/No</SelectItem>
                              <SelectItem value="text">Text</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {question.type === 'scale' && (
                          <div className="flex gap-2 items-center flex-wrap">
                            <Label className="text-sm text-muted-foreground shrink-0">Range:</Label>
                            <Input
                              type="number"
                              value={question.scaleMin || 1}
                              onChange={(e) => updateQuestion(index, { scaleMin: parseInt(e.target.value) })}
                              className="w-20 h-10"
                              min={0}
                            />
                            <span className="text-sm text-muted-foreground">to</span>
                            <Input
                              type="number"
                              value={question.scaleMax || 10}
                              onChange={(e) => updateQuestion(index, { scaleMax: parseInt(e.target.value) })}
                              className="w-20 h-10"
                              min={question.scaleMin || 1}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeQuestion(index)}
                      className="h-10 w-10 shrink-0"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {questions.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No questions yet. Tap "Add" to get started.
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="px-4 pb-6 sm:px-6 gap-2 flex-col sm:flex-row">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto h-10">
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!title.trim() || questions.filter(q => q.text.trim()).length === 0}
            className="w-full sm:w-auto h-10"
          >
            {editingAssessment ? 'Save Changes' : 'Create Assessment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
