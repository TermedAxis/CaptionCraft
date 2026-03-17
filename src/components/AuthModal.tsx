import { useState } from "react";
import { X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";

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
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-sm bg-bat-surface border border-bat-border rounded-2xl p-7 shadow-bat-lg"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-bat-muted hover:text-white hover:bg-bat-surface2 rounded-lg transition-all duration-200"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-5">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
              <span className="text-black font-bold text-xs">SB</span>
            </div>
            <span className="text-sm font-semibold text-white">Social Bat</span>
          </div>
          {message && (
            <div className="mb-4 px-3 py-2.5 bg-bat-bg border border-bat-border rounded-xl text-xs text-bat-muted">
              {message}
            </div>
          )}
          <h2 className="text-xl font-bold text-white mb-1">
            {mode === "signup" ? "Create your account" : "Welcome back"}
          </h2>
          <p className="text-sm text-bat-muted">
            {mode === "signup" ? "Free to start — no credit card needed" : "Sign in to continue"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-3 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-xs">
              {error}
            </div>
          )}

          {mode === "signup" && (
            <div>
              <label className="block text-xs font-medium text-bat-muted mb-1.5">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="John Doe"
                className="bat-input"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-bat-muted mb-1.5">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="bat-input"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-bat-muted mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="bat-input"
            />
            {mode === "signup" && (
              <p className="text-xs text-bat-subtle mt-1">At least 6 characters</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bat-btn-primary w-full mt-2"
          >
            {loading
              ? mode === "signup" ? "Creating account..." : "Signing in..."
              : mode === "signup" ? "Create Account" : "Sign In"
            }
          </button>
        </form>

        <p className="text-center text-xs text-bat-muted mt-5">
          {mode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(""); }}
            className="text-white font-semibold hover:text-bat-accent transition-colors"
          >
            {mode === "signup" ? "Sign in" : "Sign up"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
