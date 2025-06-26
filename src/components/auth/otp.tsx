"use client";

import { useState, useEffect } from "react";
import OTPInput from "react-otp-input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import "@/../i18n";
import { useVerify } from "@/hooks/auth/use.auth";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

interface CreateAccountProps {
  setStep: (step: number) => void;
  email?: (field: string) => string;
}

export default function CreateAccount({ setStep, email }: CreateAccountProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);
  const { t } = useTranslation();
  const { verify, isVerifying, verifyError, isSuccess } = useVerify();

  const handleVerifyOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setOtpError(true);
      return;
    }
    verify({ email: email ? email("email") : "", code: otp });
  };

  useEffect(() => {
    if (isSuccess && pathname === "/forgot-password") {
      setStep(3);
    }
    if (isSuccess && pathname === "/register") {
      setStep(0);
      console.log("Registration successful, redirecting to login");
      router.push("/login");
    }
  }, [isSuccess, pathname, setStep, router]);

  return (
    <div className="space-y-6">
      <form onSubmit={handleVerifyOtp} className="space-y-6">
        <div className="text-center mb-4">
          <p className="text-sm text-gray-500">
            {t("Enter the 6-digit code we sent to your email")}
          </p>
        </div>

        <div className="flex justify-center mb-4">
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            inputStyle={{
              width: "3rem",
              height: "3rem",
              margin: "0 0.25rem",
              fontSize: "1.5rem",
              borderRadius: "0.375rem",
              border: otpError ? "1px solid red" : "1px solid #e0e0f2",
              textAlign: "center",
            }}
            shouldAutoFocus
            renderInput={(props) => <input {...props} />}
          />
        </div>

        <Button
          type="submit"
          disabled={isVerifying}
          className="w-full py-6 bg-[#3e41f7] hover:bg-[#5355d1] text-white rounded-xl"
        >
          {isVerifying ? t("Loading...") : t("Verify")}
        </Button>

        <div className="flex justify-center items-center">
          <span className="text-sm text-gray-500">
            {t("Didn't receive the code?")}
          </span>
          <Button
            type="button"
            variant="link"
            className="text-blue-500 hover:text-blue-600 hover:outline-none hover:underline"
          >
            {t("Resend Code")}
          </Button>
        </div>
        {verifyError && (
          <p className="text-xs text-red-500 text-center">
            {verifyError instanceof Error
              ? verifyError.message
              : t("Something went wrong")}
          </p>
        )}
      </form>
    </div>
  );
}
