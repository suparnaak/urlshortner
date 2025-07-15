import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Login from "./Login";
import Register from "./Register";

export default function Welcome() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const { setError } = useAuth();

  const handleModeChange = (newMode: "login" | "register") => {
    setMode(newMode);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">LinkSnap</h1>
          <p className="text-gray-600">Shorten your URLs with style</p>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/20">
          {/* Toggle Buttons */}
          <div className="flex mb-8 bg-gray-100 rounded-2xl p-1">
            <button
              onClick={() => handleModeChange("login")}
              className={`flex-1 py-3 text-center rounded-xl font-medium transition-all duration-200 ${
                mode === "login"
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => handleModeChange("register")}
              className={`flex-1 py-3 text-center rounded-xl font-medium transition-all duration-200 ${
                mode === "register"
                  ? "bg-white text-blue-600 shadow-md"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form Content */}
          {mode === "login" ? <Login /> : <Register />}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© 2025 LinkSnap. </p>
        </div>
      </div>
    </div>
  );
}
