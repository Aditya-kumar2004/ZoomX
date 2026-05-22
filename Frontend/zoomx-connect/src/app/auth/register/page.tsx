"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Eye, EyeOff, X, Shield, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AuthLayout, GoogleButton } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/ZInput";
import { Button } from "@/components/ui/ZButton";
import { useAuth } from "@/hooks/useAuth";
import { authAPI } from "@/services/api";
import { useGoogleLogin } from "@react-oauth/google";

interface FormVals {
  name: string;
  email: string;
  password: string;
  confirm: string;
  tos: boolean;
}

function strength(pw: string): {
  level: 0 | 1 | 2 | 3;
  label: string;
  color: string;
  width: string;
} {
  if (!pw) return { level: 0, label: "", color: "transparent", width: "0%" };
  if (pw.length < 6)
    return { level: 1, label: "Weak", color: "#FF3B55", width: "33%" };
  const med = pw.length >= 6 && /\d/.test(pw);
  const strong =
    pw.length >= 10 && /[A-Z]/.test(pw) && /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw);
  if (strong) return { level: 3, label: "Strong", color: "#00C566", width: "100%" };
  if (med) return { level: 2, label: "Medium", color: "#FFB23D", width: "66%" };
  return { level: 1, label: "Weak", color: "#FF3B55", width: "33%" };
}

/* ─── Section helper ─── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-white font-semibold text-sm mb-1.5">{title}</h3>
      <div className="text-[#8888AA] text-xs leading-relaxed">{children}</div>
    </div>
  );
}

/* ─── Modal Component ─── */
function PolicyModal({
  open,
  onClose,
  type,
}: {
  open: boolean;
  onClose: () => void;
  type: "tos" | "privacy";
}) {
  if (!open) return null;
  const isTos = type === "tos";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[82vh] flex flex-col rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        style={{ background: "#111118" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06] flex-shrink-0">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: isTos
                ? "linear-gradient(135deg,rgba(45,111,255,0.15),rgba(123,92,255,0.15))"
                : "linear-gradient(135deg,rgba(0,197,102,0.15),rgba(45,111,255,0.15))",
              border: isTos ? "1px solid rgba(45,111,255,0.3)" : "1px solid rgba(0,197,102,0.3)",
            }}
          >
            {isTos ? (
              <FileText className="w-4 h-4 text-[#82AAFF]" />
            ) : (
              <Shield className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-display font-bold text-white text-base">
              {isTos ? "Terms of Service" : "Privacy Policy"}
            </h2>
            <p className="text-[10px] text-[#44445A]">Last updated: May 2025</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[#8888AA] hover:text-white hover:bg-white/10 transition-all duration-200 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">
          {isTos ? (
            <>
              <Section title="👋 Welcome to ZoomX">
                By creating an account and using ZoomX, you agree to follow these simple rules. If you don&apos;t agree, please don&apos;t use the service.
              </Section>
              <Section title="✅ What You Can Do">
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>Create and host video meetings with your team</li>
                  <li>Share your screen, chat, and collaborate in real time</li>
                  <li>Invite guests to join your meetings via link</li>
                  <li>Use ZoomX for personal or business purposes</li>
                </ul>
              </Section>
              <Section title="🚫 What You Cannot Do">
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>Use ZoomX for illegal or harmful activities</li>
                  <li>Record meetings without the consent of all participants</li>
                  <li>Share someone else&apos;s meeting link without permission</li>
                  <li>Attempt to hack, disrupt, or abuse the platform</li>
                  <li>Spam, harass, or bully other users</li>
                </ul>
              </Section>
              <Section title="💳 Payments & Plans">
                Free accounts are available with limitations. Paid plans are billed monthly or yearly. You can cancel anytime — your access continues until the end of the billing period. No refunds for partial months.
              </Section>
              <Section title="🔒 Your Account">
                You&apos;re responsible for keeping your password safe. Don&apos;t share your account. If you think someone accessed your account without permission, contact us immediately.
              </Section>
              <Section title="⚠️ Service Availability">
                We aim for 99.99% uptime but cannot guarantee the service will always be available. We may perform maintenance and will try to give advance notice.
              </Section>
              <Section title="📞 Contact Us">
                Questions? Email us at{" "}
                <span className="text-[#82AAFF]">support@zoomx.app</span>
              </Section>
            </>
          ) : (
            <>
              <Section title="🔍 What Data We Collect">
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li><span className="text-white/70 font-medium">Account info</span> — your name, email, and password (encrypted)</li>
                  <li><span className="text-white/70 font-medium">Usage data</span> — meeting duration, features used, device type</li>
                  <li><span className="text-white/70 font-medium">Meeting data</span> — only while a meeting is live; not stored after it ends</li>
                </ul>
              </Section>
              <Section title="🎯 Why We Collect It">
                <ul className="list-disc list-inside space-y-1 mt-1">
                  <li>To provide and improve the ZoomX service</li>
                  <li>To send you important account notifications</li>
                  <li>To keep your account secure</li>
                  <li>To understand how people use ZoomX (anonymously)</li>
                </ul>
              </Section>
              <Section title="🤝 Who We Share It With">
                We <span className="text-white/70 font-medium">do not sell</span> your personal data. We only share data with:
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Our hosting providers (to run the service)</li>
                  <li>Payment processors (to handle billing securely)</li>
                  <li>Law enforcement, only if legally required</li>
                </ul>
              </Section>
              <Section title="🛡️ How We Protect It">
                All data is encrypted in transit (HTTPS) and at rest. Passwords are hashed and never stored in plain text. We use industry-standard security practices and regular audits.
              </Section>
              <Section title="🗑️ Your Rights">
                You can at any time:
                <ul className="list-disc list-inside space-y-1 mt-2">
                  <li>Request a copy of your data</li>
                  <li>Ask us to delete your account and all associated data</li>
                  <li>Opt out of marketing emails</li>
                  <li>Update or correct your information</li>
                </ul>
              </Section>
              <Section title="🍪 Cookies">
                We use cookies only to keep you logged in and remember your preferences. We don&apos;t use tracking or advertising cookies.
              </Section>
              <Section title="📞 Contact Us">
                For privacy concerns, email{" "}
                <span className="text-[#82AAFF]">privacy@zoomx.app</span>
              </Section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/[0.06] flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
            style={{ background: "linear-gradient(135deg,#2D6FFF,#7B5CFF)" }}
          >
            Got it, close
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Register Component ─── */
export default function Register() {
  const { login } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormVals>();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState<"tos" | "privacy" | null>(null);

  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [emailForVerification, setEmailForVerification] = useState("");

  const pw = watch("password") || "";
  const pwStrength = useMemo(() => strength(pw), [pw]);

  const onSubmit = async (data: FormVals) => {
    setLoading(true);
    setRegError(null);
    try {
      await authAPI.register({
        name: data.name,
        email: data.email,
        password: data.password,
      });
      setEmailForVerification(data.email);
      setOtpSent(true);
    } catch (err: any) {
      setRegError(err.message || "Registration failed. Please try again.");
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
      setRegError(null);
      try {
        const res = await authAPI.googleLogin(tokenResponse.access_token);
        login(res.user, res.tokens);
        router.push("/dashboard");
      } catch (err: any) {
        setRegError(err.message || "Google Sign-In failed.");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setRegError("Google Login Failed"),
  });

  return (
    <>
      <PolicyModal open={modal === "tos"} onClose={() => setModal(null)} type="tos" />
      <PolicyModal open={modal === "privacy"} onClose={() => setModal(null)} type="privacy" />

      <AuthLayout
        side={
          <div>
            <h2 className="font-display text-4xl lg:text-5xl font-extrabold tracking-tight leading-none text-white">
              Join{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2D6FFF] to-[#7B5CFF]">
                50,000+
              </span>
              <br />
              teams already using ZoomX
            </h2>
            <p className="text-[#8888AA] mt-4 max-w-sm text-sm leading-relaxed font-sans font-medium">
              Built for fast-moving teams who refuse to compromise on quality. Secure, scalable, and beautifully designed.
            </p>

            <div className="mt-6 relative bg-white/[0.02] border border-white/5 rounded-2xl p-4 backdrop-blur-md overflow-hidden group shadow-2xl">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full pointer-events-none opacity-20 blur-xl bg-emerald-500" />
              <div className="flex items-center justify-between mb-3 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="w-2 h-2 rounded-full bg-emerald-500 absolute" />
                  <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest ml-1">Live Room Active</span>
                </div>
                <span className="text-[9px] text-[#8888AA] font-bold bg-white/5 py-0.5 px-2 rounded-full uppercase tracking-wider">HD Video + Audio</span>
              </div>
              <div className="flex items-center gap-3.5 relative z-10">
                <div className="flex -space-x-2.5">
                  {[
                    { name: "Alex", bg: "bg-gradient-to-tr from-blue-500 to-indigo-500" },
                    { name: "Sarah", bg: "bg-gradient-to-tr from-purple-500 to-pink-500" },
                    { name: "Marcus", bg: "bg-gradient-to-tr from-amber-500 to-orange-500" },
                    { name: "Elena", bg: "bg-gradient-to-tr from-emerald-500 to-teal-500" },
                  ].map((av) => (
                    <div
                      key={av.name}
                      className={`w-8 h-8 rounded-full border-2 border-[#0A0A0F] flex items-center justify-center text-[10px] font-extrabold text-white shadow-lg ${av.bg}`}
                      title={av.name}
                    >
                      {av.name.charAt(0)}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-[#0A0A0F] bg-[#1E1E2E] flex items-center justify-center text-[9px] font-extrabold text-[#8888AA] shadow-lg">
                    +18
                  </div>
                </div>
                <div>
                  <p className="text-xs font-extrabold text-white leading-tight">Product Sync Session</p>
                  <p className="text-[10px] text-[#8888AA] font-medium mt-0.5">ZoomX immersive corridor</p>
                </div>
              </div>
            </div>
          </div>
        }
        stats={[
          { label: "Active Teams", value: "50K+" },
          { label: "Platform Uptime", value: "99.99%" },
          { label: "Global Presence", value: "150+" },
        ]}
      >
        {!otpSent ? (
          <>
            <h1 className="font-display text-2xl font-bold mb-1">Create your account</h1>
            <p className="text-sm text-[#8888AA] mb-4">Start your free ZoomX account today</p>

            {regError && (
              <div className="p-3 mb-3 text-xs rounded-xl bg-red-500/10 border border-red-500/20 text-[#FF3B55]">
                {regError}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <Input
                label="Full name"
                placeholder="Jane Doe"
                className="py-2 text-sm"
                {...register("name", { required: "Name required" })}
                error={errors.name?.message}
              />
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
                  placeholder="At least 6 characters"
                  className="py-2 text-sm"
                  {...register("password", { required: "Password required" })}
                  error={errors.password?.message}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShow((v) => !v)}
                      aria-label="Toggle"
                    >
                      {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                />
                {pw && (
                  <div className="mt-1.5">
                    <div className="h-1 bg-[#1E1E2E] rounded-full overflow-hidden">
                      <div
                        className="h-full transition-all duration-300"
                        style={{ width: pwStrength.width, background: pwStrength.color }}
                      />
                    </div>
                    <div className="text-[10px] mt-0.5" style={{ color: pwStrength.color }}>
                      {pwStrength.label}
                    </div>
                  </div>
                )}
              </div>
              <Input
                label="Confirm password"
                type={show ? "text" : "password"}
                placeholder="Re-enter password"
                className="py-2 text-sm"
                {...register("confirm", {
                  required: "Please confirm",
                  validate: (v) => v === pw || "Passwords don't match",
                })}
                error={errors.confirm?.message}
              />

              <label className="flex items-start gap-2 text-xs text-[#8888AA]">
                <input
                  type="checkbox"
                  className="mt-0.5 accent-[#2D6FFF]"
                  {...register("tos", { required: "Required" })}
                />
                <span>
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setModal("tos")}
                    className="text-[#82AAFF] hover:underline"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => setModal("privacy")}
                    className="text-[#82AAFF] hover:underline"
                  >
                    Privacy Policy
                  </button>
                  .
                </span>
              </label>
              {errors.tos && (
                <div className="text-xs text-[#FF3B55]">{errors.tos.message}</div>
              )}

              <Button type="submit" fullWidth size="md" loading={loading}>
                Create Account
              </Button>
            </form>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px bg-[#1E1E2E]" />
              <span className="text-[11px] text-[#8888AA]">or continue with</span>
              <div className="flex-1 h-px bg-[#1E1E2E]" />
            </div>

            <GoogleButton onClick={google} label="Continue with Google" />

            <p className="text-xs text-[#8888AA] mt-4 text-center">
              Already have an account?{" "}
              <Link href="/auth/signin" className="text-[#82AAFF] hover:underline">
                Sign in
              </Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="font-display text-2xl font-bold mb-1">Verify your email</h1>
            <p className="text-sm text-[#8888AA] mb-4">
              We have sent a 6-digit verification code to <span className="text-white font-medium">{emailForVerification}</span>. Please enter it below to complete your registration.
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
                Verify & Register
              </Button>
            </form>

            <button
              onClick={() => setOtpSent(false)}
              className="w-full text-xs text-[#82AAFF] hover:underline mt-4 text-center block"
            >
              ← Back to Registration
            </button>
          </>
        )}
      </AuthLayout>
    </>
  );
}
