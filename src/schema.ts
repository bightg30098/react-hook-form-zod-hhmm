import { z } from "zod";

const empty = z.union([z.undefined(), z.string().trim().max(0)]);
const nonEmpty = z.string().trim().min(1, { message: "required" });

const bothEmpty = z.object({
	hour: empty,
	minute: empty,
});

const bothNonEmpty = z
	.object({
		hour: nonEmpty,
		minute: nonEmpty,
	})
	.transform((schema) => ({
		hour: schema.hour.padStart(2, "0"),
		minute: schema.minute.padStart(2, "0"),
	}))
	.superRefine((schema, ctx) => {
		const hour = Number(schema.hour);
		const minute = Number(schema.minute);

		if (isNaN(hour) || hour < 0 || hour > 23) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "00-23",
				path: ["hour"],
			});
		}

		if (isNaN(minute) || minute < 0 || minute > 59) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: "00-59",
				path: ["minute"],
			});
		}
	});

/**
 * hhmm schema accepts:
 * - both hh and mm empty
 * - both hh and mm non-empty, and will validate that they are valid numbers
 * NOTE: Order matters here. bothNonEmpty `must` be first.
 * I group startHour and startMinute together into start, and endHour and endMinute into end.
 * Because I need to make sure that both start and end are either empty or non-empty.
 */
const hhmmSchema = bothNonEmpty.or(bothEmpty);

export const formSchema = z.object({
	start: hhmmSchema,
	end: hhmmSchema,
});

export type FormSchema = z.infer<typeof formSchema>;
