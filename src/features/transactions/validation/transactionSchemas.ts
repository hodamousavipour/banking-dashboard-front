import { z } from "zod";
import {
  dateRegex,
  isValidCalendarDate,
  isPastOrToday,
  isYearInRange,
} from "../../../shared/utils/dateValidators";

const MIN_YEAR = 2000;
const MAX_YEAR = new Date().getFullYear();

export const transactionSchema = z.object({
  amount: z
    .number({
      message: "Amount must be a number",
    })
    .refine((v) => v !== 0, {
      message: "Amount cannot be 0",
    }),

  description: z
    .string({
      message: "Description is required",
    })
    .min(2, { message: "Description must be at least 2 characters" })
    .max(120, { message: "Description must be at most 120 characters" }),

  date: z.string().superRefine((value, ctx) => {
    if (!value || value.trim().length === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Date is required",
      });
      return;
    }

    if (!dateRegex.test(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid date format",
      });
      return;
    }

    if (!isValidCalendarDate(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid calendar date",
      });
      return;
    }

    if (!isYearInRange(value, MIN_YEAR, MAX_YEAR)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Year must be between ${MIN_YEAR} and ${MAX_YEAR}`,
      });
      return;
    }

    if (!isPastOrToday(value)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Date cannot be in the future",
      });
    }
  }),

  category: z.string().optional(),
});

export const createTransactionSchema = transactionSchema;
export const updateTransactionSchema = transactionSchema.extend({
  id: z.string().or(z.number()),
});

export type CreateTransactionFormData = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionFormData = z.infer<typeof updateTransactionSchema>;