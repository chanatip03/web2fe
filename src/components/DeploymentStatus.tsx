"use client";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import CancelIcon from "@mui/icons-material/Cancel";

export type SubmitStatus = "editing" | "submitting" | "deploying" | "done";

interface Props {
  status: SubmitStatus;
  projectTypeId: number;

  deploySuccess?: boolean;
  testcase?: { pass: number; fail: number; success?: boolean };
  security?: { success?: boolean };

  onViewSecurity?: () => void;
}

function Icon({
  done,
  loading,
  failed,
}: {
  done?: boolean;
  loading?: boolean;
  failed?: boolean;
}) {
  if (loading) return <AutorenewIcon className="animate-spin text-blue-500" />;

  if (failed) return <CancelIcon className="text-red-600" />;

  if (done) return <CheckCircleIcon className="text-green-600" />;

  return null;
}

export default function DeploymentStatus({
  status,
  projectTypeId,
  deploySuccess = true,
  testcase = { pass: 0, fail: 0, success: true },
  security = { success: true },
  onViewSecurity,
}: Props) {
  const showExtra = projectTypeId === 1 || projectTypeId === 2;
  const hasCriticalError = status === "done" && !deploySuccess;

  return (
    <div className="space-y-4">
      {/* SUBMITTED */}
      <div className="flex justify-between items-center">
        <div>Submitted Successfully</div>
        <CheckCircleIcon className="text-green-600" />
      </div>

      {/* DEPLOY */}
      <div className="flex justify-between items-center">
        <div>
          {status !== "done"
            ? "Waiting for deployment"
            : deploySuccess
              ? "Deployment Successfully"
              : "Deployment Failed"}
        </div>

        <Icon
          loading={status !== "done"}
          done={status === "done" && deploySuccess}
          failed={status === "done" && !deploySuccess}
        />
      </div>

      {/* EXTRA RESULT */}
      {showExtra && (
        <>
          {/* TESTCASE */}
          <div className="flex justify-between items-center">
            <div>
              {status !== "done"
                ? "Waiting for scan testcase"
                : testcase.success
                  ? "Result Test Case"
                  : "Test Case Failed"}
            </div>

            {status !== "done" ? (
              <AutorenewIcon className="animate-spin text-blue-500" />
            ) : testcase.success ? (
              <div
                className="flex items-center"
              >
                <div className="text-green-600">Pass {testcase.pass}</div>
                <div className="text-red-600 ml-3">Fail {testcase.fail}</div>
              </div>
            ) : (
              <CancelIcon className="text-red-600" />
            )}
          </div>

          {/* SECURITY */}
          <div className="flex justify-between items-center">
            <div>
              {status !== "done"
                ? "Waiting for security scan"
                : security.success
                  ? "Result Cyber Security Test"
                  : "Security Scan Failed"}
            </div>

            {status !== "done" ? (
              <AutorenewIcon className="animate-spin text-blue-500" />
            ) : security.success ? (
              <button
                className="text-primary03 underline cursor-pointer"
                onClick={onViewSecurity}
              >
                View Result
              </button>
            ) : (
              <CancelIcon className="text-red-600" />
            )}
          </div>
        </>
      )}

      {/* GLOBAL ERROR MESSAGE */}
      {hasCriticalError && (
        <div className="mt-5 p-4 rounded-lg border border-red-300 bg-red-50 text-red-700 font-medium">
          Deployment failed. Please fix your code and submit again.
        </div>
      )}
    </div>
  );
}
