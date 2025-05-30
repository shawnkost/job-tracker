import { api } from "~/trpc/server";

export async function JobTable() {
  const userQuery = await api.application.getAll();

  return (
    <section>
      <div className="border-border bg-surface overflow-x-auto rounded-lg border shadow-md">
        <table className="text-primary w-full border text-left">
          <thead className="bg-surface border-border border-b">
            <tr>
              <th className="hover:text-accent cursor-pointer px-6 py-3 font-medium transition-colors duration-200">
                <div className="flex items-center gap-2">
                  Company
                  <span className="text-muted"></span>
                </div>
              </th>
              <th className="hover:text-accent cursor-pointer px-6 py-3 font-medium transition-colors duration-200">
                <div className="flex items-center gap-2">
                  Position
                  <span className="text-muted"></span>
                </div>
              </th>
              <th className="hover:text-accent cursor-pointer px-6 py-3 font-medium transition-colors duration-200">
                <div className="flex items-center gap-2">
                  Status
                  <span className="text-muted"></span>
                </div>
              </th>
              <th className="hover:text-accent cursor-pointer px-6 py-3 font-medium transition-colors duration-200">
                <div className="flex items-center gap-2">
                  Date
                  <span className="text-muted"></span>
                </div>
              </th>
              <th className="hover:text-accent cursor-pointer px-6 py-3 font-medium transition-colors duration-200">
                <div className="flex items-center gap-2">
                  Salary
                  <span className="text-muted"></span>
                </div>
              </th>
              <th className="hover:text-accent cursor-pointer px-6 py-3 font-medium transition-colors duration-200">
                <div className="flex items-center gap-2">
                  Location
                  <span className="text-muted"></span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody id="app-table-body">
            {userQuery.map((application) => (
              <tr key={application.id}>
                <td className="px-6 py-4">{application.company}</td>
                <td className="px-6 py-4">{application.position}</td>
                <td className="px-6 py-4">
                  {application.status
                    ? application.status.charAt(0).toUpperCase() +
                      application.status.slice(1).toLowerCase()
                    : ""}
                </td>
                <td className="px-6 py-4">
                  {application.appliedDate
                    ? new Intl.DateTimeFormat("en-US").format(
                        application.appliedDate,
                      )
                    : ""}
                </td>
                <td className="px-6 py-4">{application.salary}</td>
                <td className="px-6 py-4">{application.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
