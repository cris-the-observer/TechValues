import React from 'react'
export function Card({ className='', ...props }) {
  return <div className={`bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl ${className}`} {...props} />
}
export function CardHeader({ className='', ...props }) {
  return <div className={`px-4 pt-4 ${className}`} {...props} />
}
export function CardTitle({ className='', ...props }) {
  return <h2 className={`text-xl font-semibold text-slate-900 dark:text-slate-100 ${className}`} {...props} />
}
export function CardContent({ className='', ...props }) {
  return <div className={`px-4 pb-4 ${className}`} {...props} />
}
