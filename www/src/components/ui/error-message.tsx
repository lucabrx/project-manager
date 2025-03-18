import { cn } from '~/lib/utils';

export function ErrorMessage({
  message,
  className,
}: {
  message: string;
  className?: string;
}) {
  return (
    <span className={cn('text-destructive text-xs font-medium', className)}>
      {message}
    </span>
  );
}
