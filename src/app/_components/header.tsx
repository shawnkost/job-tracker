import { auth } from "~/server/auth";
import Image from "next/image";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

export async function Header() {
  const session = await auth();

  return (
    <header className="bg-surface text-primary mb-4 flex items-center justify-between p-8">
      <div className="flex items-center gap-4">
        <h3 className="text-2xl font-bold">Job Tracker</h3>
      </div>

      {/* TODO: Add sign-out dropdown */}
      {session?.user.image && session.user.name && (
        <Popover className="relative">
          <PopoverButton className="focus:ring-accent focus:ring-offset-background rounded-full focus:ring-2 focus:ring-offset-2 focus:outline-none">
            <Image
              className="border-border hover:ring-accent hover:ring-offset-background h-10 w-10 cursor-pointer rounded-full border object-cover transition-all duration-200 hover:ring-2 hover:ring-offset-2"
              src={session.user.image}
              alt={session.user.name}
              width={100}
              height={100}
              priority={true}
            />
          </PopoverButton>
          <PopoverPanel className="bg-surface border-border absolute right-0 z-10 mt-2 w-48 rounded-lg border p-2 shadow-lg">
            <div className="py-1">
              <div className="border-border border-b px-3 py-2">
                <p className="text-primary text-sm font-medium">
                  {session.user.name}
                </p>
                <p className="text-muted truncate text-xs">
                  {session.user.email}
                </p>
              </div>
              <button className="text-primary hover:bg-border hover:text-accent mt-1 w-full rounded-md px-3 py-2 text-left text-sm transition-colors duration-150">
                Sign Out
              </button>
            </div>
          </PopoverPanel>
        </Popover>
      )}
    </header>
  );
}
