"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { Loader2, AlertCircle } from "lucide-react";
import { useLoginMutation } from "@/services/authApi";
import { setCredentials } from "@/store/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [errorKey, setErrorKey] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const validateField = (name: string, value: string) => {
    switch (name) {
      case "email":
        if (value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email address";
        return "";
      case "password":
        if (value.length === 0) return "Password is required";
        return "";
      default:
        return "";
    }
  };

  const showError = (msg: string) => {
    setError(msg);
    setErrorKey((k) => k + 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setFieldErrors({ ...fieldErrors, [name]: validateField(name, value) });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const emailErr = validateField("email", form.email);
    const passwordErr = validateField("password", form.password);

    if (emailErr || passwordErr) {
      setFieldErrors({ email: emailErr, password: passwordErr });
      return;
    }

    try {
      const res = await login(form).unwrap();
      if (res.success && res.data) {
        dispatch(setCredentials({ user: res.data.user, token: res.data.token }));

        const redirect = searchParams.get("redirect");
        if (redirect) {
          router.push(redirect);
        } else if (res.data.user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      } else {
        showError(res.message || "Login failed");
      }
    } catch (err: any) {
      showError(err?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-md border">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

      {error && (
        <div
          key={errorKey}
          className="animate-slideDown animate-shake flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-md mb-4"
        >
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
              fieldErrors.email ? "border-red-400 focus:ring-red-400" : "focus:ring-black"
            }`}
          />
          {fieldErrors.email && (
            <p className="text-red-500 text-xs mt-1 animate-slideDown">{fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
              fieldErrors.password ? "border-red-400 focus:ring-red-400" : "focus:ring-black"
            }`}
          />
          {fieldErrors.password && (
            <p className="text-red-500 text-xs mt-1 animate-slideDown">{fieldErrors.password}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-sm text-center mt-4 text-gray-600">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-black font-medium underline">
          Register
        </Link>
      </p>
    </div>
  );
}