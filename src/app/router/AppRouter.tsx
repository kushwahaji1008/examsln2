import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import Login from "@/features/auth/Login";
import Register from "@/features/auth/Register";
import LandingPage from "@/features/landing/LandingPage";
import RoleRoute from "./RoleRoute";
import { useAuth } from '@/app/providers/AuthProvider';
import ForgotPassword from '@/features/auth/ForgotPassword';
import ResetPassword from '@/features/auth/ResetPassword';
import About from '@/features/landing/About';
import Contact from '@/features/landing/Contact';
import Pricing from '@/features/landing/Pricing';
import FAQ from '@/features/landing/Faq';
import Terms from '@/features/landing/Terms';
import Privacy from '@/features/landing/Privacy';

import StudentDashboard from "@/features/student/StudentDashboard";
import AdminDashboard from "@/features/admin/AdminDashboard";
import TeacherDashboard from "@/features/teacher/TeacherDashboard";
import TeacherCourses from "@/features/teacher/pages/TeacherCourses";
import TeacherCourseDetails from "@/features/teacher/pages/TeacherCourseDetails";

import TeacherCourseNew from "@/features/teacher/pages/TeacherCourseNew";
import TeacherCourseCurriculum from "@/features/teacher/pages/TeacherCourseCurriculum";
import TeacherCourseSectionNew from "@/features/teacher/pages/TeacherCourseSectionNew";
import TeacherCourseMaterialNew from "@/features/teacher/pages/TeacherCourseMaterialNew";
import TeacherExams from "@/features/teacher/pages/TeacherExams";
import TeacherExamNew from "@/features/teacher/pages/TeacherExamNew";
import TeacherExamDetails from "@/features/teacher/pages/TeacherExamDetails";
import TeacherExamAttempts from "@/features/teacher/pages/TeacherExamAttempts";
import TeacherQuestions from "@/features/teacher/pages/TeacherQuestions";
import TeacherQuestionNew from "@/features/teacher/pages/TeacherQuestionNew";
import TeacherResults from "@/features/teacher/pages/TeacherResults";
import TeacherResultReview from "@/features/teacher/pages/TeacherResultReview";
import TeacherAnalytics from "@/features/teacher/pages/TeacherAnalytics";
import TeacherLiveClasses from "@/features/teacher/pages/TeacherLiveClasses";


import Profile from '@/features/auth/Profile';
import ExamDetails from '@/features/student/ExamDetails';
import ActiveExam from '@/features/student/pages/ActiveExam';
import MyAttempts from '@/features/student/MyAttempts';
import AttemptRunner from '@/features/student/AttemptRunner';
import Results from '@/features/student/pages/Results';
import ResultView from '@/features/student/pages/ResultView';
import WalletDashboard from '@/features/student/pages/WalletDashboard';
import LiveClasses from '@/features/student/pages/LiveClasses';
import LiveStreamViewer from '@/features/student/pages/LiveStreamViewer';
import AuthSync from '@/features/auth/AuthSync';

// --- NEW STUDENT COURSE IMPORTS ---
import StudentCourses from "@/features/student/pages/StudentCourses";
import StudentCourseDetails from "@/features/student/pages/CourseDetails";
import StudentExams from "@/features/student/pages/StudentExams";
import Resources from "@/features/student/pages/Resources";

import UpcomingExams from '@/features/exams/Upcoming';
import ActiveExams from '@/features/exams/Active';
import MyNotifications from '@/features/notifications/MyNotifications';
import CoursesList from '@/features/courses/CoursesList';
import CourseDetails from '@/features/courses/CourseDetails';
import VerifyEmail from "@/features/auth/VerifyEmail";

import Unauthorized from "@/features/errors/Unauthorized";
import Maintenance from "@/features/errors/Maintenance";
import Billing from "@/features/profile/pages/Billing";
import Notifications from "@/features/notifications/Notifications";
import Support from "@/features/support/Support";
import Messages from "@/features/notifications/Messages";

function Dashboard() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  if (user.role === 'Admin' || user.role === 'SuperAdmin' || user.role === 2 || user.role === 3) {
    return <Navigate to="/admin" replace />;
  }
  if (user.role === 'Teacher' || user.role === 1) {
    return <Navigate to="/teacher" replace />;
  }
  return <Navigate to="/student" replace />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth-sync" element={<AuthSync />} />

        {/* Authentication - Shared across both, but redirects apply post-login */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        {/* Public Landing - Only on main domain typically, but kept shared for auth fallback */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/maintenance" element={<Maintenance />} />

        {/* Protected Application */}
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          
          {/* Shared Profile & Global Features */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/billing" element={<Billing />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/support" element={<Support />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          {/* ======================================================== */}
          {/* TEACHER PORTAL ROUTES */}
          {/* ======================================================== */}
          <Route path="/teacher" element={<RoleRoute allowedRoles={["Teacher", 1]}><TeacherDashboard /></RoleRoute>} />
          <Route path="/admin" element={<RoleRoute allowedRoles={["Admin", "SuperAdmin", 2, 3]}><AdminDashboard /></RoleRoute>} />
          <Route path="/exams/upcoming" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><UpcomingExams /></RoleRoute>} />
          <Route path="/exams/active" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><ActiveExams /></RoleRoute>} />
          <Route path="/courses" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherCourses /></RoleRoute>} />

          <Route path="/teacher/exams" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherExams /></RoleRoute>} />
          <Route path="/teacher/exams/new" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherExamNew /></RoleRoute>} />
          <Route path="/teacher/exams/:examId" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherExamDetails /></RoleRoute>} />
          <Route path="/teacher/exams/:examId/attempts" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherExamAttempts /></RoleRoute>} />
          <Route path="/teacher/questions" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherQuestions /></RoleRoute>} />
          <Route path="/teacher/questions/new" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherQuestionNew /></RoleRoute>} />
          <Route path="/teacher/results" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherResults /></RoleRoute>} />
          <Route path="/teacher/results/:resultId" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherResultReview /></RoleRoute>} />
          <Route path="/teacher/analytics" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherAnalytics /></RoleRoute>} />
          <Route path="/teacher/live" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherLiveClasses /></RoleRoute>} />

          <Route path="/courses/new" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherCourseNew /></RoleRoute>} />
          <Route path="/courses/:courseId" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherCourseDetails /></RoleRoute>} />
          <Route path="/courses/:courseId/curriculum" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherCourseCurriculum /></RoleRoute>} />
          <Route path="/courses/:courseId/sections/new" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherCourseSectionNew /></RoleRoute>} />
          <Route path="/courses/:courseId/materials/new" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherCourseMaterialNew /></RoleRoute>} />
          <Route path="/teacher/exams" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherExams /></RoleRoute>} />
          <Route path="/teacher/exams/new" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherExamNew /></RoleRoute>} />
          <Route path="/teacher/exams/:examId/attempts" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherExamAttempts /></RoleRoute>} />
          <Route path="/teacher/questions" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherQuestions /></RoleRoute>} />
          <Route path="/teacher/questions/new" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherQuestionNew /></RoleRoute>} />
          <Route path="/notifications/list" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><MyNotifications /></RoleRoute>} />

          {/* ======================================================== */}
          {/* STUDENT PORTAL ROUTES */}
          {/* ======================================================== */}
          <Route path="/student" element={<RoleRoute allowedRoles={["Student", 0, "Student"]}><StudentDashboard /></RoleRoute>} />
          <Route path="/student/dashboard" element={<RoleRoute allowedRoles={["Student", 0]}><StudentDashboard /></RoleRoute>} />
          
          <Route path="/student/attempts" element={<RoleRoute allowedRoles={["Student", 0]}><MyAttempts /></RoleRoute>} />
          <Route path="/student/results" element={<RoleRoute allowedRoles={["Student", 0]}><Results /></RoleRoute>} />
          <Route path="/student/results/:attemptId" element={<RoleRoute allowedRoles={["Student", 0]}><ResultView /></RoleRoute>} />
          <Route path="/student/wallet" element={<RoleRoute allowedRoles={["Student", 0]}><WalletDashboard /></RoleRoute>} />
          <Route path="/attempts/:attemptId" element={<RoleRoute allowedRoles={["Student", 0]}><AttemptRunner /></RoleRoute>} />
          
          <Route path="/student/courses" element={<RoleRoute allowedRoles={["Student", 0]}><StudentCourses /></RoleRoute>} />
          <Route path="/student/courses/:courseId" element={<RoleRoute allowedRoles={["Student", 0]}><StudentCourseDetails /></RoleRoute>} />
          <Route path="/student/resources" element={<RoleRoute allowedRoles={["Student", 0]}><Resources /></RoleRoute>} />
          <Route path="/student/exams" element={<RoleRoute allowedRoles={["Student", 0]}><StudentExams /></RoleRoute>} />
          <Route path="/student/exams/:examId" element={<RoleRoute allowedRoles={["Student", 0]}><ExamDetails /></RoleRoute>} />
          <Route path="/student/attempts/:attemptId" element={<RoleRoute allowedRoles={["Student", 0]}><ActiveExam /></RoleRoute>} />
          
          {/* Fallback routing */}
          <Route path="*" element={<h1 className="text-2xl font-bold flex justify-center items-center h-full">404 - Page Not Found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
