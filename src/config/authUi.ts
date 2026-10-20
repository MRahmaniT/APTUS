import { Locale } from "./translations";

export const AUTH_UI: Record<Locale, {
  welcome: string;
  createAccount: string;
  resetPassword: string;
  loginIntro: string;
  signupIntro: string;
  forgotIntro: string;
  fullName: string;
  email: string;
  password: string;
  forgot: string;
  signingIn: string;
  creating: string;
  sending: string;
  signIn: string;
  signUp: string;
  sendReset: string;
  noAccount: string;
  hasAccount: string;
  login: string;
  orContinue: string;
  accountCreated: string;
  resetSent: string;
  invalidLogin: string;
  genericError: string;
  googleError: string;
}> = {
  en: {
    welcome: "Welcome back",
    createAccount: "Create account",
    resetPassword: "Reset password",
    loginIntro: "Sign in to access your dashboard",
    signupIntro: "Create your account to get started",
    forgotIntro: "Enter your email to receive a reset link",
    fullName: "Full name",
    email: "Email",
    password: "Password",
    forgot: "Forgot?",
    signingIn: "Signing in…",
    creating: "Creating account…",
    sending: "Sending link…",
    signIn: "Sign in",
    signUp: "Sign up",
    sendReset: "Send reset link",
    noAccount: "Don’t have an account?",
    hasAccount: "Already have an account?",
    login: "Log in",
    orContinue: "Or continue with",
    accountCreated: "Account created. If email confirmation is enabled, check your inbox before signing in.",
    resetSent: "Password reset link has been sent to your email.",
    invalidLogin: "Invalid email or password",
    genericError: "An error occurred",
    googleError: "Google sign-in could not be started.",
  },
  fa: {
    welcome: "خوش آمدید",
    createAccount: "ایجاد حساب کاربری",
    resetPassword: "بازیابی رمز عبور",
    loginIntro: "برای دسترسی به پنل خود وارد شوید",
    signupIntro: "برای شروع حساب کاربری خود را ایجاد کنید",
    forgotIntro: "ایمیل خود را وارد کنید تا لینک بازیابی ارسال شود",
    fullName: "نام و نام خانوادگی",
    email: "ایمیل",
    password: "رمز عبور",
    forgot: "فراموش کرده‌اید؟",
    signingIn: "در حال ورود…",
    creating: "در حال ایجاد حساب…",
    sending: "در حال ارسال لینک…",
    signIn: "ورود",
    signUp: "ثبت‌نام",
    sendReset: "ارسال لینک بازیابی",
    noAccount: "حساب کاربری ندارید؟",
    hasAccount: "قبلاً حساب ساخته‌اید؟",
    login: "ورود",
    orContinue: "یا ادامه با",
    accountCreated: "حساب ایجاد شد. اگر تأیید ایمیل فعال است، پیش از ورود صندوق ورودی خود را بررسی کنید.",
    resetSent: "لینک بازیابی رمز عبور به ایمیل شما ارسال شد.",
    invalidLogin: "ایمیل یا رمز عبور صحیح نیست",
    genericError: "خطایی رخ داد",
    googleError: "شروع ورود با گوگل ممکن نبود.",
  },
  tr: {
    welcome: "Tekrar hoş geldiniz",
    createAccount: "Hesap oluştur",
    resetPassword: "Şifreyi sıfırla",
    loginIntro: "Panelinize erişmek için giriş yapın",
    signupIntro: "Başlamak için hesabınızı oluşturun",
    forgotIntro: "Sıfırlama bağlantısı almak için e-postanızı girin",
    fullName: "Ad soyad",
    email: "E-posta",
    password: "Şifre",
    forgot: "Unuttunuz mu?",
    signingIn: "Giriş yapılıyor…",
    creating: "Hesap oluşturuluyor…",
    sending: "Bağlantı gönderiliyor…",
    signIn: "Giriş yap",
    signUp: "Kayıt ol",
    sendReset: "Sıfırlama bağlantısı gönder",
    noAccount: "Hesabınız yok mu?",
    hasAccount: "Zaten hesabınız var mı?",
    login: "Giriş yap",
    orContinue: "Veya şununla devam et",
    accountCreated: "Hesap oluşturuldu. E-posta doğrulaması açıksa giriş yapmadan önce gelen kutunuzu kontrol edin.",
    resetSent: "Şifre sıfırlama bağlantısı e-postanıza gönderildi.",
    invalidLogin: "E-posta veya şifre geçersiz",
    genericError: "Bir hata oluştu",
    googleError: "Google ile giriş başlatılamadı.",
  },
};

export function authUi(locale: Locale) {
  return AUTH_UI[locale];
}
