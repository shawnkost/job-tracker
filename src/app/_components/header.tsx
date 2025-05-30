import Link from "next/link";

export function Header() {
  return (
    <header className="bg-surface text-primary mb-4 flex items-center justify-between p-8">
      <div className="flex items-center gap-4">
        <h3 className="text-2xl font-bold">Job Tracker</h3>
        <nav className="text-muted">
          <Link className="mr-2" href="/">
            Home
          </Link>
          <Link href="/board">Board</Link>
        </nav>
      </div>
    </header>
  );
}
