import { Question, QuestionType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash } from '@phosphor-icons/react'

interface QuestionEditorProps {
  question: Question
  onChange: (updates: Partial<Question>) => void
  onRemove: () => void
}

export function QuestionEditor({ question, onChange, onRemove }: QuestionEditorProps) {
  return (
    <div className="space-y-3 p-3 sm:p-4 border rounded-lg">
      <div className="flex items-start gap-2">
        <div className="flex-1 space-y-3 min-w-0">
          <Input
            value={question.text}
            onChange={(e) => onChange({ text: e.target.value })}
            placeholder="Question text"
            className="h-10"
          />

          <div className="space-y-3">
            <div className="flex gap-2 items-center flex-wrap">
              <Label className="text-sm text-muted-foreground shrink-0">Type:</Label>
              <Select
                value={question.type}
                onValueChange={(value: QuestionType) => onChange({ type: value })}
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
                  onChange={(e) => onChange({ scaleMin: parseInt(e.target.value) })}
                  className="w-20 h-10"
                  min={0}
                />
                <span className="text-sm text-muted-foreground">to</span>
                <Input
                  type="number"
                  value={question.scaleMax || 10}
                  onChange={(e) => onChange({ scaleMax: parseInt(e.target.value) })}
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
          onClick={onRemove}
          className="h-10 w-10 shrink-0"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
