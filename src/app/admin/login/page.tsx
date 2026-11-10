import LoginForm from "./login-form";

export const metadata = {
  title: "Вход — Pixel Flow",
};

export default function AdminLoginPage() {
  return (
    <main className="grain relative flex min-h-screen items-center justify-center px-5">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-indigo-600/15 blur-[140px]" />
      <div className="relative w-full max-w-sm">
        <div className="glass rounded-3xl p-8">
          <div className="flex justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/25 to-violet-500/20 text-3xl ring-1 ring-indigo-400/25">
              🔒
            </span>
          </div>
          <h1 className="mt-6 text-center font-display text-xl font-bold text-white">
            Админ-панель
          </h1>
          <p className="mt-2 text-center text-sm text-slate-500">
            Pixel Flow · введите пароль для входа
          </p>
          <LoginForm />
        </div>
        <p className="mt-5 text-center text-xs text-slate-600">
          Доступ только для владельца проекта
        </p>
      </div>
    </main>
  );
}
