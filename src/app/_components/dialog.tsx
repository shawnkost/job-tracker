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
import { useState } from "react";
import { api } from "~/trpc/react";

export function CreateApplication() {
  const [open, setOpen] = useState(false);
  const utils = api.useUtils();

  const createApplication = api.application.create.useMutation({
    onSuccess: async () => {
      await utils.application.getAll.invalidate();
    },
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      // Convert form data to match the expected input type
      const input = {
        company: formData.get("company") as string,
        position: formData.get("position") as string,
        appliedDate: new Date(
          (formData.get("appliedDate") as string) + "T00:00:00",
        ),
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

      await createApplication.mutateAsync(input);
      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Button
        className="bg-accent text-primary ease-in-out-expo focus:outline-link cursor-pointer rounded-md px-4 py-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,194,126,0.4)] hover:brightness-110 focus:outline-2 focus:outline-offset-2"
        onClick={() => setOpen(true)}
      >
        New Application
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        className="relative z-50"
      >
        <div className="text-primary fixed inset-0 flex w-screen items-center justify-center bg-black/50 p-4 font-serif">
          <DialogPanel className="bg-surface max-w-2xl space-y-3 rounded-lg p-6">
            <DialogTitle className="text-primary mb-3 text-xl">
              New Application
            </DialogTitle>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label className="mb-1 block text-sm">Company</Label>
                  <Input
                    name="company"
                    type="text"
                    id="company"
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
                    className="border-border focus:ring-accent focus:border-accent w-full rounded-md border px-3 py-1.5 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                    required
                  />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <Label className="mb-1 block text-sm">Applied Date</Label>
                  <Input
                    name="appliedDate"
                    type="date"
                    id="appliedDate"
                    className="border-border focus:ring-accent focus:border-accent w-full rounded-md border px-3 py-1.5 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                    required
                  />
                </Field>
                <Field>
                  <Label className="mb-1 block text-sm">Status</Label>
                  <Select
                    name="status"
                    id="status"
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
              <div>
                <Field>
                  <Label className="mb-1 block text-sm">Post URL</Label>
                  <Input
                    name="link"
                    type="url"
                    id="link"
                    className="border-border focus:ring-accent focus:border-accent text-link w-full rounded-md border px-3 py-1.5 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                    required
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
                      className="border-border focus:ring-accent focus:border-accent w-full rounded-md border px-3 py-1.5 pl-7 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                    />
                  </div>
                </Field>
              </div>
              <div>
                <Field>
                  <Label className="mb-1 block text-sm">Location</Label>
                  <Input
                    type="text"
                    id="location"
                    name="location"
                    className="border-border focus:ring-accent focus:border-accent w-full rounded-md border px-3 py-1.5 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                  />
                </Field>
              </div>
              <div>
                <Field>
                  <Label className="mb-1 block text-sm">Description</Label>
                  <Textarea
                    name="description"
                    id="description"
                    className="border-border focus:ring-accent focus:border-accent min-h-[60px] w-full rounded-md border px-3 py-1.5 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                  />
                </Field>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button
                  onClick={() => setOpen(false)}
                  type="button"
                  className="bg-border text-text-primary hover:border-accent/30 focus:outline-link cursor-pointer rounded-md px-4 py-1.5 text-sm transition-all duration-200 hover:scale-[1.02] hover:brightness-125 focus:outline-2 focus:outline-offset-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-accent text-text-primary focus:outline-link cursor-pointer rounded-md px-4 py-1.5 text-sm transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,194,126,0.4)] hover:brightness-110 focus:outline-2 focus:outline-offset-2"
                >
                  Save
                </Button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
