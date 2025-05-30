import { Header } from "./_components/header";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { JobTable } from "./_components";
import { CreateApplication } from "./_components/dialog";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    return redirect("/api/auth/signin");
  }

  return (
    <>
      <Header />
      <main className="p-8">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-primary mb-4 text-3xl">
            Good Morning {session.user.name} 👋
          </h1>
          <CreateApplication />
        </div>
        <JobTable />
      </main>
    </>
  );
}
