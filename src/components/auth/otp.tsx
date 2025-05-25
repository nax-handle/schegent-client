"use client";

import { useState } from "react";
import OTPInput from "react-otp-input";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import "@/../i18n";

interface CreateAccountProps {
  setStep: (step: number) => void;
}

export default function CreateAccount({ setStep }: CreateAccountProps) {
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);
  const { t } = useTranslation();

  const handleVerifyOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setOtpError(true);
      return;
    }
    setOtpError(false);
    setOtp("");
    setStep(3);
  };

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
          className="w-full py-6 bg-[#3e41f7] hover:bg-[#5355d1] text-white rounded-xl"
        >
          {t("Register")}
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
      </form>
    </div>
  );
}
