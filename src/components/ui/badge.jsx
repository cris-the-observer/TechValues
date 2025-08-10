import React from 'react'
export function Badge({ variant='default', className='', ...props }) {
  const base = "inline-flex items-center rounded-full px-2 py-1 text-xs"
  const variants = {
    default: "bg-slate-900 text-white",
    secondary: "bg-slate-100 text-slate-800",
    outline: "border border-slate-300 text-slate-700",
  }
  return <span className={`${base} ${variants[variant]||variants.default} ${className}`} {...props} />
}
