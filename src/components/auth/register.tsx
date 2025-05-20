"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function CreateAccount() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState(false);
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
    if (!email || !password || !confirmPassword || !passwordsMatch) return;
    // In a real app, you would call an API to send OTP to the user's email
    console.log("Sending OTP to", email);
    setStep(2);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      setOtpError(true);
      return;
    }

    setOtpError(false);
    alert("Registration successful!");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setOtp(["", "", "", "", "", ""]);
    setStep(1);
  };

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#383874]">
          {step === 1 ? "Create Your Account" : "Verify Your Email"}
        </h1>
        {step === 2 && (
          <p className="text-sm text-gray-500 mt-2">
            {"We'"}ve sent a verification code to {email}
          </p>
        )}
      </div>

      {step === 1 ? (
        <div className="space-y-6">
          <Button
            variant="outline"
            className="w-full py-6 flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-gray-500 font-medium">
              Sign Up with Google
            </span>
          </Button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-200 w-full absolute"></div>
            <span className="px-4 text-sm text-gray-400 relative">OR</span>
          </div>

          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
              <Input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={handleChangeEmail}
                className="pl-10 py-6 border-[#e0e0f2] rounded-full focus-visible:ring-purple-500"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                className="pl-10 pr-10 py-6 border-[#e0e0f2] rounded-full focus-visible:ring-purple-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="text-xs text-gray-400 pl-3">
              Must be 8 characters at least
            </p>

            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                <Lock size={18} />
              </div>
              <Input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`pl-10 pr-10 py-6 border-[#e0e0f2] rounded-full focus-visible:ring-purple-500 ${
                  !passwordsMatch ? "border-red-500" : ""
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {!passwordsMatch && (
              <p className="text-xs text-red-500 pl-3">
                Passwords do not match
              </p>
            )}

            <div className="flex items-center space-x-2 pl-1">
              <Checkbox
                id="terms"
                className="rounded-sm border-gray-300 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-500">
                I agree to the{" "}
                <Link href="#" className="text-purple-500 hover:underline">
                  Terms & Conditions
                </Link>
              </label>
            </div>

            <Button
              type="submit"
              className="w-full py-6 bg-[#6366f1] hover:bg-[#5355d1] text-white rounded-full"
              disabled={
                !email || !password || !confirmPassword || !passwordsMatch
              }
            >
              Continue
            </Button>
          </form>

          <p className="text-center text-gray-400 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-purple-500 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <form onSubmit={() => handleVerifyOtp} className="space-y-6">
            <div className="text-center mb-4">
              <p className="text-sm text-gray-500">
                Enter the 6-digit code we sent to your email
              </p>
            </div>

            <div className="flex justify-between gap-2 mb-4">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className={`w-12 h-12 text-center text-lg font-semibold border-[#e0e0f2] focus-visible:ring-purple-500 ${
                    otpError ? "border-red-500" : ""
                  }`}
                  required
                />
              ))}
            </div>

            {otpError && (
              <div className="flex items-center gap-2 text-red-500 text-sm">
                <AlertCircle size={16} />
                <span>Please enter a valid 6-digit code</span>
              </div>
            )}

            <Button
              type="submit"
              className="w-full py-6 bg-[#6366f1] hover:bg-[#5355d1] text-white rounded-full"
            >
              Verify & Register
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                {"Didn't receive the code?"}
              </p>
              <Button
                type="button"
                variant="link"
                className="text-purple-500 hover:text-purple-600"
                onClick={() => {
                  console.log("Resending OTP to", email);
                }}
              >
                Resend Code
              </Button>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => setStep(1)}
            >
              Back to Registration
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
