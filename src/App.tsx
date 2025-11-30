import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Assessment, TestResult, TestResponse } from '@/lib/types'
import { AssessmentCard } from '@/components/AssessmentCard'
import { AssessmentDialog } from '@/components/AssessmentDialog'
import { TakeTestDialog } from '@/components/TakeTestDialog'
import { ResultsView } from '@/components/ResultsView'
import { Button } from '@/components/ui/button'
import { Plus } from '@phosphor-icons/react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const [assessments, setAssessments] = useKV<Assessment[]>('assessments', [])
  const [results, setResults] = useKV<TestResult[]>('test-results', [])
  
  const [dialogOpen, setDialogOpen] = useState(false)
  const [testDialogOpen, setTestDialogOpen] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState<Assessment | undefined>()
  const [takingTestAssessment, setTakingTestAssessment] = useState<Assessment | null>(null)
  const [viewingResults, setViewingResults] = useState<Assessment | null>(null)

  const handleCreateAssessment = (data: Omit<Assessment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = Date.now()
    
    if (editingAssessment) {
      setAssessments(current =>
        (current || []).map(a =>
          a.id === editingAssessment.id
            ? { ...data, id: a.id, createdAt: a.createdAt, updatedAt: now }
            : a
        )
      )
      toast.success('Assessment updated successfully')
    } else {
      const newAssessment: Assessment = {
        ...data,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now
      }
      setAssessments(current => [...(current || []), newAssessment])
      toast.success('Assessment created successfully')
    }
    
    setDialogOpen(false)
    setEditingAssessment(undefined)
  }

  const handleEditAssessment = (assessment: Assessment) => {
    setEditingAssessment(assessment)
    setDialogOpen(true)
  }

  const handleDeleteAssessment = (assessment: Assessment) => {
    if (confirm(`Delete "${assessment.title}"? This will also delete all associated test results.`)) {
      setAssessments(current => (current || []).filter(a => a.id !== assessment.id))
      setResults(current => (current || []).filter(r => r.assessmentId !== assessment.id))
      toast.success('Assessment deleted')
    }
  }

  const handleTakeTest = (assessment: Assessment) => {
    setTakingTestAssessment(assessment)
    setTestDialogOpen(true)
  }

  const handleSubmitTest = (assessmentId: string, responses: TestResponse[]) => {
    const newResult: TestResult = {
      id: Date.now().toString(),
      assessmentId,
      timestamp: Date.now(),
      responses
    }
    
    setResults(current => [...(current || []), newResult])
    setTestDialogOpen(false)
    setTakingTestAssessment(null)
    toast.success('Test submitted successfully')
  }

  const handleViewResults = (assessment: Assessment) => {
    setViewingResults(assessment)
  }

  const getResultCount = (assessmentId: string) => {
    return (results || []).filter(r => r.assessmentId === assessmentId).length
  }

  const getResultsForAssessment = (assessmentId: string) => {
    return (results || []).filter(r => r.assessmentId === assessmentId)
  }

  if (viewingResults) {
    return (
      <div className="min-h-screen bg-background">
        <ResultsView
          assessment={viewingResults}
          results={getResultsForAssessment(viewingResults.id)}
          onBack={() => setViewingResults(null)}
        />
        <Toaster />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20 sm:pb-6">
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 sm:relative sm:border-0 sm:px-6 sm:pt-6 sm:pb-0">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Habit Tracker</h1>
              <p className="text-sm sm:text-base text-muted-foreground mt-1">
                Create custom assessments and track your progress
              </p>
            </div>
            <Button 
              onClick={() => {
                setEditingAssessment(undefined)
                setDialogOpen(true)
              }}
              size="sm"
              className="shrink-0 sm:size-default"
            >
              <Plus className="sm:mr-2" />
              <span className="hidden sm:inline">Create Assessment</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="max-w-6xl mx-auto space-y-4">
          {(assessments || []).length === 0 ? (
            <Alert>
              <AlertDescription>
                No assessments yet. Tap the + button to create your first questionnaire.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {(assessments || []).map(assessment => (
                <AssessmentCard
                  key={assessment.id}
                  assessment={assessment}
                  resultCount={getResultCount(assessment.id)}
                  onTakeTest={handleTakeTest}
                  onViewResults={handleViewResults}
                  onEdit={handleEditAssessment}
                  onDelete={handleDeleteAssessment}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AssessmentDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingAssessment(undefined)
        }}
        onSave={handleCreateAssessment}
        editingAssessment={editingAssessment}
      />

      <TakeTestDialog
        open={testDialogOpen}
        onOpenChange={setTestDialogOpen}
        assessment={takingTestAssessment}
        onSubmit={handleSubmitTest}
      />

      <Toaster />
    </div>
  )
}

export default App