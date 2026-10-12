import { Link } from 'react-router';

export function NotFound() {
  return (
    <section className="flex flex-col gap-2">
      <h1 className="font-heading text-2xl font-semibold">Page not found</h1>
      <Link to="/" className="text-sm underline">
        Go home
      </Link>
    </section>
  );
}
