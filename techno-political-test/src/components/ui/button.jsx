import React from 'react'
const base = "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium transition"
const variants = {
  default: "bg-slate-900 text-white hover:opacity-95 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600",
  ghost: "bg-transparent text-slate-900 hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-slate-800",
}
export function Button({ variant='default', className='', ...props }) {
  return <button className={`${base} ${variants[variant]||variants.default} ${className}`} {...props} />
}
