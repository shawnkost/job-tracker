"use client";

import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  Field,
  Input,
  Label,
  Select,
  Textarea,
} from "@headlessui/react";
import { api } from "~/trpc/react";
import type { Application } from "@prisma/client";

interface EditApplicationProps {
  application: Application;
  open: boolean;
  onClose: () => void;
}

export function EditApplicationDialog({
  application,
  open,
  onClose,
}: EditApplicationProps) {
  const utils = api.useUtils();

  const updateApplication = api.application.update.useMutation({
    onSuccess: async () => {
      await utils.application.getAll.invalidate();
      onClose();
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);

      const input = {
        id: application.id,
        company: formData.get("company") as string,
        position: formData.get("position") as string,
        appliedDate: new Date(
          (formData.get("appliedDate") as string) + "T00:00:00",
        ),
        responseDate: formData.get("responseDate")
          ? new Date((formData.get("responseDate") as string) + "T00:00:00")
          : undefined,
        firstInterviewDate: formData.get("firstInterviewDate")
          ? new Date(
              (formData.get("firstInterviewDate") as string) + "T00:00:00",
            )
          : undefined,
        offerDate: formData.get("offerDate")
          ? new Date((formData.get("offerDate") as string) + "T00:00:00")
          : undefined,
        rejectionDate: formData.get("rejectionDate")
          ? new Date((formData.get("rejectionDate") as string) + "T00:00:00")
          : undefined,
        status: formData.get("status") as
          | "applied"
          | "phone_screen"
          | "technical"
          | "final_round"
          | "offer"
          | "rejected",
        link: formData.get("link") as string,
        salaryMin: formData.get("salaryMin")
          ? parseInt(formData.get("salaryMin") as string)
          : undefined,
        salaryMax: formData.get("salaryMax")
          ? parseInt(formData.get("salaryMax") as string)
          : undefined,
        location: formData.get("location") as string,
        description: formData.get("description") as string,
      };

      await updateApplication.mutateAsync(input);
    } catch (error) {
      console.error(error);
    }
  }

  const formatDateForInput = (date: Date | null) => {
    if (!date) return "";
    // Format date in local timezone to avoid timezone conversion issues
    const localDate = new Date(date);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, "0");
    const day = String(localDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="text-primary fixed inset-0 flex w-screen items-center justify-center bg-black/50 p-4 font-serif">
        <DialogPanel className="bg-surface max-w-5xl space-y-3 rounded-lg p-6">
          <DialogTitle className="text-primary mb-3 text-xl">
            Edit Application
          </DialogTitle>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <Field>
                <Label className="mb-1 block text-sm">Company</Label>
                <Input
                  name="company"
                  type="text"
                  id="company"
                  defaultValue={application.company}
                  className="border-border focus:ring-accent focus:border-accent w-full rounded-md border px-3 py-1.5 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                  required
                />
              </Field>
              <Field>
                <Label className="mb-1 block text-sm">Job Title</Label>
                <Input
                  name="position"
                  type="text"
                  id="position"
                  defaultValue={application.position}
                  className="border-border focus:ring-accent focus:border-accent w-full rounded-md border px-3 py-1.5 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                  required
                />
              </Field>
              <Field>
                <Label className="mb-1 block text-sm">Status</Label>
                <Select
                  name="status"
                  id="status"
                  defaultValue={application.status ?? "applied"}
                  className="bg-surface text-primary border-border focus:ring-accent focus:border-accent w-full rounded-md border px-3 py-1.5 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                >
                  <option value="applied">Applied</option>
                  <option value="phone_screen">Phone Screen</option>
                  <option value="technical">Technical</option>
                  <option value="final_round">Final Round</option>
                  <option value="offer">Offer</option>
                  <option value="rejected">Rejected</option>
                </Select>
              </Field>
            </div>

            <div className="grid grid-cols-5 gap-4">
              <Field>
                <Label className="mb-1 block text-sm">Applied Date</Label>
                <Input
                  name="appliedDate"
                  type="date"
                  id="appliedDate"
                  defaultValue={formatDateForInput(application.appliedDate)}
                  className="border-border focus:ring-accent focus:border-accent w-full rounded-md border px-3 py-1.5 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                  required
                />
              </Field>
              <Field>
                <Label className="mb-1 block text-sm">Response Date</Label>
                <Input
                  name="responseDate"
                  type="date"
                  id="responseDate"
                  defaultValue={formatDateForInput(application.responseDate)}
                  className="border-border focus:ring-accent focus:border-accent w-full rounded-md border px-3 py-1.5 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                />
              </Field>
              <Field>
                <Label className="mb-1 block text-sm">Interview Date</Label>
                <Input
                  name="firstInterviewDate"
                  type="date"
                  id="firstInterviewDate"
                  defaultValue={formatDateForInput(
                    application.firstInterviewDate,
                  )}
                  className="border-border focus:ring-accent focus:border-accent w-full rounded-md border px-3 py-1.5 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                />
              </Field>
              <Field>
                <Label className="mb-1 block text-sm">Offer Date</Label>
                <Input
                  name="offerDate"
                  type="date"
                  id="offerDate"
                  defaultValue={formatDateForInput(application.offerDate)}
                  className="border-border focus:ring-accent focus:border-accent w-full rounded-md border px-3 py-1.5 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                />
              </Field>
              <Field>
                <Label className="mb-1 block text-sm">Rejection Date</Label>
                <Input
                  name="rejectionDate"
                  type="date"
                  id="rejectionDate"
                  defaultValue={formatDateForInput(application.rejectionDate)}
                  className="border-border focus:ring-accent focus:border-accent w-full rounded-md border px-3 py-1.5 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <Label className="mb-1 block text-sm">Post URL</Label>
                <Input
                  name="link"
                  type="url"
                  id="link"
                  defaultValue={application.link ?? ""}
                  className="border-border focus:ring-accent focus:border-accent text-link w-full rounded-md border px-3 py-1.5 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                />
              </Field>
              <Field>
                <Label className="mb-1 block text-sm">Location</Label>
                <Input
                  type="text"
                  id="location"
                  name="location"
                  defaultValue={application.location ?? ""}
                  className="border-border focus:ring-accent focus:border-accent w-full rounded-md border px-3 py-1.5 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Field>
                <Label className="mb-1 block text-sm">Salary Min</Label>
                <div className="relative">
                  <span className="text-text-secondary absolute top-1/2 left-3 -translate-y-1/2 text-sm">
                    $
                  </span>
                  <Input
                    type="number"
                    id="salaryMin"
                    name="salaryMin"
                    placeholder="60000"
                    defaultValue={application.salaryMin ?? ""}
                    className="border-border focus:ring-accent focus:border-accent w-full rounded-md border px-3 py-1.5 pl-7 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                  />
                </div>
              </Field>
              <Field>
                <Label className="mb-1 block text-sm">Salary Max</Label>
                <div className="relative">
                  <span className="text-text-secondary absolute top-1/2 left-3 -translate-y-1/2 text-sm">
                    $
                  </span>
                  <Input
                    type="number"
                    id="salaryMax"
                    name="salaryMax"
                    placeholder="80000"
                    defaultValue={application.salaryMax ?? ""}
                    className="border-border focus:ring-accent focus:border-accent w-full rounded-md border px-3 py-1.5 pl-7 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                  />
                </div>
              </Field>
            </div>

            <div>
              <Field>
                <Label className="mb-1 block text-sm">Description</Label>
                <Textarea
                  name="description"
                  id="description"
                  defaultValue={application.description ?? ""}
                  className="border-border focus:ring-accent focus:border-accent min-h-[60px] w-full rounded-md border px-3 py-1.5 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                />
              </Field>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button
                onClick={onClose}
                type="button"
                className="bg-border text-text-primary hover:border-accent/30 focus:outline-link cursor-pointer rounded-md px-4 py-2 transition-all duration-200 hover:scale-[1.02] hover:brightness-125 focus:outline-2 focus:outline-offset-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateApplication.isPending}
                className="bg-accent text-text-primary focus:outline-link cursor-pointer rounded-md px-4 py-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,194,126,0.4)] hover:brightness-110 focus:outline-2 focus:outline-offset-2 disabled:opacity-50"
              >
                {updateApplication.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
