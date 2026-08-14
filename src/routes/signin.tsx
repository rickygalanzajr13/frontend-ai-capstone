import {
  createFileRoute,
  Link,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { useAuth } from "@/hooks/use-auth";


import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthField, PasswordField } from "@/components/auth/AuthFields";
import {
  AuthCheckbox,
  AuthDivider,
  AuthSubmit,
  GoogleButton,
} from "@/components/auth/AuthControls";
import { isValidEmail } from "@/lib/auth-validation";
import { signInWithEmail } from "@/lib/auth";


export const Route = createFileRoute("/signin")({
  head: () => ({
    meta: [
      { title: "Sign in — Sprocktd" },
      {
        name: "description",
        content:
          "Sign in to Sprocktd to save collections, follow themes, and pick up your film discoveries where you left off.",
      },
      { property: "og:title", content: "Sign in — Sprocktd" },
      {
        property: "og:description",
        content: "Access your Sprocktd archive, collections, and AI film companion.",
      },
    ],
  }),
  component: SignIn,
});

type Errors = { email?: string; password?: string };

function SignIn() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  // Supabase is the source of truth: once a session exists, leave the page.
  useEffect(() => {
    if (!authLoading && user) navigate({ to: "/", replace: true });
  }, [authLoading, user, navigate]);

  const validate = (): Errors => {
    const next: Errors = {};
    if (!email.trim()) next.email = "Please enter your email address.";
    else if (!isValidEmail(email)) next.email = "That doesn't look like a valid email.";
    if (!password) next.password = "Please enter your password.";
    return next;
  };


  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue exploring the archive."
      footer={
        <p className="text-xs text-muted-foreground">
          New to Sprocktd?{" "}
          <Link to="/signup" className="text-foreground hover:text-primary">
            Create an account
          </Link>
        </p>
      }
    >
      <form
        noValidate
        className="mt-8 space-y-4"
        onSubmit={async (e) => {
          e.preventDefault();
          setAuthError("");
          setSubmitted(false);

          const next = validate();
          setErrors(next);
          if (Object.keys(next).length > 0) return;

          setLoading(true);
          try {
            const { error } = await signInWithEmail(email, password);
            if (error) {
              setAuthError(error.message);
              return;
            }
            setSubmitted(true);
            // useAuth picks up SIGNED_IN; redirect once the session lands.
            navigate({ to: "/", replace: true });
          } catch (err) {
            console.error("Sign-in failed:", err);
            setAuthError("Something went wrong while signing you in.");
          } finally {
            setLoading(false);
          }
        }}

      >
        <AuthField
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          error={errors.email}
        />

        <PasswordField
          label="Password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          error={errors.password}
          hint={
            <Link
              to="/signin"
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Forgot password?
            </Link>
          }
        />

        <AuthCheckbox id="remember-me" checked={remember} onChange={setRemember}>
          Remember me on this device
        </AuthCheckbox>

        <AuthSubmit disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </AuthSubmit>

        {submitted ? (
            <p role="status" className="text-center text-xs text-success">
              Signed in successfully.
            </p>
          ) : null}

          {authError ? (
            <p role="alert" className="text-center text-xs text-destructive">
              {authError}
            </p>
          ) : null}
      </form>

      <AuthDivider />
      <GoogleButton label="Continue with Google" />
    </AuthLayout>
  );
}
