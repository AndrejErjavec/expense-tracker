import { signUp } from "@expense-tracker/api";
import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignUp = async () => {
    console.log("handle signup");
    const data = await signUp(supabase, email, username, password);

    if (data) {
      navigate("/");
    }
  };
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <div className="max-w-md rounded-2xl border border-stone-200 bg-white p-8 shadow-[0_14px_30px_rgba(28,26,22,0.12)]">
        <h1 className="text-2xl font-semibold text-stone-900">Create account</h1>
        <p className="mt-2 text-sm text-stone-600">Start tracking expenses with a fresh profile.</p>
        <div className="mt-6 space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Full name</label>
            <input
              className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Email</label>
            <input
              className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
              type="email"
              placeholder="mail@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">Password</label>
            <input
              className="mt-2 w-full rounded-lg border border-stone-200 px-3 py-2 text-sm"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="w-full rounded-lg bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
            onClick={handleSignUp}
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
