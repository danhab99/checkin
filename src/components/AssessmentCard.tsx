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
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg">{assessment.title}</CardTitle>
            <CardDescription className="mt-1 text-sm line-clamp-2">{assessment.description}</CardDescription>
          </div>
          <div className="flex gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(assessment)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDelete(assessment)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex gap-2 mt-3 flex-wrap">
          <Badge variant="secondary" className="text-xs">{assessment.questions.length} questions</Badge>
          <Badge variant="outline" className="text-xs">{resultCount} results</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={() => onTakeTest(assessment)}
            className="flex-1 w-full h-10"
          >
            <ClipboardText className="mr-2 h-4 w-4" />
            Take Test
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onViewResults(assessment)}
            disabled={resultCount === 0}
            className="flex-1 w-full sm:w-auto h-10"
          >
            <ChartLine className="mr-2 h-4 w-4" />
            Results
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
