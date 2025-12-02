import { Assessment, TestResult } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

interface TestResultCardProps {
  result: TestResult
  assessment: Assessment
}

export function TestResultCard({ result, assessment }: TestResultCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <CardTitle className="text-sm sm:text-base">
            {new Date(result.timestamp).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </CardTitle>
          <Badge variant="outline" className="self-start text-xs">
            {new Date(result.timestamp).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {assessment.questions.map((question, index) => {
          const response = result.responses.find(r => r.questionId === question.id)
          return (
            <div key={question.id}>
              <p className="text-xs sm:text-sm font-medium mb-1">{question.text}</p>
              <p className="text-sm text-muted-foreground">
                {response?.value !== undefined ? response.value.toString() : 'No response'}
              </p>
              {index < assessment.questions.length - 1 && <Separator className="mt-3" />}
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
