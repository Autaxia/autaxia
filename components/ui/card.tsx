import { cn } from '@/lib/utils'

export function Card({ className, ...props }: any) {
  return (
    <div
      className={cn(`
        rounded-2xl border border-white/10
        bg-gradient-to-b from-white/5 to-transparent
        p-5 transition-all duration-300
        hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/10
      `, className)}
      {...props}
    />
  )
}