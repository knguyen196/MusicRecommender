import React, { forwardRef } from 'react'

export const Input = forwardRef(({ className = '', type = 'text', ...props }, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={`
        flex w-full rounded-lg border border-border bg-background
        px-3 py-2 text-sm
        placeholder:text-muted-foreground/60
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20
        disabled:cursor-not-allowed disabled:opacity-50
        transition-colors
        ${className}
      `}
      {...props}
    />
  )
})

Input.displayName = 'Input'

