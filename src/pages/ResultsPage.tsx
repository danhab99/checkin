import { Assessment, TestResult } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { PageHeader } from '@/components/PageHeader'
import { TimeSeriesChart } from '@/components/TimeSeriesChart'

interface ChartsPageProps {
  assessment: Assessment
  results: TestResult[]
  onBack: () => void
}

export function ChartsPage({ assessment, results, onBack }: ChartsPageProps) {
  const scaleQuestions = assessment.questions.filter(q => q.type === 'scale')

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Charts"
        subtitle={`${assessment.title} • ${results.length} data point${results.length !== 1 ? 's' : ''}`}
        onBack={onBack}
      />

      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          {scaleQuestions.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground">
                  No scale questions available for charting
                </p>
              </CardContent>
            </Card>
          ) : (
            scaleQuestions.map(question => (
              <Card key={question.id}>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">{question.text}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Tracking over {results.length} data point{results.length !== 1 ? 's' : ''}
                  </p>
                  <TimeSeriesChart
                    question={question}
                    results={results}
                  />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
