import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthField, PasswordField } from "@/components/auth/AuthFields";
import {
  AuthCheckbox,
  AuthDivider,
  AuthSubmit,
  GoogleButton,
} from "@/components/auth/AuthControls";
import { PasswordStrengthMeter } from "@/components/auth/PasswordStrengthMeter";
import { isValidEmail, scorePassword } from "@/lib/auth-validation";
import { signUpWithEmail } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create account — Sprocktd" },
      {
        name: "description",
        content:
          "Create a Sprocktd account to build collections, track your watchlist, and explore cinema through themes and connections.",
      },
      { property: "og:title", content: "Create account — Sprocktd" },
      {
        property: "og:description",
        content: "Join Sprocktd and start your own curated film archive.",
      },
    ],
  }),
  component: SignUp,
});

type Fields = {
  name: string;
  username: string;
  email: string;
  password: string;
  confirm: string;
};

type Errors = Partial<Record<keyof Fields | "terms", string>>;

function validate(f: Fields, terms: boolean): Errors {
  const e: Errors = {};
  if (!f.name.trim()) e.name = "Please enter your full name.";
  if (!f.username.trim()) e.username = "Please choose a username.";
  else if (!/^[a-zA-Z0-9_]{3,20}$/.test(f.username.trim()))
    e.username = "3–20 characters, letters, numbers, or underscores.";
  if (!f.email.trim()) e.email = "Please enter your email address.";
  else if (!isValidEmail(f.email)) e.email = "That doesn't look like a valid email.";
  if (!f.password) e.password = "Please create a password.";
  else if (scorePassword(f.password).score < 2)
    e.password = "Use at least 8 characters with a mix of cases or symbols.";
  if (!f.confirm) e.confirm = "Please confirm your password.";
  else if (f.confirm !== f.password) e.confirm = "Passwords don't match.";
  if (!terms) e.terms = "Please accept the terms to continue.";
  return e;
}

function SignUp() {
  const [fields, setFields] = useState<Fields>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [terms, setTerms] = useState(false);
  const [touched, setTouched] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const errors = validate(fields, terms);
  const shown: Errors = touched ? errors : {};
  const isValid = Object.keys(errors).length === 0;

  const set = (key: keyof Fields) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setFields((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start building your own curated film archive."
      footer={
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link to="/signin" className="text-foreground hover:text-primary">
            Sign in
          </Link>
        </p>
      }
    >
      <form
        noValidate
        className="mt-8 space-y-4"
        onBlur={() => setTouched(true)}
        onSubmit={async (e) => {
            e.preventDefault();
            setTouched(true);
            setAuthError(null);

            if (!isValid) {
              setSubmitted(false);
              return;
            }

            setLoading(true);

            try {
              const { error } = await signUpWithEmail({
                email: fields.email.trim(),
                password: fields.password,
                name: fields.name.trim(),
                username: fields.username.trim(),
              });

              if (error) {
                setAuthError(error.message);
                setSubmitted(false);
                return;
              }

              setSubmitted(true);
            } catch (error) {
              console.error(error);
              setAuthError("Something went wrong while creating your account.");
              setSubmitted(false);
            } finally {
              setLoading(false);
            }
}}
      >
        <AuthField
          label="Full name"
          autoComplete="name"
          value={fields.name}
          onChange={set("name")}
          placeholder="Ada Lovelace"
          error={shown.name}
        />
        <AuthField
          label="Username"
          autoComplete="username"
          value={fields.username}
          onChange={set("username")}
          placeholder="ada_l"
          error={shown.username}
        />
        <AuthField
          label="Email"
          type="email"
          autoComplete="email"
          value={fields.email}
          onChange={set("email")}
          placeholder="you@example.com"
          error={shown.email}
        />

        <div>
          <PasswordField
            label="Password"
            autoComplete="new-password"
            value={fields.password}
            onChange={set("password")}
            placeholder="••••••••"
            error={shown.password}
          />
          <PasswordStrengthMeter password={fields.password} />
        </div>

        <PasswordField
          label="Confirm password"
          autoComplete="new-password"
          value={fields.confirm}
          onChange={set("confirm")}
          placeholder="••••••••"
          error={shown.confirm}
        />

        <AuthCheckbox
          id="terms"
          checked={terms}
          onChange={(v) => {
            setTerms(v);
            setTouched(true);
          }}
          error={shown.terms}
        >
          I agree to the Terms &amp; Conditions and Privacy Policy.
        </AuthCheckbox>

        <AuthSubmit disabled={!isValid || loading}>
          {loading ? "Creating account…" : "Create account"}
        </AuthSubmit>

        {submitted ? (
          <p role="status" className="text-center text-xs text-success">
            Account created successfully. Check your email if confirmation is required.
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
