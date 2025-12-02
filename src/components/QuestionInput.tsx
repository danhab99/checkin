import { Question } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

interface QuestionInputProps {
  question: Question
  value: string | number | undefined
  onChange: (value: string | number) => void
  className?: string
}

export function QuestionInput({ question, value, onChange, className = '' }: QuestionInputProps) {
  if (question.type === 'scale') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <Input
            type="number"
            min={question.scaleMin || 1}
            max={question.scaleMax || 10}
            value={value || ''}
            onChange={(e) => onChange(parseInt(e.target.value) || '')}
            className="w-full sm:w-32 h-11 text-base text-center"
            placeholder="Enter value"
          />
          <span className="text-sm text-muted-foreground">
            Range: {question.scaleMin || 1} - {question.scaleMax || 10}
          </span>
        </div>
      </div>
    )
  }

  if (question.type === 'yes-no') {
    return (
      <RadioGroup
        value={value?.toString() || ''}
        onValueChange={(val) => onChange(val)}
        className={`flex flex-col gap-2 ${className}`}
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
    )
  }

  if (question.type === 'text') {
    return (
      <Textarea
        value={value?.toString() || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type your response..."
        rows={4}
        className={`resize-none text-base ${className}`}
      />
    )
  }

  return null
}
