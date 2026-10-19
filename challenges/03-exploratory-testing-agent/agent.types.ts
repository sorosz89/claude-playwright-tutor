import { z } from 'zod';

/** Hard cap on act/observe iterations before the loop gives up and throws. */
export const MAX_ITERATIONS = 10;

export const FINISH_TOOL_NAME = 'finish';

export const KNOWN_TOOL_NAMES = ['navigate', 'click', 'type', 'read_page', FINISH_TOOL_NAME] as const;

export const NavigateArgsSchema = z.object({
  path: z
    .string()
    .describe('An in-app hash route to navigate to, e.g. "#/active", "#/completed", or "#/".'),
});

export const ClickArgsSchema = z.object({
  selector: z.string().describe('A CSS selector for the element to click, taken from the last read_page snapshot.'),
});

export const TypeArgsSchema = z.object({
  selector: z.string().describe('A CSS selector for the input to type into, taken from the last read_page snapshot.'),
  text: z.string().describe('The text to type into the input.'),
  pressEnter: z
    .boolean()
    .optional()
    .describe('Whether to press Enter after typing (required to submit a new todo).'),
});

export const ReadPageArgsSchema = z.object({});

export const ExplorationReportSchema = z.object({
  summary: z.string().describe('A short summary of what was explored.'),
  actionsTaken: z.array(z.string()).describe('A short description of each meaningful action taken.'),
  issuesFound: z
    .array(z.string())
    .describe('Anything that looked broken or unexpected. An empty array is a fine, honest answer.'),
});

export type NavigateArgs = z.infer<typeof NavigateArgsSchema>;
export type ClickArgs = z.infer<typeof ClickArgsSchema>;
export type TypeArgs = z.infer<typeof TypeArgsSchema>;
export type ReadPageArgs = z.infer<typeof ReadPageArgsSchema>;
export type ExplorationReport = z.infer<typeof ExplorationReportSchema>;

export interface AgentTraceEntry {
  iteration: number;
  toolName: string;
  input: unknown;
  output: string;
  isError: boolean;
}

export type AgentTrace = AgentTraceEntry[];

export interface AgentRunResult {
  report: ExplorationReport;
  trace: AgentTrace;
}

export interface ExploratoryAgent {
  explore(goal: string): Promise<AgentRunResult>;
}
