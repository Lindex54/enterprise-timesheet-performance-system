export type CompletionComponents = {
  taskCompletionRate: number;
  timesheetSubmissionRate: number;
  supervisorApprovalRate: number;
};

export const COMPLETION_WEIGHTS = {
  taskCompletion: 0.5,
  timesheetSubmission: 0.3,
  supervisorApproval: 0.2,
} as const;

export function calculateOverallCompletion(components: CompletionComponents) {
  const taskCompletionRate = clampPercentage(
    components.taskCompletionRate,
  );
  const timesheetSubmissionRate = clampPercentage(
    components.timesheetSubmissionRate,
  );
  const supervisorApprovalRate = clampPercentage(
    components.supervisorApprovalRate,
  );

  const contributions = {
    taskCompletion:
      taskCompletionRate * COMPLETION_WEIGHTS.taskCompletion,
    timesheetSubmission:
      timesheetSubmissionRate * COMPLETION_WEIGHTS.timesheetSubmission,
    supervisorApproval:
      supervisorApprovalRate * COMPLETION_WEIGHTS.supervisorApproval,
  };

  return {
    overallRate: Math.round(
      contributions.taskCompletion +
        contributions.timesheetSubmission +
        contributions.supervisorApproval,
    ),
    components: {
      taskCompletionRate,
      timesheetSubmissionRate,
      supervisorApprovalRate,
    },
    contributions,
  };
}

function clampPercentage(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}
