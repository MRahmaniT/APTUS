import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { X, LogIn, ArrowLeft } from "lucide-react";
import { useAppContext } from "../controllers/AppContext";

type AuthMode = "login" | "signup" | "forgot";

export default function AuthModal() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, loginWithEmail, signUpWithEmail, resetPassword } = useAppContext();
  
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  const isOpen = searchParams.get("auth") === "login";

  const close = () => {
    navigate(location.pathname, { replace: true });
    setTimeout(() => {
      setMode("login");
      setError("");
      setSuccess("");
      setName("");
      setEmail("");
      setPassword("");
    }, 300);
  };

  const handleGoogleLogin = async () => {
    try {
      await login();
    } catch (err: any) {
      setError(err.message || "Google sign-in could not be started.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      if (mode === "login") {
        await loginWithEmail(email, password);
        close();
      } else if (mode === "signup") {
        await signUpWithEmail(name, email, password);
        setSuccess("Account created. If email confirmation is enabled, check your inbox before signing in.");
      } else if (mode === "forgot") {
        await resetPassword(email);
        setSuccess("Password reset link has been sent to your email.");
      }
    } catch (err: any) {
      setError(err.message || (mode === "login" ? "Invalid email or password" : "An error occurred"));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm text-left rtl:text-right">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden relative" dir={document.documentElement.dir}>
        {mode !== "login" && (
          <button 
            onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
            className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors z-10"
          >
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
          </button>
        )}

        <button 
          onClick={close}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 mt-2">
          <h2 className="text-2xl font-bold mb-2 text-center">
            {mode === "login" && "Welcome Back"}
            {mode === "signup" && "Create Account"}
            {mode === "forgot" && "Reset Password"}
          </h2>
          <p className="text-gray-500 mb-6 text-sm text-center">
            {mode === "login" && "Sign in to access your dashboard"}
            {mode === "signup" && "Join us to get started"}
            {mode === "forgot" && "Enter your email to receive a link"}
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black outline-none" required />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black outline-none dir-ltr ltr" dir="ltr" required />
            </div>
            
            {mode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  {mode === "login" && (
                    <button type="button" onClick={() => { setMode("forgot"); setError(""); }} className="text-xs text-blue-600 hover:underline">Forgot?</button>
                  )}
                </div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black outline-none dir-ltr ltr" dir="ltr" required minLength={6} />
              </div>
            )}
            
            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}
            
            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium disabled:opacity-50">
              {loading && mode === "login" ? "Signing in..." : ""}
              {loading && mode === "signup" ? "Creating account..." : ""}
              {loading && mode === "forgot" ? "Sending link..." : ""}
              {!loading && mode === "login" && "Sign in"}
              {!loading && mode === "signup" && "Sign up"}
              {!loading && mode === "forgot" && "Send Reset Link"}
            </button>
          </form>

          {mode === "login" && (
            <div className="text-center text-sm mb-6">
              <span className="text-gray-500">Don't have an account? </span>
              <button type="button" onClick={() => { setMode("signup"); setError(""); }} className="font-medium text-black hover:underline">Sign up</button>
            </div>
          )}

          {mode === "signup" && (
            <div className="text-center text-sm mb-6">
              <span className="text-gray-500">Already have an account? </span>
              <button type="button" onClick={() => { setMode("login"); setError(""); }} className="font-medium text-black hover:underline">Log in</button>
            </div>
          )}

          {(mode === "login" || mode === "signup") && (
            <>
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">Or continue with</span></div>
              </div>

              <button onClick={handleGoogleLogin} type="button" className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-black rounded-md hover:bg-gray-50 transition-colors font-medium">
                <LogIn className="w-5 h-5" />
                Google
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
