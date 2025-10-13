import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import { MessageCircleIcon, LockIcon, MailIcon, UserIcon, LoaderIcon } from "lucide-react";
import { Link } from "react-router";

function LoginPage() {
  // define fields that we are fulfilling
  const [formData, setFormData] = useState({email: "", password: "" });
  const { login, isLoggingIn } = useAuthStore();
  // function to handle submit
  const handleSubmit = (e) => {
    e.preventDefault(); // prevent page from re loading on submit
    login(formData); // send data to backend
  };
  
  return (
    <div className="justify-center ">
      <BorderAnimatedContainer>
        <div className="rounded-2xl border border-slate-700/40 bg-gray-800/80 backdrop-blur p-8 shadow-2xl">
          <div className="text-center mb-8">
            <MessageCircleIcon className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <h2 className="text-2xl font-bold text-slate-200 mb-2">Welcome Back</h2>
            <p className="text-slate-400">Login to access your account</p>
          </div>
          {/*Handle submit button when submit is pressed*/}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/*Email input field*/}
            <div>
              <label className="auth-input-label">Email</label>
              <div className="relative">
                <MailIcon className="auth-input-icon" />
                <input // define placeholders and where data will go on submit
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input"
                  placeholder="johndoe@gmail.com"
                />
              </div>
            </div>
            {/*Password input field*/}
            <div>
              <label className="auth-input-label">Password</label>
              <div className="relative">
                <LockIcon className="auth-input-icon" />
                <input // define where data will go
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input"
                  placeholder="Enter your password"
                />
              </div>
            </div>
            {/*Submit Button*/}
            <button className="auth-btn w-full" type="submit" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <LoaderIcon className="mx-auto h-5 w-5 animate-spin" />
              ) : ( // text for button
                "Login"
              )}
            </button>
          </form>
          {/*Link to login page*/}
          <div className="mt-6 text-center">
            <Link to="/signup" className="auth-link">
              Don't have an account? Signup
            </Link>
          </div>
        </div>
      </BorderAnimatedContainer>
    </div>
  );
}

export default LoginPage;