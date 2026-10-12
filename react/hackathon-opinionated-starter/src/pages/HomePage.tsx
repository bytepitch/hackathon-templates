import { Link } from 'react-router';
import { Button } from '@/shared/ui/button';

export function HomePage() {
  return (
    <section className="flex flex-col gap-4">
      <h1 className="font-heading text-3xl font-semibold">Hackathon starter</h1>
      <p className="text-muted-foreground">
        Edit <code>src/pages/HomePage.tsx</code> and save to see your changes.
        Routes live in <code>src/routes.tsx</code>.
      </p>
      <div>
        <Button asChild>
          <Link to="/items">See the example feature</Link>
        </Button>
      </div>
    </section>
  );
}
