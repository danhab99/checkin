import { Assessment, TestResult } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PageHeader } from '@/components/PageHeader'
import { TimeSeriesChart } from '@/components/TimeSeriesChart'
import { TestResultCard } from '@/components/TestResultCard'

interface ResultsPageProps {
  assessment: Assessment
  results: TestResult[]
  onBack: () => void
}

export function ResultsPage({ assessment, results, onBack }: ResultsPageProps) {
  const sortedResults = [...results].sort((a, b) => b.timestamp - a.timestamp)
  const scaleQuestions = assessment.questions.filter(q => q.type === 'scale')

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={assessment.title}
        subtitle={`${results.length} total results`}
        onBack={onBack}
      />

      <div className="px-4 sm:px-6 py-4 sm:py-6">
        <div className="max-w-5xl mx-auto">
          <Tabs defaultValue="charts" className="w-full">
            <TabsList className="w-full grid grid-cols-2 h-10">
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>

            <TabsContent value="charts" className="space-y-4 mt-4">
              {scaleQuestions.length === 0 ? (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <p className="text-muted-foreground text-sm">
                      No scale questions available for charting
                    </p>
                  </CardContent>
                </Card>
              ) : (
                scaleQuestions.map(question => (
                  <Card key={question.id}>
                    <CardContent className="pt-6">
                      <h3 className="text-base sm:text-lg font-semibold mb-2">{question.text}</h3>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                        Tracking over {results.length} data points
                      </p>
                      <TimeSeriesChart
                        question={question}
                        results={results}
                      />
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="history" className="mt-4">
              <div className="space-y-3 max-h-[calc(100vh-240px)] overflow-y-auto">
                {sortedResults.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6 text-center">
                      <p className="text-muted-foreground text-sm">
                        No test results yet
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  sortedResults.map((result) => (
                    <TestResultCard
                      key={result.id}
                      result={result}
                      assessment={assessment}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
