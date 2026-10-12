import { useQuery } from '@tanstack/react-query';
import { api, unwrap } from '@/shared/api/client';
import { cn } from '@/shared/lib/utils';

// Shows whether the API is reachable, checking again every 10 seconds
export function HealthBadge() {
  const { isSuccess, isPending } = useQuery({
    queryKey: ['health'],
    queryFn: () => unwrap(api.GET('/api/health')),
    refetchInterval: 10_000,
    retry: false,
  });

  const label = isPending
    ? 'Checking API…'
    : isSuccess
      ? 'API online'
      : 'API offline';

  return (
    <span className="flex items-center gap-2 text-sm text-muted-foreground">
      <span
        aria-hidden
        className={cn(
          'size-2 rounded-full',
          isPending && 'bg-muted-foreground',
          !isPending && (isSuccess ? 'bg-green-500' : 'bg-destructive'),
        )}
      />
      {label}
    </span>
  );
}
