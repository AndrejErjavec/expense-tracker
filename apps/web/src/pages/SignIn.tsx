import { signIn } from "@expense-tracker/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignIn = async () => {
    const data = await signIn(supabase, email, password);
    if (data) {
      navigate("/");
    }
  };

  return (
    <div className="max-w-6xl px-6 py-12">
      <div className="max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-[0_14px_30px_rgba(28,26,22,0.12)]">
        <h1 className="text-2xl font-semibold text-stone-900">Sign in</h1>
        <p className="mt-2 text-sm text-stone-600">Enter your credentials to access your dashboard.</p>
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Email</label>
            <input
              className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
              type="email"
              placeholder="mails@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Password</label>
            <input
              className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="w-full rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
            onClick={handleSignIn}
          >
            Sign in
          </button>
          <div className="mt-3 text-center">
            <span className="text-center text-sm text-stone-600">
              Don't have an account? <Link to="/sign-in">Sign Up</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
