import React from "react";

/**
 * Static "fake" development workflow stepper component.
 * Shows: Intent -> Requirement -> Specification -> Solution -> Testing -> Deployment
 */
export const DevelopmentStepper: React.FC = () => {
  const steps = [
    { label: "Intent", status: "completed" },
    { label: "Requirement", status: "active" },
    { label: "Specification", status: "pending" },
    { label: "Solution", status: "pending" },
    { label: "Testing", status: "pending" },
    { label: "Deployment", status: "pending" },
  ] as const;

  return (
    <div className="flex items-center gap-1 py-1 overflow-x-auto mt-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.label}>
          {/* Step indicator + label */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Circle indicator */}
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                step.status === "completed"
                  ? "bg-green-500"
                  : step.status === "active"
                  ? "bg-blue-500"
                  : "border-2 border-muted-foreground/30"
              }`}
            >
              {step.status === "completed" && (
                <svg
                  className="w-2.5 h-2.5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
              {step.status === "active" && (
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </span>
            {/* Label */}
            <span
              className={`text-sm whitespace-nowrap ${
                step.status === "completed"
                  ? "text-foreground"
                  : step.status === "active"
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {step.label}
            </span>
          </div>

          {/* Arrow connector (not after last item) */}
          {index < steps.length - 1 && (
            <div className="flex items-center px-2 shrink-0">
              <div className="w-16 h-px bg-muted-foreground/30" />
              <svg
                className="w-3 h-3 text-muted-foreground/50 -ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default DevelopmentStepper;
