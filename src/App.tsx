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
      <div className="min-h-screen bg-background p-4 sm:p-6">
        <div className="max-w-5xl mx-auto">
          <ResultsView
            assessment={viewingResults}
            results={getResultsForAssessment(viewingResults.id)}
            onBack={() => setViewingResults(null)}
          />
        </div>
        <Toaster />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Habit Tracker</h1>
            <p className="text-muted-foreground mt-1">
              Create custom assessments and track your progress over time
            </p>
          </div>
          <Button onClick={() => {
            setEditingAssessment(undefined)
            setDialogOpen(true)
          }}>
            <Plus className="mr-2" />
            Create Assessment
          </Button>
        </div>

        {(assessments || []).length === 0 ? (
          <Alert>
            <AlertDescription>
              No assessments yet. Click "Create Assessment" to build your first custom questionnaire.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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