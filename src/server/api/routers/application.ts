import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const applicationRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const applications = await ctx.db.application.findMany({
      where: {
        userId: ctx.session.user.id,
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
        status: z.enum(["applied", "interviewing", "offer", "rejected"]),
        link: z.string(),
        salary: z.string(),
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
          status: input.status,
          link: input.link,
          salary: input.salary,
          location: input.location,
          description: input.description,
          userId: ctx.session.user.id,
        },
      });
    }),
});
