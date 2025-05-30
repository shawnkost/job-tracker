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

  const createApplication = api.application.create.useMutation();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const formData = new FormData(event.currentTarget);
      // Convert form data to match the expected input type
      const input = {
        company: formData.get("company") as string,
        position: formData.get("position") as string,
        appliedDate: new Date(formData.get("appliedDate") as string),
        status: formData.get("status") as
          | "applied"
          | "interviewing"
          | "offer"
          | "rejected",
        link: formData.get("link") as string,
        salary: formData.get("salary") as string,
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
          <DialogPanel className="bg-surface wp-12 max-w-xl space-y-4 rounded-lg p-6">
            <DialogTitle className="text-primary mb-4 text-2xl">
              New Application
            </DialogTitle>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 flex gap-5">
                <Field className="w-1/2">
                  <Label className="mb-2 block text-sm">Company</Label>
                  <Input
                    name="company"
                    type="text"
                    id="company"
                    className="border-border focus:ring-accent focus:border-accent w-full rounded-md border px-4 py-2 transition-all duration-200 focus:ring-2 focus:outline-none"
                    required
                  />
                </Field>
                <Field className="w-1/2">
                  <Label className="mb-2 block text-sm">Job Title</Label>
                  <Input
                    name="position"
                    type="text"
                    id="position"
                    className="border-border focus:ring-accent focus:border-accent w-full rounded-md border px-4 py-2 transition-all duration-200 focus:ring-2 focus:outline-none"
                    required
                  />
                </Field>
              </div>
              <div className="mb-4 flex gap-5">
                <Field>
                  <Label className="mb-2 block text-sm">Applied Date</Label>
                  <Input
                    name="appliedDate"
                    type="date"
                    id="appliedDate"
                    className="border-border focus:ring-accent focus:border-accent w-full rounded-md border px-4 py-2 transition-all duration-200 focus:ring-2 focus:outline-none"
                    required
                  />
                </Field>
                <Field className="grow">
                  <Label className="mb-2 block text-sm">Status</Label>
                  <Select
                    name="status"
                    id="status"
                    className="border-border focus:ring-accent focus:border-accent w-full rounded-md border px-4 py-2 transition-all duration-200 focus:ring-2 focus:outline-none"
                  >
                    <option value="applied">Applied</option>
                    <option value="interviewing">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </Select>
                </Field>
              </div>
              <div className="mb-4">
                <Field>
                  <Label className="mb-2 block text-sm">Post URL</Label>
                  <Input
                    name="link"
                    type="url"
                    id="link"
                    className="border-border focus:ring-accent focus:border-accent text-link w-full rounded-md border px-4 py-2 transition-all duration-200 focus:ring-2 focus:outline-none"
                    required
                  />
                </Field>
              </div>
              <div className="mb-4 flex gap-5">
                <Field className="w-1/3">
                  <Label className="mb-2 block text-sm">Salary</Label>
                  <div className="relative">
                    <span className="text-text-secondary absolute top-1/2 left-3 -translate-y-1/2">
                      $
                    </span>
                    <Input
                      type="text"
                      id="salary"
                      name="salary"
                      className="border-border focus:ring-accent focus:border-accent w-full rounded-md border px-4 py-2 pl-7 transition-all duration-200 focus:ring-2 focus:outline-none"
                    />
                  </div>
                </Field>
                <Field className="grow">
                  <Label className="mb-2 block text-sm">Location</Label>
                  <Input
                    type="text"
                    id="location"
                    name="location"
                    className="border-border focus:ring-accent focus:border-accent w-full rounded-md border px-4 py-2 transition-all duration-200 focus:ring-2 focus:outline-none"
                  />
                </Field>
              </div>
              <div className="mb-4">
                <Field>
                  <Label className="mb-2 block text-sm">Description</Label>
                  <Textarea
                    name="description"
                    id="description"
                    className="border-border focus:ring-accent focus:border-accent min-h-[100px] w-full rounded-md border px-4 py-2 transition-all duration-200 focus:ring-2 focus:outline-none"
                  />
                </Field>
              </div>
              <div className="mb-4 flex justify-end gap-5">
                <Button
                  onClick={() => setOpen(false)}
                  type="button"
                  className="bg-border text-text-primary hover:border-accent/30 focus:outline-link cursor-pointer rounded-md px-4 py-2 transition-all duration-200 hover:scale-[1.02] hover:brightness-125 focus:outline-2 focus:outline-offset-2"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-accent text-text-primary focus:outline-link cursor-pointer rounded-md px-4 py-2 transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_15px_rgba(0,194,126,0.4)] hover:brightness-110 focus:outline-2 focus:outline-offset-2"
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
