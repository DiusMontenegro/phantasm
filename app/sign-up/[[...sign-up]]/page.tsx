import { SignUp } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SignUpPage() {
  const { userId } = await auth();
  if (userId) {
    redirect("/dashboard");
  }

  return (
    <main className="auth-page">
      <div className="auth-brand" aria-label="PHANTASM">
        <span className="auth-brand-mark" aria-hidden="true">P</span>
        PHANTASM
      </div>
      <div className="auth-card">
        <SignUp
          forceRedirectUrl="/dashboard"
          fallbackRedirectUrl="/dashboard"
          appearance={{
            variables: {
              colorBackground: "#101116",
              colorPrimary: "#9b86ff",
              borderRadius: "12px",
              fontFamily: 'Inter, "Segoe UI", sans-serif',
            },
          }}
        />
      </div>
    </main>
  );
}
