"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase-client";
import { motion } from "framer-motion";
import { EyeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import zxcvbn from 'zxcvbn';


interface AuthCardProps {
  mode: "login" | "signup";
}

export default function AuthCard({ mode }: AuthCardProps) {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [fieldErrors, setFieldErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  }

  const validateFields = () => {
    let isValid = true;
    const errors = {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
    if (mode === "signup" && !fullName.trim()) {
      errors.fullName = "Full name is required.";
      isValid = false;
    }
    if (!email.trim()) {
      errors.email = "Email is required.";
      isValid = false;
    }
    else if (!emailRegex.test(email)) {
      errors.email = "Invalid email format.";
      isValid = false;
    }
    if (!password.trim()) {
      errors.password = "Password is required.";
      isValid = false;
    }
    else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
      isValid = false;
    }
    if (mode === "signup" && !confirmPassword.trim()) {
      errors.confirmPassword = "Confirm password is required.";
      isValid = false;
    }
    else if (mode === "signup" && confirmPassword !== password) {
      errors.confirmPassword = "Passwords do not match.";
      isValid = false;
    }
    const results = zxcvbn(password);
    if (results.score < 3 && mode === "signup" && password.length > 0) {
      errors.password = "Password is too weak. Please use a stronger password.";
      isValid = false;
    }
    
    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  if (!validateFields()) {
    setLoading(false);
    return;
  }

  if (mode === "signup") {
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      console.error("Error signing up:", error.message);
      setError(error.message);
    }else if( data.user?.identities?.length == 0 ){
      console.log('User already exists, please login instead.');
      setError("Email already exists");
    } 
    else {
      console.log("Signing user up:", { email, fullName });
    }

  } else {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("Signing user in:", { email });

    if (error) setError(error.message);
    else {
      router.push("/welcome-screen");
    }
  }

  // setLoading(false);
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-sm p-8 bg-white rounded-2xl shadow-lg"
    >
      <h2 className="text-xl font-bold mb-1 text-center">
        {mode === "login" ? "Welcome back to PromptBoard" : "Join PromptBoard"}
      </h2>
      <p className="text-sm text-center mb-6 text-gray-500">
        {mode === "login"
          ? "Your Personal prompt Library"
          : "Create your prompt management workspace"}
      </p>

      <div className="space-y-6">
        {mode === "signup" && (
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input type="text" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
            {fieldErrors.fullName && (
            <p className="text-red-500 text-sm">{fieldErrors.fullName}</p>
          )}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <Input type="email" placeholder="Enter your email"value={email} onChange={(e) => setEmail(e.target.value)} />
          {fieldErrors.email && (
        <p className="text-red-500 text-sm">{fieldErrors.email}</p>
      )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <div className="relative">
            <Input type={showPassword ? "text": "password"} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <EyeIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer" onClick={togglePasswordVisibility}/>
          </div>
          {fieldErrors.password && (
        <p className="text-red-500 text-sm">{fieldErrors.password}</p>
      )}
        </div>

        {mode === "signup" && (
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <div className="relative">
              <Input type="password" placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
              {/* <EyeIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" /> */}
              {fieldErrors.confirmPassword && (
            <p className="text-red-500 text-sm">{fieldErrors.confirmPassword}</p>
          )}
            </div>
          </div>
        )}

        {mode === "login" && (
          <div className="flex justify-end">
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot Password?
            </a>
            
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button className="w-full bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white hover:opacity-90" disabled={loading}>
          {loading ? "Processing..." : mode === "login" ? "Login" : "Sign Up"}
        </Button>
        </form>
        
      </div>
    </motion.div>
  );
}
