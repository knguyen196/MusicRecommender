import React from 'react'

const buttonVariants = {
  default: 'bg-foreground text-background hover:opacity-90',
  ghost: 'hover:bg-muted/60 text-muted-foreground hover:text-foreground',
  outline: 'border border-border hover:bg-muted/60',
}

const buttonSizes = {
  default: 'px-4 py-2',
  sm: 'px-3 py-1.5 text-sm',
  lg: 'px-6 py-3 text-lg',
}

export function Button({ 
  children, 
  className = '', 
  variant = 'default', 
  size = 'default',
  ...props 
}) {
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-lg
        font-medium transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-foreground/20
        disabled:opacity-50 disabled:pointer-events-none
        ${buttonVariants[variant] || buttonVariants.default}
        ${buttonSizes[size] || buttonSizes.default}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  )
}

