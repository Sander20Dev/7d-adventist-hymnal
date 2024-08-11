import clsx from 'clsx'

interface IconButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export default function IconButton({
  children,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      className={clsx(
        'flex gap-2 rounded-full p-4 transition outline-none',
        {
          'bg-gray-200 hover:bg-gray-300':
            className == null || !className.includes('bg-'),
        },
        className
      )}
      {...props}>
      {children}
    </button>
  )
}
