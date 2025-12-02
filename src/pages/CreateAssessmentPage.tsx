import { useState, useEffect } from 'react'
import { Assessment, Question } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { Plus } from '@phosphor-icons/react'
import { PageHeader } from '@/components/PageHeader'
import { QuestionEditor } from '@/components/QuestionEditor'

interface CreateAssessmentPageProps {
  onSave: (assessment: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
  editingAssessment?: Assessment
}

export function CreateAssessmentPage({ onSave, onCancel, editingAssessment }: CreateAssessmentPageProps) {
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
  }, [editingAssessment])

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
  }

  const canSave = title.trim() && questions.filter(q => q.text.trim()).length > 0

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={editingAssessment ? 'Edit Assessment' : 'New Assessment'}
        onBack={onCancel}
      />

      <div className="px-4 py-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Daily Mood Check"
              className="h-12 text-base"
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
              className="resize-none text-base"
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Questions</Label>
              <Button onClick={addQuestion} size="sm" className="h-10">
                <Plus className="mr-2 h-5 w-5" />
                Add Question
              </Button>
            </div>

            {questions.map((question, index) => (
              <QuestionEditor
                key={question.id}
                question={question}
                onChange={(updates) => updateQuestion(index, updates)}
                onRemove={() => removeQuestion(index)}
              />
            ))}

            {questions.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground mb-4">No questions yet</p>
                <Button onClick={addQuestion} variant="outline">
                  <Plus className="mr-2 h-5 w-5" />
                  Add Your First Question
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
        <div className="max-w-2xl mx-auto flex gap-3">
          <Button 
            variant="outline" 
            onClick={onCancel} 
            className="flex-1 h-12 text-base"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!canSave}
            className="flex-1 h-12 text-base"
          >
            {editingAssessment ? 'Save Changes' : 'Create Assessment'}
          </Button>
        </div>
      </div>
    </div>
  )
}
