# Quick Reference Guide

## Component Locations

### Pages (src/pages/)
Full-page components that represent different screens:

- **HomePage** - Main dashboard
- **TakeTestPage** - Take an assessment
- **ResultsPage** - View assessment results

### Components (src/components/)
Reusable UI components:

#### Core Components
- **AssessmentCard** - Display assessment with actions
- **AssessmentDialog** - Create/edit assessment modal
- **TimeSeriesChart** - D3 visualization for data

#### Form Components
- **QuestionInput** - Render question input (scale/yes-no/text)
- **QuestionEditor** - Edit question properties

#### Layout Components
- **PageHeader** - Page header with back button
- **TestResultCard** - Display single test result

## Component Props Quick Reference

### PageHeader
```tsx
<PageHeader
  title: string              // Page title
  subtitle?: string          // Optional subtitle
  onBack?: () => void       // Back button handler
  actions?: ReactNode       // Optional action buttons
  sticky?: boolean         // Sticky header (default: true)
/>
```

### QuestionInput
```tsx
<QuestionInput
  question: Question                    // Question object
  value: string | number | undefined  // Current value
  onChange: (value) => void           // Change handler
  className?: string                  // Optional styling
/>
```

### QuestionEditor
```tsx
<QuestionEditor
  question: Question                    // Question to edit
  onChange: (updates) => void          // Update handler
  onRemove: () => void                // Remove handler
/>
```

### AssessmentCard
```tsx
<AssessmentCard
  assessment: Assessment
  resultCount: number
  onTakeTest: (assessment) => void
  onViewResults: (assessment) => void
  onEdit: (assessment) => void
  onDelete: (assessment) => void
/>
```

### TestResultCard
```tsx
<TestResultCard
  result: TestResult      // Test result data
  assessment: Assessment  // Associated assessment
/>
```

## Import Patterns

### Importing Pages
```tsx
import { HomePage, TakeTestPage, ResultsPage } from '@/pages'
```

### Importing Components
```tsx
import { PageHeader, QuestionInput, AssessmentCard } from '@/components'
```

### Importing UI Components
```tsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader } from '@/components/ui/card'
```

### Importing Types
```tsx
import { Assessment, TestResult, Question } from '@/lib/types'
```

## Common Patterns

### Creating a New Page Component
```tsx
import { PageHeader } from '@/components'

export function MyPage({ onBack }) {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="My Page"
        onBack={onBack}
      />
      <div className="px-4 sm:px-6 py-4 sm:py-6">
        {/* Content */}
      </div>
    </div>
  )
}
```

### Using Question Components Together
```tsx
// For taking a test
<QuestionInput
  question={question}
  value={responses[question.id]}
  onChange={(value) => handleChange(question.id, value)}
/>

// For editing questions
<QuestionEditor
  question={question}
  onChange={(updates) => updateQuestion(index, updates)}
  onRemove={() => removeQuestion(index)}
/>
```

### Composing Card Components
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {assessments.map(assessment => (
    <AssessmentCard
      key={assessment.id}
      assessment={assessment}
      resultCount={getResultCount(assessment.id)}
      onTakeTest={handleTakeTest}
      onViewResults={handleViewResults}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  ))}
</div>
```

## File Organization Rules

### When to Create a Component
Create a new component when:
1. Code is reused in 2+ places
2. Component has a clear, single responsibility
3. Component can work independently with props
4. Component makes parent more readable

### When to Create a Page
Create a new page when:
1. It's a distinct screen/view in the app
2. It has its own URL/route (if using routing)
3. It manages its own state for that view
4. It's a top-level navigation destination

### Component vs. Page
**Component**: Reusable, prop-driven, focused
**Page**: Top-level view, manages state, composes components

## Directory Structure at a Glance
```
src/
├── pages/              # Full screens
│   ├── HomePage.tsx
│   ├── TakeTestPage.tsx
│   ├── ResultsPage.tsx
│   └── index.ts
├── components/         # Reusable pieces
│   ├── ui/            # Base UI components
│   ├── PageHeader.tsx
│   ├── QuestionInput.tsx
│   ├── QuestionEditor.tsx
│   ├── AssessmentCard.tsx
│   ├── AssessmentDialog.tsx
│   ├── TestResultCard.tsx
│   ├── TimeSeriesChart.tsx
│   └── index.ts
├── lib/               # Utilities & types
│   ├── types.ts
│   └── utils.ts
└── App.tsx           # Main app component
```

## Styling Guidelines

### Responsive Classes
```tsx
// Mobile-first responsive design
className="text-sm sm:text-base lg:text-lg"
className="px-4 sm:px-6 lg:px-8"
className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
```

### Common Utilities
```tsx
// Spacing
"space-y-4"          // Vertical spacing
"gap-3 sm:gap-4"     // Grid/flex gap

// Layout
"flex items-center justify-between"
"min-h-screen bg-background"
"max-w-6xl mx-auto"

// Interactive
"hover:bg-accent/50 transition-colors"
"cursor-pointer"
```

## TypeScript Types

### Core Types
```typescript
type QuestionType = 'scale' | 'text' | 'yes-no'

interface Question {
  id: string
  text: string
  type: QuestionType
  scaleMin?: number
  scaleMax?: number
}

interface Assessment {
  id: string
  title: string
  description: string
  questions: Question[]
  createdAt: number
  updatedAt: number
}

interface TestResponse {
  questionId: string
  value: string | number
}

interface TestResult {
  id: string
  assessmentId: string
  timestamp: number
  responses: TestResponse[]
}
```

## Tips

1. **Always use the index imports** for cleaner code
2. **Keep components small** - if it's getting long, extract sub-components
3. **Props over context** - pass data explicitly for better testability
4. **Consistent naming** - Pages end with "Page", Cards with "Card"
5. **Mobile-first** - Use responsive classes (sm:, md:, lg:)

## For More Information

- **ARCHITECTURE.md** - Detailed architecture documentation
- **REFACTORING_SUMMARY.md** - What changed and why
- **Component code** - All components have clear TypeScript interfaces
