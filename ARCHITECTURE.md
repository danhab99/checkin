# Component Architecture

This document describes the refactored component architecture of the habit tracker application.

## Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── AssessmentCard.tsx       # Card for displaying assessments
│   ├── AssessmentDialog.tsx     # Dialog for creating/editing assessments
│   ├── PageHeader.tsx           # Reusable page header with back button
│   ├── QuestionEditor.tsx       # Editor for individual questions in forms
│   ├── QuestionInput.tsx        # Input component for different question types
│   ├── TestResultCard.tsx       # Card for displaying test results
│   ├── TimeSeriesChart.tsx      # D3 chart component for visualizing data
│   └── index.ts                 # Component exports
│
├── pages/              # Page-level components
│   ├── HomePage.tsx            # Main dashboard with assessment list
│   ├── TakeTestPage.tsx        # Page for taking a test
│   ├── ResultsPage.tsx         # Page for viewing test results
│   └── index.ts                # Page exports
│
├── lib/                # Utilities and types
│   ├── types.ts                # TypeScript type definitions
│   └── utils.ts                # Utility functions
│
└── App.tsx             # Main application component
```

## Component Categories

### Pages
Pages are complete views that represent different screens in the application:
- **HomePage**: Lists all assessments with options to create, edit, delete, take tests, and view results
- **TakeTestPage**: Full-page interface for taking an assessment
- **ResultsPage**: Full-page interface for viewing assessment results with charts and history

### Reusable Components

#### Layout Components
- **PageHeader**: Standardized header with title, subtitle, back button, and action slots

#### Question Components
- **QuestionInput**: Renders the appropriate input type (scale, yes/no, text) based on question type
- **QuestionEditor**: Form for editing question properties (text, type, scale range)

#### Display Components
- **AssessmentCard**: Card showing assessment info with action buttons
- **TestResultCard**: Card displaying a single test result with all responses
- **TimeSeriesChart**: D3-based chart for visualizing scale questions over time

#### Dialog Components
- **AssessmentDialog**: Modal dialog for creating or editing assessments

## Component Design Principles

### 1. Single Responsibility
Each component has a clear, focused purpose:
- `QuestionInput` only handles rendering the input for a question
- `PageHeader` only handles the header layout
- Components don't mix layout and business logic

### 2. Composition Over Inheritance
Complex components are built by composing smaller components:
```tsx
<ResultsPage>
  <PageHeader />
  <TestResultCard />
  <TimeSeriesChart />
</ResultsPage>
```

### 3. Props Over Context
Components receive data through props for better testability and clarity:
```tsx
<QuestionInput
  question={question}
  value={value}
  onChange={handleChange}
/>
```

### 4. Separation of Concerns
- **Pages** handle routing and state management
- **Components** handle rendering and user interactions
- **lib/types.ts** defines data structures
- **App.tsx** manages global state and navigation

## Usage Examples

### Using QuestionInput
```tsx
import { QuestionInput } from '@/components'

<QuestionInput
  question={question}
  value={responses[question.id]}
  onChange={(value) => handleChange(question.id, value)}
/>
```

### Using PageHeader
```tsx
import { PageHeader } from '@/components'

<PageHeader
  title="Assessment Results"
  subtitle={`${results.length} total results`}
  onBack={() => navigate('/')}
  actions={<Button>Export</Button>}
/>
```

### Creating a New Page
```tsx
import { PageHeader } from '@/components'

export function MyNewPage({ onBack }) {
  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="My New Page"
        onBack={onBack}
      />
      {/* Page content */}
    </div>
  )
}
```

## Benefits of This Architecture

1. **Maintainability**: Easy to locate and update specific functionality
2. **Reusability**: Components can be used in multiple contexts
3. **Testability**: Components can be tested in isolation
4. **Scalability**: Easy to add new pages or components without affecting existing code
5. **Developer Experience**: Clear structure makes onboarding easier

## Future Enhancements

Consider these improvements:
- Add Storybook for component documentation
- Implement unit tests for each component
- Create custom hooks for shared logic
- Add error boundaries for better error handling
- Implement lazy loading for pages
