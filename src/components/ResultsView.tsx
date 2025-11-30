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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft />
        </Button>
        <div>
          <h2 className="text-2xl font-semibold">{assessment.title}</h2>
          <p className="text-sm text-muted-foreground">{results.length} total results</p>
        </div>
      </div>

      <Tabs defaultValue="charts" className="w-full">
        <TabsList>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="charts" className="space-y-6 mt-6">
          {scaleQuestions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  No scale questions available for charting
                </p>
              </CardContent>
            </Card>
          ) : (
            scaleQuestions.map(question => (
              <Card key={question.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{question.text}</CardTitle>
                  <CardDescription>
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

        <TabsContent value="history" className="mt-6">
          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {sortedResults.length === 0 ? (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">
                      No test results yet
                    </p>
                  </CardContent>
                </Card>
              ) : (
                sortedResults.map((result) => (
                  <Card key={result.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {new Date(result.timestamp).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </CardTitle>
                        <Badge variant="outline">
                          {new Date(result.timestamp).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {assessment.questions.map(question => {
                        const response = result.responses.find(r => r.questionId === question.id)
                        return (
                          <div key={question.id}>
                            <p className="text-sm font-medium mb-1">{question.text}</p>
                            <p className="text-sm text-muted-foreground">
                              {response?.value !== undefined ? response.value.toString() : 'No response'}
                            </p>
                            <Separator className="mt-3" />
                          </div>
                        )
                      })}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}
