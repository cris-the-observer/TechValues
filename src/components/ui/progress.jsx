import React from 'react'
export function Progress({ value=0, className='' }) {
  return (
    <div className={`w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden ${className}`}>
      <div className="h-2 bg-slate-900 dark:bg-slate-300" style={{width: `${Math.max(0, Math.min(100, value))}%`}} />
    </div>
  )
}
