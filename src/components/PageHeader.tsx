import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from '@phosphor-icons/react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  onBack?: () => void
  actions?: ReactNode
  sticky?: boolean
}

export function PageHeader({ title, subtitle, onBack, actions, sticky = true }: PageHeaderProps) {
  return (
    <div className={`${sticky ? 'sticky top-0 z-10' : ''} bg-background border-b px-4 py-3 sm:px-6 sm:py-4`}>
      <div className="max-w-5xl mx-auto flex items-center gap-3">
        {onBack && (
          <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0 h-10 w-10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-semibold truncate">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>
    </div>
  )
}
