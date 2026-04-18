import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Moon, Sun } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();

  // State สำหรับ Dark/Light Mode
  const [isDark, setIsDark] = useState(false);
  const [role, setRole] = useState<"admin" | "member" | "guest">("admin");
  const [email, setEmail] = useState("admin@teamflow.com");
  const [password, setPassword] = useState("123456");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // Effect สำหรับจัดการ class 'dark' ที่ tag <html>
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const handleRoleChange = (selectedRole: "admin" | "member" | "guest") => {
    setRole(selectedRole);
    if (selectedRole === "admin") setEmail("admin@teamflow.com");
    else if (selectedRole === "member") setEmail("member@teamflow.com");
    else setEmail("guest@teamflow.com");
    setError("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    const userData = {
      email,
      role,
      name: role === "admin" ? "Admin" : role === "member" ? "Member" : "Guest",
    };

    sessionStorage.setItem("demo_user", JSON.stringify(userData));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative transition-colors duration-300">
      {/* ปุ่มสลับโหมดมุมขวาบน (ยังใช้งานได้สำหรับเปลี่ยนสีพื้นหลัง) */}
      <button
        onClick={() => setIsDark(!isDark)}
        className="absolute top-6 right-6 w-10 h-10 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center brutal-btn z-10 text-[#111] dark:text-white"
        aria-label="Toggle Dark Mode"
      >
        {isDark ? (
          <Sun size={18} strokeWidth={2.5} />
        ) : (
          <Moon size={18} strokeWidth={2.5} />
        )}
      </button>

      {/* Container หลัก: ลบคลาส dark ออก เพื่อบังคับสีขาวถาวรตามที่ต้องการ */}
      <div className="brutal-box rounded-[20px] bg-white w-full max-w-[360px] overflow-hidden flex flex-col relative z-10">
        {/* ครึ่งบน: สีเขียว */}
        <div className="bg-[#a2cb8b] px-6 pt-7 pb-6 border-b-2 border-[#111] flex flex-col items-center text-center">
          <div className="flex gap-1.5 mb-5">
            <div className="w-3 h-3 bg-white border-2 border-[#111] rounded-full"></div>
            <div className="w-3 h-3 bg-white border-2 border-[#111] rounded-full"></div>
            <div className="w-3 h-3 bg-white border-2 border-[#111] rounded-full"></div>
          </div>

          <div className="w-14 h-14 bg-white border-2 border-[#111] rounded-[14px] flex items-center justify-center mb-3 shadow-[2px_2px_0px_#111]">
            <span className="font-black text-2xl text-[#111]">TF</span>
          </div>

          <h1 className="text-2xl font-black text-[#111] tracking-tight">
            TeamFlow
          </h1>
        </div>

        {/* ครึ่งล่าง: บังคับพื้นหลังสีขาวล้วน */}
        <div className="p-6 bg-white">
          {/* Role Tabs */}
          <div className="flex gap-2 mb-6">
            {(["admin", "member", "guest"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => handleRoleChange(r)}
                className={`flex-1 py-1.5 text-xs font-black border-2 rounded-lg transition-all capitalize
                  ${
                    role === r
                      ? "bg-[#a2cb8b] text-[#111] border-[#111] shadow-[2px_2px_0px_#111] translate-x-[-1px] translate-y-[-1px]"
                      : "bg-gray-50 text-gray-500 border-transparent hover:bg-gray-200"
                  }
                `}
              >
                {r}
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Input: Email (ใช้พื้นสีเทาอ่อน สบายตา) */}
            <div className="space-y-1.5">
              <label className="text-[0.7rem] font-black text-[#111]">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 text-[#111] brutal-input rounded-lg px-3 py-2 text-sm font-semibold focus:ring-0"
              />
            </div>

            {/* Input: Password (ใช้พื้นสีเทาอ่อน) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[0.7rem] font-black text-[#111]">
                  PASSWORD
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 text-[#111] brutal-input rounded-lg pl-3 pr-10 py-2 text-sm font-semibold focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#111] transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-bold text-center pt-1">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#111] text-white font-black text-sm py-2.5 mt-2 brutal-btn rounded-xl hover:bg-gray-800"
            >
              เข้าสู่ระบบ →
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
