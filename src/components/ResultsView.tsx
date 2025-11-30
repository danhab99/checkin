import { Assessment, TestResult } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { ArrowLeft } from '@phosphor-icons/react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TimeSeriesChart } from './TimeSeriesChart'

interface ResultsViewProps {
  assessment: Assessment
  results: TestResult[]
  onBack: () => void
}

export function ResultsView({ assessment, results, onBack }: ResultsViewProps) {
  const sortedResults = [...results].sort((a, b) => b.timestamp - a.timestamp)

  const scaleQuestions = assessment.questions.filter(q => q.type === 'scale')

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 sm:px-6 sm:py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0 h-10 w-10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-semibold truncate">{assessment.title}</h2>
            <p className="text-sm text-muted-foreground">{results.length} total results</p>
          </div>
        </div>
      </div>

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
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base sm:text-lg">{question.text}</CardTitle>
                      <CardDescription className="text-xs sm:text-sm">
                        Tracking over {results.length} data points
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                    <Card key={result.id}>
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
