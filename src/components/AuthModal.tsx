import { useState } from "react";
import { X } from "lucide-react";
import { LogoMark } from "./Logo";
import { useAuth } from "../contexts/AuthContext";

interface AuthModalProps {
  onClose: () => void;
  message?: string;
}

export function AuthModal({ onClose, message }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (mode === "signup") {
      if (password.length < 6) {
        setError("Password must be at least 6 characters");
        setLoading(false);
        return;
      }
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        onClose();
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <LogoMark size={22} />
            </div>
            <span className="text-lg font-bold text-gray-900">Media Wizard</span>
          </div>
          {message && (
            <p className="text-sm text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-4 py-2.5 mb-4">
              {message}
            </p>
          )}
          <h2 className="text-2xl font-bold text-gray-900">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {mode === "signup" ? "Free to get started, no credit card required" : "Sign in to continue"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {mode === "signup" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="John Doe"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
            {mode === "signup" && (
              <p className="text-xs text-gray-400 mt-1">At least 6 characters</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? mode === "signup" ? "Creating account..." : "Signing in..."
              : mode === "signup" ? "Create Account" : "Sign In"
            }
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-5">
          {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }}
            className="text-blue-600 font-semibold hover:text-blue-700 transition"
          >
            {mode === "signup" ? "Sign in" : "Sign up"}
          </button>
        </p>
      </div>
    </div>
  );
}
