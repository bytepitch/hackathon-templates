import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Label } from '@/shared/ui/label';
import { useCreateItem } from './api';

const schema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
});

type FormValues = z.infer<typeof schema>;

export function CreateItemForm() {
  const createItem = useCreateItem();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  const onSubmit = handleSubmit((values) =>
    createItem.mutate(values, {
      onSuccess: (item) => {
        reset();
        toast.success(`Added "${item.name}"`);
      },
    }),
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-2" noValidate>
      <Label htmlFor="item-name">Name</Label>
      <div className="flex gap-2">
        <Input
          id="item-name"
          placeholder="Coffee"
          aria-invalid={errors.name ? true : undefined}
          {...register('name')}
        />
        <Button type="submit" disabled={createItem.isPending}>
          {createItem.isPending ? 'Adding…' : 'Add'}
        </Button>
      </div>
      {errors.name && (
        <p className="text-sm text-destructive">{errors.name.message}</p>
      )}
    </form>
  );
}
