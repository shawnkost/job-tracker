import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const applicationRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const applications = await ctx.db.application.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        appliedDate: "desc",
      },
    });

    return applications;
  }),

  create: protectedProcedure
    .input(
      z.object({
        company: z.string(),
        position: z.string(),
        appliedDate: z.date(),
        responseDate: z.date().optional(),
        firstInterviewDate: z.date().optional(),
        offerDate: z.date().optional(),
        rejectionDate: z.date().optional(),
        status: z.enum([
          "applied",
          "phone_screen",
          "technical",
          "final_round",
          "offer",
          "rejected",
        ]),
        link: z.string(),
        salaryMin: z.number().optional(),
        salaryMax: z.number().optional(),
        location: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.application.create({
        data: {
          company: input.company,
          position: input.position,
          appliedDate: input.appliedDate,
          responseDate: input.responseDate,
          firstInterviewDate: input.firstInterviewDate,
          offerDate: input.offerDate,
          rejectionDate: input.rejectionDate,
          status: input.status,
          link: input.link,
          salaryMin: input.salaryMin,
          salaryMax: input.salaryMax,
          location: input.location,
          description: input.description,
          userId: ctx.session.user.id,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        company: z.string(),
        position: z.string(),
        appliedDate: z.date(),
        responseDate: z.date().optional(),
        firstInterviewDate: z.date().optional(),
        offerDate: z.date().optional(),
        rejectionDate: z.date().optional(),
        status: z.enum([
          "applied",
          "phone_screen",
          "technical",
          "final_round",
          "offer",
          "rejected",
        ]),
        link: z.string(),
        salaryMin: z.number().optional(),
        salaryMax: z.number().optional(),
        location: z.string(),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      return ctx.db.application.update({
        where: {
          id: id,
          userId: ctx.session.user.id, // Ensure user can only update their own applications
        },
        data: updateData,
      });
    }),
});
