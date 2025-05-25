"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Otp from "@/components/auth/otp";
import { useTranslation } from "react-i18next";
import "@/../i18n";
import FogotPassword from "@/components/auth/editPassword";

export default function ForgotPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [step, setStep] = useState(1);
  const { t, i18n } = useTranslation();

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val.endsWith("@")) {
      val += "gmail.com";
    }
    setEmail(val);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setPasswordsMatch(value === password || value === "");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordsMatch(confirmPassword === value || confirmPassword === "");
  };

  const handleSendOtp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    console.log("Sending OTP to", email);
    setStep(2);
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-full max-w-md mx-auto border-1 rounded-xl backdrop-blur-2xl bg-gray-200/20 p-6">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-[#2e2e77] dark:text-[#6363c6]">
            {step === 1
              ? t("Forgot Password")
              : step == 2
              ? t("Verify Your Email")
              : t("Reset Password")}
          </h1>
          {step === 2 && (
            <p className="text-sm text-gray-500 mt-2">
              {t("We've sent a verification code to")} {email}
            </p>
          )}
        </div>

        {step === 1 ? (
          <div className="space-y-6">
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <Input
                  type="email"
                  placeholder={t("Your Email")}
                  value={email}
                  onChange={handleChangeEmail}
                  className="pl-10 py-6 border-[#e0e0f2] rounded-xl focus-visible:ring-blue-500"
                  required
                />
              </div>

              {!passwordsMatch && (
                <p className="text-xs text-red-500 pl-3">
                  {t("Passwords do not match")}
                </p>
              )}

              <Button
                type="submit"
                className="w-full py-6 bg-[#3e41f7] hover:bg-[#5355d1] text-white rounded-xl"
                disabled={!email}
              >
                {t("Continue")}
              </Button>
            </form>

            <p className="text-center text-gray-400 text-sm">
              {t("Already have an account")}?{" "}
              <Link href="/login" className="text-blue-500 hover:underline">
                {t("LogIn")}
              </Link>
            </p>
          </div>
        ) : step == 2 ? (
          <Otp setStep={setStep} />
        ) : (
          <FogotPassword />
        )}
      </div>
    </div>
  );
}
