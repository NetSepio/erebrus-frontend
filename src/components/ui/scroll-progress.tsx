"use client"

import type * as React from "react"
import { motion, useScroll, useSpring } from "framer-motion"

interface ScrollProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  position?: "top" | "bottom"
  color?: string
  height?: number
  opacity?: number
  className?: string
}

export const ScrollProgress = ({
  position = "top",
  color = "#3b82f6",
  height = 4,
  opacity = 0.8,
  className,
  ...props
}: ScrollProgressProps) => {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      className={className}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        [position]: 0,
        height,
        background: color,
        opacity,
        transformOrigin: "0%",
        zIndex: 50,
        scaleX,
      }}
      {...(props as React.ComponentPropsWithoutRef<typeof motion.div>)}
    />
  )
}
