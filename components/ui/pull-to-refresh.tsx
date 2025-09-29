import React, { useState, useEffect, useRef } from 'react'
import { Loader2 } from 'lucide-react'

interface PullToRefreshProps {
  onRefresh: () => Promise<void>
  children: React.ReactNode
}

export function PullToRefresh({ onRefresh, children }: PullToRefreshProps) {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const startY = useRef<number | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleTouchStart = (e: TouchEvent) => {
      if (container.scrollTop === 0) {
        startY.current = e.touches[0].clientY
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (startY.current !== null) {
        const currentY = e.touches[0].clientY
        const distance = currentY - startY.current
        if (distance > 0) {
          setIsPulling(true)
          setPullDistance(distance)
          e.preventDefault()
        }
      }
    }

    const handleTouchEnd = () => {
      if (isPulling && pullDistance > 50) {
        onRefresh().then(() => {
          setIsPulling(false)
          setPullDistance(0)
        })
      } else {
        setIsPulling(false)
        setPullDistance(0)
      }
      startY.current = null
    }

    container.addEventListener('touchstart', handleTouchStart)
    container.addEventListener('touchmove', handleTouchMove)
    container.addEventListener('touchend', handleTouchEnd)

    return () => {
      container.removeEventListener('touchstart', handleTouchStart)
      container.removeEventListener('touchmove', handleTouchMove)
      container.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isPulling, pullDistance, onRefresh])

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {isPulling && (
        <div
          className="absolute top-0 left-0 w-full flex justify-center items-center"
          style={{ height: `${pullDistance}px` }}
        >
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}
      <div style={{ transform: `translateY(${pullDistance}px)` }}>
        {children}
      </div>
    </div>
  )
}
