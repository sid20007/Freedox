"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useRole, Role } from "@/context/RoleContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { setIdentity } = useRole();

  const [name, setName] = useState("");
  const [role, setRole] = useState<Role | "">("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const isFormValid = name.trim() !== "" && role !== "" && password !== "";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isFormValid) return;

    // Validate password based on role
    if (role === "Faculty" && password !== "faculty123") {
      setError("Incorrect password for Faculty role.");
      return;
    }
    
    if (role === "Dean" && password !== "dean123") {
      setError("Incorrect password for Dean role.");
      return;
    }

    // Success!
    setIdentity(name, role as Role);
    router.push("/events");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-2xl font-extrabold text-slate-900 tracking-tight">
          Event Management Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600 font-medium">
          St Aloysius SOE
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-semibold text-slate-700 mb-1"
              >
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-semibold text-slate-700 mb-1"
              >
                Role
              </label>
              <Select value={role} onValueChange={(val) => setRole(val as Role)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Faculty">Faculty</SelectItem>
                  <SelectItem value="Dean">Dean</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-sm font-semibold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg p-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm"
              disabled={!isFormValid}
            >
              Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400 italic">
              Demo credentials: Faculty / faculty123, Dean / dean123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
