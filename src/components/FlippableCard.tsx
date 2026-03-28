'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'

interface FlippableCardProps {
  front: React.ReactNode
  back: React.ReactNode
  className?: string
  frontClassName?: string
  backClassName?: string
}

export function FlippableCard({ 
  front, 
  back, 
  className,
  frontClassName,
  backClassName 
}: FlippableCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div 
      className={cn("perspective-1000 cursor-pointer", className)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={cn(
          "relative w-full h-full transition-transform duration-700 preserve-3d",
          isFlipped && "rotate-y-180"
        )}
      >
        {/* Front */}
        <div 
          className={cn(
            "absolute inset-0 w-full h-full backface-hidden",
            frontClassName
          )}
        >
          {front}
        </div>
        
        {/* Back */}
        <div 
          className={cn(
            "absolute inset-0 w-full h-full backface-hidden rotate-y-180",
            backClassName
          )}
        >
          {back}
        </div>
      </div>
    </div>
  )
}
