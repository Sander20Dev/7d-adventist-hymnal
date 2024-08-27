import { TextColor } from '@/app/lib/types'
import clsx from 'clsx'
import { useContext, useState, useRef } from 'react'
import { GeneralProvider } from '../provider'

export function Button({
  label,
  className,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  label?: string
}) {
  const { mobile } = useContext(GeneralProvider)

  if (mobile || !label) {
    return (
      <div className='relative w-fit h-fit'>
        <button className={clsx(className)} {...props} aria-label={label} />
      </div>
    )
  }

  return <TooltipButton {...{ label, className, ...props }} />
}

function TooltipButton({
  label,
  className,
  ...props
}: React.HTMLAttributes<HTMLButtonElement> & {
  label: string
}) {
  const [tooltipStyle, setTooltipStyle] = useState<{
    left?: string
    right?: string
  }>({})
  const buttonRef = useRef<HTMLButtonElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const hover = useRef<boolean>(false)
  const { textColor } = useContext(GeneralProvider)

  const handleMouseOver = () => {
    if (!hover.current && buttonRef.current && tooltipRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const tooltipRect = tooltipRef.current.getBoundingClientRect()

      const left = buttonRect.width / 2 - tooltipRect.width / 2

      const relativeLeft = buttonRect.left + left

      // Ajustes para no salir de la pantalla
      if (relativeLeft + tooltipRect.width + 8 > window.innerWidth) {
        setTooltipStyle({
          right: `0`,
        })
      } else if (relativeLeft >= 0) {
        setTooltipStyle({
          left: `${relativeLeft < 8 ? 8 - buttonRect.left : left}px`,
        })
      } else {
        setTooltipStyle({
          left: `0`,
        })
      }

      hover.current = true
    }
  }

  return (
    <div
      className={clsx('w-fit h-fit relative [&:hover>div]:block', className)}>
      <button
        ref={buttonRef}
        aria-label={label}
        {...props}
        onMouseOver={handleMouseOver}
        onMouseLeave={() => (hover.current = false)}
      />
      <div
        ref={tooltipRef}
        style={tooltipStyle}
        role='tooltip'
        className={clsx(
          'absolute z-10 -top-full -translate-y-2 bg-backdrop border border-gray-200 p-base rounded-md text-nowrap',
          {
            hidden: true,
          },
          {
            'bg-white': textColor === TextColor.Black,
            'bg-black': textColor === TextColor.White,
          }
        )}>
        {label}
      </div>
    </div>
  )
}
