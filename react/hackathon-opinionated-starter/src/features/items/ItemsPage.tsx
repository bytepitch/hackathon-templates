import { Trash2Icon } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card';
import { Skeleton } from '@/shared/ui/skeleton';
import { useDeleteItem, useItems, type Item } from './api';
import { CreateItemForm } from './CreateItemForm';

export function ItemsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Items</CardTitle>
        <CardDescription>
          An example feature that calls the API's <code>/api/items</code>{' '}
          endpoints. Copy this folder to start a new feature.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <CreateItemForm />
        <ItemsList />
      </CardContent>
    </Card>
  );
}

function ItemsList() {
  const { data: items, isPending, isError, error, refetch } = useItems();

  if (isPending) {
    return (
      <div className="flex flex-col gap-2" aria-label="Loading items">
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
        <Skeleton className="h-10" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-between gap-4 rounded-lg border border-destructive/40 p-4 text-sm">
        <p>Couldn't load items: {error.message}</p>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          Try again
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No items yet. Add one above.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y rounded-lg border">
      {items.map((item) => (
        <ItemRow key={item.id} item={item} />
      ))}
    </ul>
  );
}

function ItemRow({ item }: { item: Item }) {
  const deleteItem = useDeleteItem();

  return (
    <li className="flex items-center justify-between gap-4 px-4 py-2">
      <div>
        <p className="font-medium">{item.name}</p>
        <p className="text-xs text-muted-foreground">
          Added {new Date(item.createdAt).toLocaleString()}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`Delete ${item.name}`}
        disabled={deleteItem.isPending}
        onClick={() => deleteItem.mutate(item.id)}
      >
        <Trash2Icon />
      </Button>
    </li>
  );
}
