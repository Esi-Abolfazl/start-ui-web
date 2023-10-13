import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { zRepository } from '@/features/repositories/schemas';
import { ExtendedTRPCError } from '@/server/config/errors';
import { createTRPCRouter, protectedProcedure } from '@/server/config/trpc';

export const repositoriesRouter = createTRPCRouter({
  getById: protectedProcedure({ authorizations: ['ADMIN'] })
    .meta({
      openapi: {
        method: 'GET',
        path: '/repositories/{id}',
        protect: true,
        tags: ['repositories'],
      },
    })
    .input(zRepository().pick({ id: true }))
    .output(zRepository())
    .query(async ({ ctx, input }) => {
      ctx.logger.info('Getting repository');
      const repository = await ctx.db.repository.findUnique({
        where: { id: input.id },
      });

      if (!repository) {
        ctx.logger.warn('Unable to find repository with the provided input');
        throw new TRPCError({
          code: 'NOT_FOUND',
        });
      }

      return repository;
    }),

  getAll: protectedProcedure({ authorizations: ['ADMIN'] })
    .meta({
      openapi: {
        method: 'GET',
        path: '/repositories',
        protect: true,
        tags: ['repositories'],
      },
    })
    .input(
      z.object({
        page: z.number().int().gte(1).default(1),
        size: z.number().int().gte(1).default(20),
      })
    )
    .output(
      z.object({
        items: z.array(zRepository()),
        total: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      ctx.logger.info('Getting repositories using pagination');
      const [items, total] = await Promise.all([
        ctx.db.repository.findMany({
          skip: (input.page - 1) * input.size,
          take: input.size,
          orderBy: {
            name: 'asc',
          },
        }),
        ctx.db.repository.count(),
      ]);

      return {
        items,
        total,
      };
    }),

  create: protectedProcedure({ authorizations: ['ADMIN'] })
    .meta({
      openapi: {
        method: 'POST',
        path: '/repositories',
        protect: true,
        tags: ['repositories'],
      },
    })
    .input(
      zRepository().pick({
        name: true,
        link: true,
        description: true,
      })
    )
    .output(zRepository())
    .mutation(async ({ ctx, input }) => {
      try {
        ctx.logger.info('Creating repository');
        return await ctx.db.repository.create({
          data: input,
        });
      } catch (e) {
        throw new ExtendedTRPCError({
          cause: e,
        });
      }
    }),

  updateById: protectedProcedure({ authorizations: ['ADMIN'] })
    .meta({
      openapi: {
        method: 'PUT',
        path: '/repositories/{id}',
        protect: true,
        tags: ['repositories'],
      },
    })
    .input(
      zRepository().pick({
        id: true,
        name: true,
        link: true,
        description: true,
      })
    )
    .output(zRepository())
    .mutation(async ({ ctx, input }) => {
      try {
        ctx.logger.info('Updating repository');
        return await ctx.db.repository.update({
          where: { id: input.id },
          data: input,
        });
      } catch (e) {
        throw new ExtendedTRPCError({
          cause: e,
        });
      }
    }),

  removeById: protectedProcedure({ authorizations: ['ADMIN'] })
    .meta({
      openapi: {
        method: 'DELETE',
        path: '/repositories/{id}',
        protect: true,
        tags: ['repositories'],
      },
    })
    .input(zRepository().pick({ id: true }))
    .output(zRepository())
    .mutation(async ({ ctx, input }) => {
      ctx.logger.info({ input }, 'Removing repository');
      try {
        return await ctx.db.repository.delete({
          where: { id: input.id },
        });
      } catch (e) {
        throw new ExtendedTRPCError({
          cause: e,
        });
      }
    }),
});
