import { NavLink, Outlet } from 'react-router';
import { HealthBadge } from '@/features/health/HealthBadge';
import { cn } from '@/shared/lib/utils';

const links = [
  { to: '/', label: 'Home' },
  { to: '/items', label: 'Items' },
];

export function RootLayout() {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="border-b">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <nav className="flex items-center gap-4">
            <span className="font-heading font-semibold">
              Bytepitch hackathon
            </span>
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end
                className={({ isActive }) =>
                  cn(
                    'text-sm text-muted-foreground hover:text-foreground',
                    isActive && 'text-foreground',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <HealthBadge />
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
