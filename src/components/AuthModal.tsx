import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { X, ArrowLeft } from "lucide-react";
import { useAppContext } from "../controllers/AppContext";
import { authUi } from "../config/authUi";

type AuthMode = "login" | "signup" | "forgot";

export default function AuthModal() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { locale, loginWithEmail, signUpWithEmail, resetPassword } = useAppContext();
  const copy = authUi(locale);

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (mode === "login") {
        await loginWithEmail(email, password);
        close();
      } else if (mode === "signup") {
        await signUpWithEmail(name, email, password);
        close();
      } else {
        await resetPassword(email);
        setSuccess(copy.resetSent);
      }
    } catch (err: any) {
      setError(err.message || (mode === "login" ? copy.invalidLogin : copy.genericError));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm text-left rtl:text-right">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden relative" dir={locale === "fa" ? "rtl" : "ltr"}>
        {mode !== "login" && (
          <button
            onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
            className="absolute top-4 left-4 rtl:left-auto rtl:right-4 p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors z-10"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
          </button>
        )}

        <button
          onClick={close}
          className="absolute top-4 right-4 rtl:right-auto rtl:left-4 p-1 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-colors z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 mt-2">
          <h2 className="text-2xl font-bold mb-2 text-center">
            {mode === "login" && copy.welcome}
            {mode === "signup" && copy.createAccount}
            {mode === "forgot" && copy.resetPassword}
          </h2>
          <p className="text-gray-500 mb-6 text-sm text-center">
            {mode === "login" && copy.loginIntro}
            {mode === "signup" && copy.signupIntro}
            {mode === "forgot" && copy.forgotIntro}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{copy.fullName}</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black outline-none" required />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{copy.email}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black outline-none" dir="ltr" required />
            </div>

            {mode !== "forgot" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">{copy.password}</label>
                  {mode === "login" && (
                    <button type="button" onClick={() => { setMode("forgot"); setError(""); setSuccess(""); }} className="text-xs text-blue-600 hover:underline">{copy.forgot}</button>
                  )}
                </div>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-black outline-none" dir="ltr" required minLength={8} />
              </div>
            )}

            {error && <p className="text-sm text-red-500">{error}</p>}
            {success && <p className="text-sm text-green-600">{success}</p>}

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors font-medium disabled:opacity-50">
              {loading && mode === "login" ? copy.signingIn : ""}
              {loading && mode === "signup" ? copy.creating : ""}
              {loading && mode === "forgot" ? copy.sending : ""}
              {!loading && mode === "login" && copy.signIn}
              {!loading && mode === "signup" && copy.signUp}
              {!loading && mode === "forgot" && copy.sendReset}
            </button>
          </form>

          {mode === "login" && (
            <div className="text-center text-sm">
              <span className="text-gray-500">{copy.noAccount} </span>
              <button type="button" onClick={() => { setMode("signup"); setError(""); }} className="font-medium text-black hover:underline">{copy.signUp}</button>
            </div>
          )}

          {mode === "signup" && (
            <div className="text-center text-sm">
              <span className="text-gray-500">{copy.hasAccount} </span>
              <button type="button" onClick={() => { setMode("login"); setError(""); }} className="font-medium text-black hover:underline">{copy.login}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
