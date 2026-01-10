import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();

  // Demo credentials
  const DEMO_USER = "test";
  const DEMO_PASS = "test";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    return email.trim().length > 0 && password.trim().length > 0;
  }, [email, password]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (email.trim() === DEMO_USER && password.trim() === DEMO_PASS) {
      // Optional: store login flag for protected routes
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("loginUser", DEMO_USER);
      navigate("/search"); // change if your home route is different
      return;
    }

    setError("Invalid credentials. Use username: test and password: test.");
  };

  return (
    <div className="min-h-screen bg-[#cfe3e4] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-border p-10">
        <h1 className="text-2xl font-semibold text-center mb-10">
          Employment Agency
        </h1>

        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <label className="block text-sm font-medium mb-2">Email:</label>
            <input
              type="text"
              placeholder="Enter your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-input px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password:</label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-input px-4 py-3 text-sm pr-14 outline-none focus:ring-2 focus:ring-primary/30"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <div className="pt-2 flex flex-col items-center">
            <button
              type="submit"
              disabled={!canSubmit}
              className={`w-64 py-3 rounded-lg font-medium transition ${
                canSubmit
                  ? "bg-[#0f6f6d] text-white hover:opacity-90"
                  : "bg-[#0f6f6d]/40 text-white cursor-not-allowed"
              }`}
            >
              Log in
            </button>

            <div className="text-center mt-3 text-sm">
              <button
                type="button"
                className="block w-full text-muted-foreground hover:text-foreground"
                onClick={() => alert("Demo: use test / test")}
              >
                Forget Password
              </button>

              <button
                type="button"
                className="block w-full text-muted-foreground hover:text-foreground"
                onClick={() => alert("Sign Up is not part of this demo")}
              >
                Sign Up
              </button>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
              Demo credentials: <span className="font-medium">test / test</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
