"use client";

type StepStatus = "completed" | "in_progress" | "pending" | "failed";

interface ProcessingStep {
  id: string;
  label: string;
  status: StepStatus;
}

interface ProcessingStepsProps {
  steps: ProcessingStep[];
}

const CheckIcon = () => (
  <svg
    className="h-5 w-5 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    className="h-5 w-5 animate-spin text-white"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
    />
  </svg>
);

const CircleIcon = () => (
  <svg
    className="h-5 w-5 text-gray-400"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <circle cx="12" cy="12" r="10" />
  </svg>
);

const XIcon = () => (
  <svg
    className="h-5 w-5 text-white"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const statusStyles: Record<
  StepStatus,
  { bg: string; text: string; label: string }
> = {
  completed: {
    bg: "bg-green-500",
    text: "text-green-700",
    label: "Completed",
  },
  in_progress: {
    bg: "bg-blue-500",
    text: "text-blue-700",
    label: "In Progress",
  },
  pending: {
    bg: "bg-gray-300",
    text: "text-gray-500",
    label: "Pending",
  },
  failed: {
    bg: "bg-red-500",
    text: "text-red-700",
    label: "Failed",
  },
};

const StatusIcon = ({ status }: { status: StepStatus }) => {
  switch (status) {
    case "completed":
      return <CheckIcon />;
    case "in_progress":
      return <SpinnerIcon />;
    case "pending":
      return <CircleIcon />;
    case "failed":
      return <XIcon />;
  }
};

export const ProcessingSteps = ({ steps }: ProcessingStepsProps) => {
  return (
    <div className="space-y-0">
      {steps.map((step, index) => {
        const style = statusStyles[step.status];
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="relative flex items-start gap-4">
            {/* Vertical connecting line */}
            {!isLast && (
              <div className="absolute left-[18px] top-[36px] h-[calc(100%-4px)] w-0.5 bg-gray-200" />
            )}

            {/* Icon circle */}
            <div
              className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                step.status === "pending" ? "bg-gray-100" : style.bg
              }`}
            >
              <StatusIcon status={step.status} />
            </div>

            {/* Content */}
            <div className="flex min-h-[56px] flex-col justify-center pb-4">
              <p className="text-sm font-medium text-gray-900">{step.label}</p>
              <p className={`text-xs ${style.text}`}>{style.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
