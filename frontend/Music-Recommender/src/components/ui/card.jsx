import React from 'react'

export function Card({ children, className = '', ...props }) {
  return (
    <div
      className={`
        rounded-xl border border-border bg-card text-card-foreground
        shadow-sm
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div
      className={`
        p-6
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  )
}

