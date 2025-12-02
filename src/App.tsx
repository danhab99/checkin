import { useState } from 'react'
import { useLocalStorage } from 'react-use'
import { Assessment, TestResult, TestResponse } from '@/lib/types'
import { TakeTestPage, ResultsListPage, ResultDetailPage, ChartsPage, HomePage, CreateAssessmentPage } from '@/pages'
import { Button } from '@/components/ui/button'
import { Plus } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

function App() {
  const [assessments, setAssessments] = useLocalStorage<Assessment[]>('assessments', [])
  const [results, setResults] = useLocalStorage<TestResult[]>('test-results', [])
  
  const [creatingAssessment, setCreatingAssessment] = useState(false)
  const [editingAssessment, setEditingAssessment] = useState<Assessment | undefined>()
  const [takingTestAssessment, setTakingTestAssessment] = useState<Assessment | null>(null)
  const [viewingResultsList, setViewingResultsList] = useState<Assessment | null>(null)
  const [viewingResultDetail, setViewingResultDetail] = useState<TestResult | null>(null)
  const [viewingCharts, setViewingCharts] = useState<Assessment | null>(null)

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
    } else {
      const newAssessment: Assessment = {
        ...data,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now
      }
      setAssessments(current => [...(current || []), newAssessment])
    }
    
    setCreatingAssessment(false)
    setEditingAssessment(undefined)
  }

  const handleEditAssessment = (assessment: Assessment) => {
    setEditingAssessment(assessment)
    setCreatingAssessment(true)
  }

  const handleDeleteAssessment = (assessment: Assessment) => {
    if (confirm(`Delete "${assessment.title}"? This will also delete all associated test results.`)) {
      setAssessments(current => (current || []).filter(a => a.id !== assessment.id))
      setResults(current => (current || []).filter(r => r.assessmentId !== assessment.id))
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
  }

  const handleViewResults = (assessment: Assessment) => {
    setViewingResultsList(assessment)
  }

  const getResultCount = (assessmentId: string) => {
    return (results || []).filter(r => r.assessmentId === assessmentId).length
  }

  const getResultsForAssessment = (assessmentId: string) => {
    return (results || []).filter(r => r.assessmentId === assessmentId)
  }

  if (creatingAssessment || editingAssessment) {
    return (
      <CreateAssessmentPage
        onSave={handleCreateAssessment}
        onCancel={() => {
          setCreatingAssessment(false)
          setEditingAssessment(undefined)
        }}
        editingAssessment={editingAssessment}
      />
    )
  }

  if (takingTestAssessment) {
    return (
      <TakeTestPage
        assessment={takingTestAssessment}
        onSubmit={handleSubmitTest}
        onBack={() => setTakingTestAssessment(null)}
      />
    )
  }

  if (viewingCharts) {
    return (
      <ChartsPage
        assessment={viewingCharts}
        results={getResultsForAssessment(viewingCharts.id)}
        onBack={() => {
          setViewingResultsList(viewingCharts)
          setViewingCharts(null)
        }}
      />
    )
  }

  if (viewingResultDetail && viewingResultsList) {
    return (
      <ResultDetailPage
        assessment={viewingResultsList}
        result={viewingResultDetail}
        onBack={() => setViewingResultDetail(null)}
      />
    )
  }

  if (viewingResultsList) {
    return (
      <ResultsListPage
        assessment={viewingResultsList}
        results={getResultsForAssessment(viewingResultsList.id)}
        onBack={() => {
          setViewingResultsList(null)
          setViewingResultDetail(null)
        }}
        onViewResult={(result) => setViewingResultDetail(result)}
        onViewCharts={() => {
          setViewingCharts(viewingResultsList)
        }}
      />
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
                setCreatingAssessment(true)
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
    </motion.div>
  )
}

export default App