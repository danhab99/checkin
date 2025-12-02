import { useState } from 'react'
import { Assessment, TestResult } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/PageHeader'
import { ChartLine, Copy, Check } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'

interface ResultsListPageProps {
  assessment: Assessment
  results: TestResult[]
  onBack: () => void
  onViewResult: (result: TestResult) => void
  onViewCharts: () => void
}

export function ResultsListPage({ assessment, results, onBack, onViewResult, onViewCharts }: ResultsListPageProps) {
  const [copied, setCopied] = useState(false)
  const sortedResults = [...results].sort((a, b) => b.timestamp - a.timestamp)
  const hasScaleQuestions = assessment.questions.some(q => q.type === 'scale')

  const exportAllToMarkdown = () => {
    let markdown = `# ${assessment.title}\n\n`
    
    if (assessment.description) {
      markdown += `${assessment.description}\n\n`
    }
    
    markdown += `**Total Results:** ${results.length}\n\n`
    markdown += `---\n\n`

    sortedResults.forEach((result, resultIndex) => {
      const date = new Date(result.timestamp)
      const dateStr = date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
      const timeStr = date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })

      markdown += `## Result ${sortedResults.length - resultIndex}: ${dateStr} at ${timeStr}\n\n`

      assessment.questions.forEach((question, index) => {
        const response = result.responses.find(r => r.questionId === question.id)
        
        markdown += `#### ${index + 1}. ${question.text}\n\n`
        
        if (response) {
          if (question.type === 'scale') {
            markdown += `**${response.value}** out of ${question.scaleMax || 10}\n\n`
          } else if (question.type === 'yes-no') {
            markdown += `**${response.value === 'yes' ? 'Yes' : 'No'}**\n\n`
          } else if (question.type === 'text') {
            markdown += `${response.value}\n\n`
          }
        } else {
          markdown += `*No response*\n\n`
        }
      })

      markdown += `---\n\n`
    })

    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title={assessment.title}
        subtitle={`${results.length} total result${results.length !== 1 ? 's' : ''}`}
        onBack={onBack}
        actions={
          results.length > 0 ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={exportAllToMarkdown}
                className="h-10"
              >
                {copied ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
                <span className="ml-2 hidden sm:inline">Export</span>
              </Button>
              {hasScaleQuestions && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewCharts}
                  className="h-10"
                >
                  <ChartLine className="h-5 w-5" />
                  <span className="ml-2 hidden sm:inline">Charts</span>
                </Button>
              )}
            </div>
          ) : undefined
        }
      />

      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto">
          {sortedResults.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground">
                  No test results yet. Take your first test to see results here.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {sortedResults.map((result) => (
                <Card 
                  key={result.id}
                  className="cursor-pointer hover:shadow-md transition-shadow active:scale-[0.98] transition-transform"
                  onClick={() => onViewResult(result)}
                >
                  <CardContent className="pt-6 pb-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg">
                          {new Date(result.timestamp).toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(result.timestamp).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="outline" className="text-xs">
                          {result.responses.length} answer{result.responses.length !== 1 ? 's' : ''}
                        </Badge>
                        
                        {/* Show a preview of scale responses */}
                        {assessment.questions.slice(0, 1).map(q => {
                          if (q.type === 'scale') {
                            const response = result.responses.find(r => r.questionId === q.id)
                            if (response && typeof response.value === 'number') {
                              return (
                                <div key={q.id} className="text-right">
                                  <div className="text-sm font-medium text-primary">
                                    {response.value}/{q.scaleMax || 10}
                                  </div>
                                </div>
                              )
                            }
                          }
                          return null
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
