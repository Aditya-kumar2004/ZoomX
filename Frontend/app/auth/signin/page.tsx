"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, Shield, Zap, Globe } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout, GoogleButton } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/ZInput";
import { Button } from "@/components/ui/ZButton";
import { useAuth } from "@/hooks/useAuth";
import { authAPI } from "@/services/api";
import { useGoogleLogin } from "@react-oauth/google";

interface FormVals {
  email: string;
  password: string;
}

export default function SignIn() {
  const { login } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormVals>();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [signInError, setSignInError] = useState<string | null>(null);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [emailForVerification, setEmailForVerification] = useState("");

  const onSubmit = async (data: FormVals) => {
    setLoading(true);
    setSignInError(null);
    try {
      const res = await authAPI.login({
        email: data.email,
        password: data.password,
      });
      login(res.user, res.tokens);
      router.push("/dashboard");
    } catch (err: any) {
      if (err.status === 403 || (err.message && err.message.toLowerCase().includes("verify"))) {
        setEmailForVerification(data.email);
        setOtpSent(true);
      } else {
        setSignInError(err.message || "Invalid email or password.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length !== 6) {
      setOtpError("Please enter a valid 6-digit verification code.");
      return;
    }
    setOtpLoading(true);
    setOtpError(null);
    try {
      const res = await authAPI.verifyOTP({
        email: emailForVerification,
        otp: otpCode,
      });
      login(res.user, res.tokens);
      router.push("/dashboard");
    } catch (err: any) {
      setOtpError(err.message || "Invalid verification code. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const google = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setSignInError(null);
      try {
        const res = await authAPI.googleLogin(tokenResponse.access_token);
        login(res.user, res.tokens);
        router.push("/dashboard");
      } catch (err: any) {
        setSignInError(err.message || "Google Sign-In failed.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setSignInError("Google Login Failed"),
  });

  return (
    <AuthLayout
      side={
        <div>
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold tracking-tight leading-none text-white">
            Your meetings.
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D6FFF] to-[#7B5CFF]">
              Your way.
            </span>
          </h2>
          <p className="text-[#8888AA] mt-4 max-w-sm text-sm leading-relaxed font-sans font-medium">
            Premium video conferencing built for the way modern teams actually work. Secure, ultra-fast, and globally distributed.
          </p>
          <div className="flex flex-wrap gap-2 mt-6">
            {[
              { icon: Shield, text: "Enterprise Secure", bg: "bg-[#2D6FFF]/5 border-[#2D6FFF]/10 text-[#82AAFF]" },
              { icon: Zap, text: "Ultra Fast Latency", bg: "bg-[#7B5CFF]/5 border-[#7B5CFF]/10 text-[#C792EA]" },
              { icon: Globe, text: "Global Network", bg: "bg-emerald-500/5 border-emerald-500/10 text-emerald-400" },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <span
                  key={f.text}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold tracking-wide backdrop-blur-md ${f.bg}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {f.text}
                </span>
              );
            })}
          </div>
        </div>
      }
    >
      {!otpSent ? (
        <>
          <h1 className="font-display text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-sm text-[#8888AA] mb-4">Sign in to your ZoomX account</p>

          {signInError && (
            <div className="p-3 mb-3 text-xs rounded-xl bg-red-500/10 border border-red-500/20 text-[#FF3B55]">
              {signInError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <Input
              label="Email address"
              type="email"
              placeholder="you@company.com"
              className="py-2 text-sm"
              {...register("email", { required: "Email required" })}
              error={errors.email?.message}
            />
            <div>
              <Input
                label="Password"
                type={show ? "text" : "password"}
                placeholder="••••••••"
                className="py-2 text-sm"
                {...register("password", { required: "Password required" })}
                error={errors.password?.message}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    aria-label="Toggle password"
                  >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
              <div className="text-right mt-1.5">
                <a href="#" className="text-xs text-[#82AAFF] hover:underline">
                  Forgot password?
                </a>
              </div>
            </div>
            <Button type="submit" fullWidth size="md" loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-[#1E1E2E]" />
            <span className="text-[11px] text-[#8888AA]">or continue with</span>
            <div className="flex-1 h-px bg-[#1E1E2E]" />
          </div>

          <GoogleButton onClick={google} label="Continue with Google" />

          <p className="text-xs text-[#8888AA] mt-4 text-center">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="text-[#82AAFF] hover:underline">
              Sign up
            </Link>
          </p>
        </>
      ) : (
        <>
          <h1 className="font-display text-2xl font-bold mb-1">Verify your email</h1>
          <p className="text-sm text-[#8888AA] mb-4">
            Please enter the 6-digit verification code sent to <span className="text-white font-medium">{emailForVerification}</span>.
          </p>

          {otpError && (
            <div className="p-3 mb-3 text-xs rounded-xl bg-red-500/10 border border-red-500/20 text-[#FF3B55]">
              {otpError}
            </div>
          )}

          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <Input
              label="Verification Code"
              type="text"
              maxLength={6}
              placeholder="123456"
              className="py-2.5 text-center text-lg tracking-[0.5em] font-mono"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ""))}
            />

            <Button type="submit" fullWidth size="md" loading={otpLoading}>
              Verify & Sign In
            </Button>
          </form>

          <button
            onClick={() => setOtpSent(false)}
            className="w-full text-xs text-[#82AAFF] hover:underline mt-4 text-center block"
          >
            ← Back to Sign In
          </button>
        </>
      )}
    </AuthLayout>
  );
}
