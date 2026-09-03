import { Outlet, useNavigate } from "react-router-dom";

export default function AppLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-900/90 border-r border-border/10 p-4">
        <h1 className="text-xl font-bold mb-6 text-primary-foreground">Exam Platform</h1>

        <div className="space-y-2">
          <button onClick={() => navigate("/dashboard")} className="block w-full text-left p-2 hover:bg-slate-800 text-slate-300 hover:text-primary-foreground rounded-xl transition">
            Dashboard
          </button>

          {user?.role === "Student" && (
            <button onClick={() => navigate("/student")} className="block w-full text-left p-2 hover:bg-slate-800 text-slate-300 hover:text-primary-foreground rounded-xl transition">
              My Exams
            </button>
          )}

          {user?.role === "Teacher" && (
            <>
              <button onClick={() => navigate("/teacher")} className="block w-full text-left p-2 hover:bg-slate-800 text-slate-300 hover:text-primary-foreground rounded-xl transition">
                Create Exam
              </button>
              <button onClick={() => navigate("/teacher/questions")} className="block w-full text-left p-2 hover:bg-slate-800 text-slate-300 hover:text-primary-foreground rounded-xl transition">
                Question Bank
              </button>
            </>
          )}

          {user?.role === "Admin" && (
            <button onClick={() => navigate("/admin")} className="block w-full text-left p-2 hover:bg-slate-800 text-slate-300 hover:text-primary-foreground rounded-xl transition">
              Admin Panel
            </button>
          )}
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className="bg-slate-900/80 border-b border-border/10 p-4 flex justify-between items-center backdrop-blur-xl">
          <div className="font-semibold text-primary-foreground">Welcome, {user?.fullName}</div>
          <button onClick={logout} className="text-rose-400 hover:text-rose-300 text-sm font-semibold transition">
            Logout
          </button>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
