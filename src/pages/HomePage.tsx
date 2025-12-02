import { Assessment } from '@/lib/types'
import { AssessmentCard } from '@/components/AssessmentCard'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface HomePageProps {
  assessments: Assessment[]
  getResultCount: (assessmentId: string) => number
  onTakeTest: (assessment: Assessment) => void
  onViewResults: (assessment: Assessment) => void
  onEdit: (assessment: Assessment) => void
  onDelete: (assessment: Assessment) => void
}

export function HomePage({
  assessments,
  getResultCount,
  onTakeTest,
  onViewResults,
  onEdit,
  onDelete
}: HomePageProps) {
  return (
    <div className="px-4 sm:px-6 pt-4 sm:pt-6">
      <div className="max-w-6xl mx-auto space-y-4">
        {assessments.length === 0 ? (
          <Alert>
            <AlertDescription>
              No assessments yet. Tap the + button to create your first questionnaire.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {assessments.map(assessment => (
              <AssessmentCard
                key={assessment.id}
                assessment={assessment}
                resultCount={getResultCount(assessment.id)}
                onTakeTest={onTakeTest}
                onViewResults={onViewResults}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
