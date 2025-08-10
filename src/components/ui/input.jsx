import React from 'react'
export function Input({ className='', ...props }) {
  return <input className={`w-full rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-500 ${className}`} {...props} />
}
