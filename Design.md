src/
├── app/                        # Global App Setup
│   ├── providers/              # QueryClient, AuthProvider, ThemeProvider
│   ├── router/                 # React Router setup (Public, Protected, Role-Based Guards)
│   └── store/                  # Global Zustand/Redux stores (e.g., global UI state)
│
├── assets/                     # Images, global CSS, SVGs
│
├── components/                 # Feature-Agnostic, Reusable UI
│   ├── layouts/                # AppShell, Sidebar, Topbar
│   └── ui/                     # Buttons, Inputs, Tables, Modals (Shadcn/MUI)
│
├── config/                     # Environment variables and global constants
│   └── env.ts                  # Validates VITE_API_URL, etc.
│
├── lib/                        # Third-party library configurations
│   ├── axios.ts                # Axios instance with auth & refresh-token interceptors
│   └── react-query.ts          # Default query configurations
│
├── types/                      # Global Types
│   └── api.ts                  # Generic API Response/Pagination types
│
├── utils/                      # Pure Helper Functions
│   ├── formatters.ts           # Date, currency, time formatters
│   └── validators.ts           # Zod/Yup schemas for global use
│
└── features/                   # 🚀 THE CORE: Domain-Specific Modules
    │
    ├── auth/                   # Maps to /api/auth/*
    │   ├── api/                # login(), register(), refreshToken(), me()
    │   ├── components/         # LoginForm, RegisterForm
    │   ├── routes/             # LoginPage, RegisterPage, ForgotPasswordPage
    │   ├── types.ts            # User, AuthResponse interfaces
    │   └── index.ts            # Public API barrel file
    │
    ├── users/                  # Maps to /api/auth/users/* (Admin Role)
    │   ├── api/                # CRUD for users
    │   ├── components/         # UserTable, UserFormModal
    │   ├── routes/             # UserManagementPage
    │   └── types.ts            # UserProfile interface
    │
    ├── courses/                # Maps to /api/videos/courses/* & /api/videos/lessons/*
    │   ├── api/                # CRUD courses, chapters, lessons, progress, notes
    │   ├── components/         # CourseCard, VideoPlayer, LessonList
    │   ├── routes/             # CourseCatalog, CourseDashboard (Teacher), CourseViewer (Student)
    │   └── types.ts            # Course, Chapter, Lesson interfaces
    │
    ├── question-bank/          # Maps to /api/questions/*
    │   ├── api/                # CRUD questions, bulk upload, categories, tags
    │   ├── components/         # QuestionEditor, QuestionFilterBar
    │   ├── routes/             # QuestionBankManager
    │   └── types.ts            
    │
    ├── exams/                  # Maps to /api/exams/*
    │   ├── api/                # CRUD exams, schedule, activate
    │   ├── components/         # ExamBuilder, ExamCard
    │   ├── routes/             # ExamDashboard (Teacher), UpcomingExams (Student)
    │   └── types.ts            
    │
    ├── assessments/            # Maps to /api/attempts/* & /api/results/*
    │   ├── api/                # start(), answer(), submit(), flag(), evaluate()
    │   ├── components/         # AttemptRunner, QuestionNavigator, Timer
    │   ├── routes/             # ExamRunnerView, ResultReportView
    │   └── types.ts            # Attempt, Answer, Result interfaces
    │
    ├── proctoring/             # Maps to /api/proctoring/*
    │   ├── api/                # start(), snapshot(), violation()
    │   ├── hooks/              # useWebcam(), useTabFocusTracker()
    │   ├── components/         # CameraFeed, ViolationAlerts
    │   └── types.ts            
    │
    ├── live-classes/           # Maps to /api/videos/live/*
    │   ├── api/                # start(), join(), end()
    │   ├── components/         # LiveStreamViewer, ChatBox
    │   ├── routes/             # LiveClassRoom
    │   └── types.ts            
    │
    └── notifications/          # Maps to /api/notifications/*
        ├── api/                # getUnread, markAllRead, bulk
        ├── components/         # NotificationDropdown, NotificationBell
        └── types.ts




        