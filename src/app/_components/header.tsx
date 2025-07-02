import Link from "next/link";
import { auth } from "~/server/auth";
import Image from "next/image";

export async function Header() {
  const session = await auth();

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

      {/* TODO: Add sign-out dropdown */}
      {session?.user.image && session.user.name && (
        <Image
          className="border-border h-10 w-10 cursor-pointer rounded-full border object-cover"
          src={session.user.image}
          alt={session.user.name}
          width={100}
          height={100}
          priority={true}
        />
      )}
    </header>
  );
}
