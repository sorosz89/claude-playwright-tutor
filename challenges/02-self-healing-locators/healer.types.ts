import { z } from 'zod';

export const LocatorHealResultSchema = z.object({
  healedSelector: z
    .string()
    .describe('A single valid CSS selector that locates the described element in the given DOM snapshot.'),
  reasoning: z.string().describe('One sentence explaining why this selector matches the intent.'),
});

export type LocatorHealResult = z.infer<typeof LocatorHealResultSchema>;

export interface HealInput {
  domSnapshot: string;
  brokenSelector: string;
  intentDescription: string;
}

export interface LocatorHealer {
  heal(input: HealInput): Promise<LocatorHealResult>;
}
