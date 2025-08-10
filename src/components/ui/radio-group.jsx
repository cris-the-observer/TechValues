import React, { createContext, useContext, useId } from 'react'
const Ctx = createContext({ name: '', value: undefined, onChange: ()=>{} })
export function RadioGroup({ value, onValueChange, children, className='' }) {
  const name = useId()
  return (
    <Ctx.Provider value={{ name, value, onChange: (v)=>onValueChange?.(v) }}>
      <div className={className}>{children}</div>
    </Ctx.Provider>
  )
}
export function RadioGroupItem({ id, value }) {
  const { name, value: current, onChange } = useContext(Ctx)
  return (
    <input
      id={id}
      type="radio"
      name={name}
      value={value}
      checked={String(current) === String(value)}
      onChange={(e)=>onChange(e.target.value)}
      className="hidden"
    />
  )
}
