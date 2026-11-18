import { useEffect, useState, type FormEvent } from "react";
import { useAppContext } from "../controllers/AppContext";
import { ServerAuth } from "../config/apiClient";
import { useLoginNavigation } from "../config/authNavigation";
import Modal from "./Modal";

type Mode = "code" | "password" | "signup";
type Channels = { email: boolean; sms: boolean };

function AuthForm({ close }: { close: () => void }) {
  const { loginWithCode, loginWithEmail, signUpWithEmail } = useAppContext();
  const [channels, setChannels] = useState<Channels | null>(null);
  const [mode, setMode] = useState<Mode | null>(null);
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [challenge, setChallenge] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    ServerAuth.getCodeChannels(controller.signal)
      .then(setChannels)
      .catch(() => { if (!controller.signal.aborted) setChannels({ email: false, sms: false }); });
    return () => controller.abort();
  }, []);

  const canSend = Boolean(channels?.email || channels?.sms);
  const selected = mode ?? (channels ? (canSend ? "code" : "password") : null);
  const identifierLabel = channels?.email && channels.sms ? "شماره همراه یا ایمیل" :
    channels?.email ? "ایمیل" : "شماره همراه";

  function switchMode(next: Mode) {
    setMode(next); setError(""); setPassword(""); setChallenge(""); setCode("");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!selected || busy) return;
    setError("");
    setBusy(true);
    try {
      if (selected === "code") {
        if (!challenge) {
          const result = await ServerAuth.requestCode(identifier.trim());
          setChallenge(result.challengeId);
          return;
        }
        await loginWithCode(challenge, code, name);
      } else if (selected === "signup") {
        await signUpWithEmail(name, identifier, password);
      } else {
        await loginWithEmail(identifier, password);
      }
      close();
    } catch (cause) {
      const status = (cause as {status?: number})?.status;
      setError(status === 401 ? "ایمیل یا رمز عبور صحیح نیست." :
        status === 409 ? "این ایمیل قبلاً ثبت شده است." :
        status === 429 ? "تعداد تلاش‌ها زیاد است. کمی صبر کنید و دوباره تلاش کنید." :
        selected === "code" && status === 400 && cause instanceof Error ? cause.message :
        "ورود در حال حاضر انجام نشد. دوباره تلاش کنید.");
    } finally { setBusy(false); }
  }

  return <Modal title={selected === "signup" ? "ساخت حساب" : "ورود به آپتوس"} className="aptus-auth-modal" onClose={close}>
    {!selected ? <p role="status">در حال دریافت روش‌های ورود…</p> : <form onSubmit={submit} className="auth-form">
      {selected === "code" ? <>
        <p>{challenge ? "کد شش‌رقمی ارسال‌شده را وارد کنید. اعتبار کد پنج دقیقه است." : `${identifierLabel} خود را وارد کنید تا کد ورود ارسال شود.`}</p>
        {!challenge ? <label>{identifierLabel}<input key="code-target" autoFocus required dir="ltr"
          type={channels?.sms && channels.email ? "text" : channels?.email ? "email" : "tel"}
          value={identifier} onChange={e => setIdentifier(e.target.value)} autoComplete="username" maxLength={254}/></label> :
          <>
            <bdi dir="ltr">{identifier}</bdi>
            <label>کد تأیید<input key="verification-code" autoFocus required dir="ltr" inputMode="numeric" autoComplete="one-time-code"
              minLength={6} maxLength={6} value={code} onChange={e => setCode(e.target.value)}/></label>
            <label>نام شما (برای حساب جدید)<input value={name} onChange={e => setName(e.target.value)} autoComplete="name" maxLength={120}/></label>
            <button type="button" className="text-button" disabled={busy} onClick={() => { setChallenge(""); setCode(""); setError(""); }}>تغییر شماره یا ارسال دوباره</button>
          </>}
      </> : <>
        {selected === "signup" && <label>نام و نام خانوادگی<input required autoComplete="name" maxLength={120} value={name} onChange={e => setName(e.target.value)}/></label>}
        <label>ایمیل<input key="password-email" autoFocus required type="email" dir="ltr" autoComplete="username" maxLength={254}
          value={identifier} onChange={e => setIdentifier(e.target.value)}/></label>
        <label>رمز عبور<input required type="password" minLength={selected === "signup" ? 8 : undefined}
          autoComplete={selected === "signup" ? "new-password" : "current-password"} value={password} onChange={e => setPassword(e.target.value)}/></label>
      </>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <button type="submit" className="solid-button" disabled={busy}>{busy ? "لطفاً صبر کنید…" : selected === "code" ?
        (challenge ? "تأیید و ورود" : "ارسال کد") : selected === "signup" ? "ساخت حساب" : "ورود"}</button>
      <div className="auth-alternatives">
        {selected !== "password" && <button type="button" disabled={busy} onClick={() => switchMode("password")}>ورود با رمز عبور</button>}
        {canSend && selected !== "code" && <button type="button" disabled={busy} onClick={() => switchMode("code")}>ورود با کد یک‌بارمصرف</button>}
        {selected !== "signup" && <button type="button" disabled={busy} onClick={() => switchMode("signup")}>ثبت‌نام با ایمیل و رمز عبور</button>}
      </div>
    </form>}
  </Modal>;
}

export default function AuthModal() {
  const { open, closeLogin } = useLoginNavigation();
  const { user, authReady } = useAppContext();
  return open && authReady && !user ? <AuthForm close={closeLogin}/> : null;
}
