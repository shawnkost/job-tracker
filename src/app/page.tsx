import {
  Header,
  JobTable,
  CreateApplication,
  ApplicationsOverTime,
  ApplicationStatus,
  SalaryHistogram,
} from "./_components";
import { auth } from "~/server/auth";
import { redirect } from "next/navigation";

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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ApplicationsOverTime />
          <ApplicationStatus />
          <SalaryHistogram />
        </div>
        <JobTable />
      </main>
    </>
  );
}
