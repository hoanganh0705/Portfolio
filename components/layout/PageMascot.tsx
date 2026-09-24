'use client'

import { useEffect, useRef, useState } from 'react'

const DIRECTIONS = [
  'up-left',
  'up',
  'up-right',
  'left',
  'center',
  'right',
  'down-left',
  'down',
  'down-right',
] as const

const REACTIONS = [
  'blink',
  'heart',
  'sparkle',
  'surprised',
  'wink',
  'bashful',
  'sleepy',
  'dizzy',
  'delighted',
] as const

const CLOCKWISE = [
  'right',
  'down-right',
  'down',
  'down-left',
  'left',
  'up-left',
  'up',
  'up-right',
] as const

type Direction = (typeof DIRECTIONS)[number]
type Reaction = (typeof REACTIONS)[number] | null

const SECTOR = (Math.PI * 2) / CLOCKWISE.length
const HYSTERESIS = 0.12
const DEAD_ZONE = 70

const PAYOFFS = ['heart', 'sparkle', 'delighted'] as const

const BOOP_PAYOFF = 120
const BOOP_END = 560

const SQUASH_MS = 420

const DIZZY_AFTER = 4
const DIZZY_WINDOW = 1600
const DIZZY_END = 1100

const SQUASH: Keyframe[] = [
  {
    transform: 'scale(1, 1)',
    easing: 'ease-in',
  },
  {
    transform: 'scale(1.10, 0.86)',
    offset: 0.18,
    easing: 'ease-out',
  },
  {
    transform: 'scale(0.95, 1.08)',
    offset: 0.45,
    easing: 'ease-in-out',
  },
  {
    transform: 'scale(1.03, 0.97)',
    offset: 0.72,
    easing: 'ease-in-out',
  },
  {
    transform: 'scale(1, 1)',
  },
]

function cell(index: number) {
  return {
    backgroundPosition: `${(index % 3) * 50}% ${
      Math.floor(index / 3) * 50
    }%`,
  }
}

function wrap(angle: number) {
  return Math.atan2(Math.sin(angle), Math.cos(angle))
}

const layer: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  backgroundSize: '300% 300%',
  backgroundRepeat: 'no-repeat',
}
interface PageMascotProps {
  className?: string
}

export default function PageMascot({
  className,
}: PageMascotProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const squashRef = useRef<HTMLSpanElement>(null)

  const timersRef = useRef<number[]>([])

  const boopsRef = useRef({
    count: 0,
    at: 0,
  })

  const [direction, setDirection] =
    useState<Direction>('center')

  const [reaction, setReaction] = useState<Reaction>(null)
  useEffect(() => {
    if (
      !window.matchMedia(
        '(hover: hover) and (pointer: fine)',
      ).matches
    ) {
      return
    }

    let sector = -1

    let pointer: {
      x: number
      y: number
    } | null = null

    const aim = () => {
      const button = buttonRef.current

      if (!button || !pointer) {
        return
      }

      const box = button.getBoundingClientRect()

      const dx = pointer.x - (box.left + box.width / 2)

      const dy = pointer.y - (box.top + box.height / 2)

      if (Math.hypot(dx, dy) < DEAD_ZONE) {
        sector = -1
        setDirection('center')
        return
      }

      const angle = Math.atan2(dy, dx)

      if (
        sector !== -1 &&
        Math.abs(wrap(angle - sector * SECTOR)) <
          SECTOR / 2 + HYSTERESIS
      ) {
        return
      }

      sector =
        (Math.round(angle / SECTOR) + CLOCKWISE.length) %
        CLOCKWISE.length

      setDirection(CLOCKWISE[sector])
    }

    const onPointerMove = (event: PointerEvent) => {
      pointer = {
        x: event.clientX,
        y: event.clientY,
      }

      aim()
    }

    const onScroll = () => {
      aim()
    }

    window.addEventListener('pointermove', onPointerMove, {
      passive: true,
    })

    window.addEventListener('scroll', onScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener(
        'pointermove',
        onPointerMove,
      )

      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  useEffect(() => {
    return () => {
      timersRef.current.forEach(window.clearTimeout)
    }
  }, [])
  const boop = () => {
    /*
     * Cancel any previous reaction timers.
     */
    timersRef.current.forEach(window.clearTimeout)

    timersRef.current = []

    const later = (ms: number, next: Reaction) => {
      const timer = window.setTimeout(() => {
        setReaction(next)
      }, ms)

      timersRef.current.push(timer)
    }

    const now = Date.now()

    const boops = boopsRef.current

    /*
     * Count clicks occurring within DIZZY_WINDOW.
     *
     * If the previous click was more than 1600ms ago,
     * start a new sequence.
     */
    boops.count =
      now - boops.at < DIZZY_WINDOW ? boops.count + 1 : 1

    boops.at = now

    /*
     * Four quick clicks → dizzy.
     */
    if (boops.count >= DIZZY_AFTER) {
      boops.count = 0

      setReaction('dizzy')

      later(DIZZY_END, null)
    } else {
      /*
       * Every normal click starts with blink.
       */
      setReaction('blink')

      /*
       * After 120ms:
       *
       * click 1 → heart
       * click 2 → sparkle
       * click 3 → delighted
       * click 4 → dizzy
       *
       * Then the sequence repeats.
       */
      later(
        BOOP_PAYOFF,
        PAYOFFS[(boops.count - 1) % PAYOFFS.length],
      )

      /*
       * After 560ms → hide reaction.
       */
      later(BOOP_END, null)
    }

    /*
     * Respect prefers-reduced-motion.
     */
    if (
      window.matchMedia('(prefers-reduced-motion: reduce)')
        .matches
    ) {
      return
    }

    /*
     * Original squash animation.
     */
    squashRef.current?.animate(SQUASH, {
      duration: SQUASH_MS,
      easing: 'linear',
    })
  }

  return (
    <button
      ref={buttonRef}
      type='button'
      onClick={boop}
      aria-label='Boop the Anh'
      className={`
        relative block
        size-14 shrink-0 sm:size-16 md:size-20
        cursor-pointer select-none
        appearance-none
        border-0 bg-transparent p-0
        transition-transform duration-200
        md:hover:-translate-y-1
        active:scale-95
        ${className ?? ''}
      `}
    >
      <span
        ref={squashRef}
        style={{
          position: 'relative',
          display: 'block',
          width: '100%',
          height: '100%',
          transformOrigin: '50% 78%',
        }}
      >
        {/* Direction layer */}
        <span
          aria-hidden='true'
          style={{
            ...layer,
            backgroundImage:
              "url('/mascots/anh-directions.webp')",
            ...cell(DIRECTIONS.indexOf(direction)),
            opacity: reaction ? 0 : 1,
          }}
        />

        {/* Reaction layer */}
        <span
          aria-hidden='true'
          style={{
            ...layer,
            backgroundImage:
              "url('/mascots/anh-reactions.webp')",
            ...cell(REACTIONS.indexOf(reaction ?? 'blink')),
            opacity: reaction ? 1 : 0,
          }}
        />
      </span>
    </button>
  )
}
