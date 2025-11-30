import { Assessment } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ClipboardText, ChartLine, Pencil, Trash } from '@phosphor-icons/react'

interface AssessmentCardProps {
  assessment: Assessment
  resultCount: number
  onTakeTest: (assessment: Assessment) => void
  onViewResults: (assessment: Assessment) => void
  onEdit: (assessment: Assessment) => void
  onDelete: (assessment: Assessment) => void
}

export function AssessmentCard({
  assessment,
  resultCount,
  onTakeTest,
  onViewResults,
  onEdit,
  onDelete
}: AssessmentCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg">{assessment.title}</CardTitle>
            <CardDescription className="mt-1">{assessment.description}</CardDescription>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(assessment)}>
              <Pencil />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(assessment)}>
              <Trash />
            </Button>
          </div>
        </div>
        <div className="flex gap-2 mt-3">
          <Badge variant="secondary">{assessment.questions.length} questions</Badge>
          <Badge variant="outline">{resultCount} results</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button 
            onClick={() => onTakeTest(assessment)}
            className="flex-1"
          >
            <ClipboardText className="mr-2" />
            Take Test
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onViewResults(assessment)}
            disabled={resultCount === 0}
          >
            <ChartLine className="mr-2" />
            Results
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
