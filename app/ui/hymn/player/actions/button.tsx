import clsx from 'clsx'

export function Button({
  label,
  noMobile,
  className,
  ...props
}: React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & {
  label?: string
  noMobile?: boolean
}) {
  return (
    <button
      aria-label={label}
      title={label}
      {...props}
      className={clsx(noMobile && 'max-sm:hidden', className)}
    />
  )
}
