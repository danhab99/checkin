import { useState } from 'react'
import { Assessment, TestResult } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Copy, Check } from '@phosphor-icons/react'

interface ResultDetailPageProps {
  assessment: Assessment
  result: TestResult
  onBack: () => void
}

export function ResultDetailPage({ assessment, result, onBack }: ResultDetailPageProps) {
  const [copied, setCopied] = useState(false)

  const exportToMarkdown = () => {
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

    let markdown = `# ${assessment.title}\n\n`
    markdown += `**Date:** ${dateStr} at ${timeStr}\n\n`
    
    if (assessment.description) {
      markdown += `${assessment.description}\n\n`
    }
    
    markdown += `---\n\n`

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

    navigator.clipboard.writeText(markdown).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Test Result"
        subtitle={new Date(result.timestamp).toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })}
        onBack={onBack}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={exportToMarkdown}
            className="h-10"
          >
            {copied ? (
              <>
                <Check className="h-5 w-5" />
                <span className="ml-2 hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-5 w-5" />
                <span className="ml-2 hidden sm:inline">Export</span>
              </>
            )}
          </Button>
        }
      />

      <div className="px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{assessment.title}</CardTitle>
              {assessment.description && (
                <p className="text-sm text-muted-foreground mt-2">{assessment.description}</p>
              )}
            </CardHeader>
          </Card>

          <div className="space-y-3">
            {assessment.questions.map((question, index) => {
              const response = result.responses.find(r => r.questionId === question.id)
              
              return (
                <Card key={question.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-base leading-relaxed">
                          {question.text}
                        </h3>
                      </div>
                    </div>

                    <div className="pl-11">
                      <Separator className="mb-3" />
                      
                      {question.type === 'scale' && (
                        <div className="flex items-center gap-3">
                          <div className="text-3xl font-bold text-primary">
                            {response?.value || '-'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            out of {question.scaleMax || 10}
                          </div>
                        </div>
                      )}

                      {question.type === 'yes-no' && (
                        <Badge 
                          variant={response?.value === 'yes' ? 'default' : 'secondary'}
                          className="text-base px-4 py-1.5"
                        >
                          {response?.value === 'yes' ? 'Yes' : response?.value === 'no' ? 'No' : 'No answer'}
                        </Badge>
                      )}

                      {question.type === 'text' && (
                        <div className="bg-muted/50 rounded-md p-4">
                          <p className="text-base whitespace-pre-wrap">
                            {response?.value || 'No answer provided'}
                          </p>
                        </div>
                      )}

                      {!response && (
                        <p className="text-sm text-muted-foreground italic">No response recorded</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
