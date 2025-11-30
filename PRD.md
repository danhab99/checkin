# Planning Guide

A comprehensive habit tracker application that enables users to create custom assessments, track responses over time, and visualize progress through statistical analysis.

**Experience Qualities**:
1. **Empowering** - Users should feel in control of their self-improvement journey with flexible, personalized tracking tools
2. **Insightful** - Clear visualization of trends and patterns helps users understand their progress and make informed decisions
3. **Organized** - Clean structure separates assessment creation, taking tests, and reviewing results without overwhelming the user

**Complexity Level**: Light Application (multiple features with basic state)
  - Multiple interconnected features (questionnaire builder, test-taking interface, results tracking) with persistent state management, but no accounts or backend complexity.

## Essential Features

**Questionnaire Builder**
- Functionality: Create, edit, and delete custom assessments with multiple questions and response types
- Purpose: Enables users to track any metric they care about - mood, productivity, health symptoms, etc.
- Trigger: User clicks "Create New Assessment" button
- Progression: Click create → Enter assessment title/description → Add questions with response types (scale/text/yes-no) → Save assessment → Returns to list view
- Success criteria: Assessments persist between sessions, can be edited, and appear in the test-taking interface

**Test Taking Interface**
- Functionality: Complete saved assessments and submit responses
- Purpose: Capture data points at different times to build a historical record
- Trigger: User clicks "Take Test" button on any saved assessment
- Progression: Select assessment → Answer all questions → Submit → Timestamp and responses saved → Confirmation shown
- Success criteria: All responses saved with timestamp, validation prevents incomplete submissions, user can take same test multiple times

**Results Dashboard**
- Functionality: View individual test results and aggregate time-series statistics
- Purpose: Transform raw data into actionable insights about trends and patterns
- Trigger: User clicks "View Results" on an assessment
- Progression: Select assessment → See list of all completed tests with dates → View individual responses → See charts showing trends over time → Identify patterns
- Success criteria: Time-series charts display correctly, users can see both individual results and aggregate trends, date filtering works

**Assessment Management**
- Functionality: Edit or delete existing assessments
- Purpose: Keep assessment library relevant as goals and tracking needs evolve
- Trigger: User clicks edit/delete on an assessment card
- Progression: Click edit → Modify questions/title → Save changes | Click delete → Confirm → Assessment and associated data removed
- Success criteria: Edits persist, deletions remove all associated response data, confirmation prevents accidental deletion

## Edge Case Handling

**Empty States** - Show helpful prompts when no assessments exist or no test results are available yet
**Incomplete Submissions** - Prevent submission of partially completed assessments with clear validation messages
**Data Migration** - Handle changes to assessment structure when user edits questions after taking tests
**Missing Responses** - Display appropriate placeholders for skipped or deleted questions in historical data
**Chart Rendering** - Gracefully handle insufficient data points for meaningful statistical visualization

## Design Direction

The design should feel clinical yet approachable - like a personal research tool that takes self-improvement seriously without being intimidating. A minimal interface focuses attention on the data and insights, using purposeful color to highlight trends and patterns. The aesthetic should communicate precision and reliability.

## Color Selection

Triadic color scheme - three balanced colors representing different data states (positive trends, neutral, areas needing attention) with careful application to avoid overwhelming the analytical focus.

- **Primary Color**: Deep Teal (oklch(0.55 0.08 200)) - Communicates trust, clarity, and analytical thinking; used for primary actions and navigation
- **Secondary Colors**: Warm Slate (oklch(0.45 0.02 260)) for cards and structural elements, providing subtle containment without heaviness
- **Accent Color**: Coral (oklch(0.7 0.15 25)) for highlights, positive trends, and call-to-action buttons that need emphasis
- **Foreground/Background Pairings**: 
  - Background (White oklch(0.98 0 0)): Dark Slate text (oklch(0.25 0.02 260)) - Ratio 12.8:1 ✓
  - Card (Light Gray oklch(0.96 0 0)): Dark Slate text (oklch(0.25 0.02 260)) - Ratio 11.5:1 ✓
  - Primary (Deep Teal oklch(0.55 0.08 200)): White text (oklch(0.98 0 0)) - Ratio 5.2:1 ✓
  - Secondary (Warm Slate oklch(0.45 0.02 260)): White text (oklch(0.98 0 0)) - Ratio 7.8:1 ✓
  - Accent (Coral oklch(0.7 0.15 25)): Dark Slate text (oklch(0.25 0.02 260)) - Ratio 6.1:1 ✓
  - Muted (Cool Gray oklch(0.92 0.005 260)): Medium Gray text (oklch(0.5 0.01 260)) - Ratio 6.9:1 ✓

## Font Selection

Typography should convey precision and readability for data-heavy interfaces, with a clean sans-serif that maintains clarity at all sizes while feeling modern and professional.

- **Typographic Hierarchy**:
  - H1 (Page Titles): Inter SemiBold/32px/tight letter-spacing (-0.02em)
  - H2 (Section Headers): Inter SemiBold/24px/normal letter-spacing
  - H3 (Card Titles): Inter Medium/18px/normal letter-spacing
  - Body (Forms/Content): Inter Regular/15px/relaxed line-height (1.6)
  - Small (Metadata/Dates): Inter Regular/13px/normal letter-spacing
  - Labels (Form Fields): Inter Medium/14px/normal letter-spacing

## Animations

Motion should feel responsive and purposeful, providing clear feedback for interactions while maintaining the app's professional, analytical character. Animations guide attention without distracting from data analysis.

- **Purposeful Meaning**: Quick, snappy transitions communicate responsiveness and precision. Subtle motion on chart loading suggests data being processed and analyzed
- **Hierarchy of Movement**: Primary focus on form interactions (validation feedback, submission confirmation) and data visualization (smooth chart transitions, result card reveals)

## Component Selection

- **Components**: 
  - Card (with hover states) for assessment tiles and result summaries
  - Dialog for creating/editing assessments and confirming deletions
  - Form with Input, Textarea, Select, Radio Group for questionnaire builder and test-taking
  - Button variants (default for primary actions, outline for secondary, ghost for inline actions)
  - Tabs for switching between assessment list, results, and statistics views
  - Badge for assessment metadata (question count, last taken date)
  - Separator for visual organization between sections
  - ScrollArea for long questionnaires and result lists
  - Alert for empty states and validation messages

- **Customizations**: 
  - Custom chart components using D3 for time-series visualization (line charts for trends, bar charts for comparison)
  - Question builder component with dynamic question type selection
  - Result card component showing individual test completion with expandable details

- **States**: 
  - Buttons: Subtle scale on press, opacity change on disabled, coral accent for primary CTAs
  - Form inputs: Teal focus ring, clear error states with coral border and helper text
  - Cards: Slight elevation on hover, pressed state with scale, loading skeleton when fetching data
  - Validation: Inline error messages appear below fields with gentle shake animation

- **Icon Selection**: 
  - Plus (add question/assessment)
  - ChartLine (view statistics)
  - ClipboardText (take test)
  - Pencil (edit assessment)
  - Trash (delete)
  - Calendar (date indicators)
  - Check (submission confirmation)
  - Question (help/info states)

- **Spacing**: 
  - Page padding: p-6 (24px) on desktop, p-4 (16px) on mobile
  - Card padding: p-6 with gap-4 for internal elements
  - Form field spacing: gap-6 between field groups, gap-2 between label and input
  - Grid layouts: gap-4 for card grids
  - Button padding: px-6 py-2.5 for primary, px-4 py-2 for secondary

- **Mobile**: 
  - Stack card grids vertically on mobile (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3)
  - Dialogs become full-screen sheets on mobile for form interactions
  - Reduce page padding to p-4, maintain touch-friendly button sizes (min-h-11)
  - Charts responsive with reduced detail on smaller screens
  - Tab navigation converts to horizontal scroll on mobile
