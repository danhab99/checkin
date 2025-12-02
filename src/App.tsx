import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { Assessment, TestResult, TestResponse } from '@/lib/types'
import { AssessmentDialog } from '@/components'
import { TakeTestPage, ResultsPage, HomePage } from '@/pages'
import { Button } from '@/components/ui/button'
import { Plus } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { Toaster } from '@/components/ui/sonner'
import { motion } from 'framer-motion'

function App() {
  const [assessments, setAssessments] = useKV<Assessment[]>('assessments', [])
  const [results, setResults] = useKV<TestResult[]>('test-results', [])
  
  const [dialogOpen, setDialogOpen] = useState(false)
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
  }

  const handleSubmitTest = (assessmentId: string, responses: TestResponse[]) => {
    const newResult: TestResult = {
      id: Date.now().toString(),
      assessmentId,
      timestamp: Date.now(),
      responses
    }
    
    setResults(current => [...(current || []), newResult])
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

  if (takingTestAssessment) {
    return (
      <>
        <TakeTestPage
          assessment={takingTestAssessment}
          onSubmit={handleSubmitTest}
          onBack={() => setTakingTestAssessment(null)}
        />
        <Toaster />
      </>
    )
  }

  if (viewingResults) {
    return (
      <motion.div
        key="results"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className="min-h-screen bg-background"
      >
        <ResultsPage
          assessment={viewingResults}
          results={getResultsForAssessment(viewingResults.id)}
          onBack={() => setViewingResults(null)}
        />
        <Toaster />
      </motion.div>
    )
  }

  return (
    <motion.div
      key="home"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen bg-background pb-20 sm:pb-6"
    >
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
              className="shrink-0 h-10 px-3 sm:px-4"
            >
              <Plus className="h-5 w-5 sm:mr-2" />
              <span className="hidden sm:inline">Create Assessment</span>
            </Button>
          </div>
        </div>
      </div>

      <HomePage
        assessments={assessments || []}
        getResultCount={getResultCount}
        onTakeTest={handleTakeTest}
        onViewResults={handleViewResults}
        onEdit={handleEditAssessment}
        onDelete={handleDeleteAssessment}
      />

      <AssessmentDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (!open) setEditingAssessment(undefined)
        }}
        onSave={handleCreateAssessment}
        editingAssessment={editingAssessment}
      />

      <Toaster />
    </motion.div>
  )
}

export default App