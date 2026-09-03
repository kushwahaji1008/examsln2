// ============================================================================
// CENTRAL API TYPES & OPENAPI 3.0.1 SPECIFICATION CONTRACTS (V1)
// ============================================================================

export interface ApiResponse<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// ----------------------------------------------------------------------------
// 1. ENUMS (Integer and String Representation Support)
// ----------------------------------------------------------------------------

export enum UserRoleEnum {
  Student = 0,
  Teacher = 1,
  Admin = 2,
  SuperAdmin = 3,
}

export type UserRole = UserRoleEnum | 'Student' | 'Teacher' | 'Admin' | 'SuperAdmin' | 'student' | 'teacher' | 'admin' | 'superadmin' | number;

export enum CourseLevelEnum {
  Beginner = 0,
  Intermediate = 1,
  Advanced = 2,
  AllLevels = 3,
}

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'AllLevels' | 'beginner' | 'intermediate' | 'advanced' | 'alllevels' | number;

export enum CurriculumTypeEnum {
  Video = 0,
  Document = 1,
  Quiz = 2,
  Assignment = 3,
}

export type CurriculumType = 'Video' | 'Document' | 'Quiz' | 'Assignment' | 'video' | 'document' | 'quiz' | 'assignment' | number;

export enum CourseStatusEnum {
  Draft = 0,
  Published = 1,
  Archived = 2,
}

export type CourseStatus = 'Draft' | 'Published' | 'Archived' | 'draft' | 'published' | 'archived' | number;

export enum CourseCategoryEnum {
  General = 0,
  ComputerScience = 1,
  WebDevelopment = 2,
  DataScience = 3,
  ArtificialIntelligence = 4,
  Cybersecurity = 5,
  CloudComputing = 6,
  MobileDevelopment = 7,
  DevOps = 8,
  Design = 9,
}

export type CourseCategory = CourseCategoryEnum | 'General' | 'ComputerScience' | 'WebDevelopment' | 'DataScience' | 'ArtificialIntelligence' | 'Cybersecurity' | 'CloudComputing' | 'MobileDevelopment' | 'DevOps' | 'Design' | string;

export enum ExamTypeEnum {
  MCQ = 0,
  Subjective = 1,
  Mixed = 2,
  CodeEvaluation = 3,
}

export type ExamType = 'MCQ' | 'Subjective' | 'Mixed' | 'CodeEvaluation' | 'mcq' | 'subjective' | 'mixed' | 'code' | 'timed' | 'standard' | 'practice' | number;

export enum ExamStatusEnum {
  Draft = 0,
  Published = 1,
  Scheduled = 2,
  Active = 3,
  Completed = 4,
  Cancelled = 5,
  Archived = 6,
}

export type ExamStatus = 'Draft' | 'Published' | 'Scheduled' | 'Active' | 'Completed' | 'Cancelled' | 'Archived' | 'draft' | 'published' | 'scheduled' | 'active' | 'completed' | 'cancelled' | 'archived' | 'inactive' | number;

export enum QuestionTypeEnum {
  MultipleChoice = 0,
  MultipleResponse = 1,
  TrueFalse = 2,
  ShortAnswer = 3,
  Essay = 4,
  Code = 5,
  Matching = 6,
}

export type QuestionType = QuestionTypeEnum | 'MultipleChoice' | 'MultipleResponse' | 'TrueFalse' | 'ShortAnswer' | 'Essay' | 'Code' | 'Matching' | 'multiple_choice' | 'multiple_response' | 'true_false' | 'short_answer' | 'essay' | 'code' | 'matching' | number;

export enum QuestionStatusEnum {
  Draft = 0,
  InReview = 1,
  Approved = 2,
  Rejected = 3,
  Published = 4,
  Archived = 5,
}

export type QuestionStatus = QuestionStatusEnum | 'Draft' | 'InReview' | 'Approved' | 'Rejected' | 'Published' | 'Archived' | 'draft' | 'in_review' | 'approved' | 'rejected' | 'published' | 'archived' | number;

export enum NotificationTypeEnum {
  Info = 0,
  Success = 1,
  Warning = 2,
  Error = 3,
  System = 4,
}

export type NotificationType = NotificationTypeEnum | 'Info' | 'Success' | 'Warning' | 'Error' | 'System' | 'info' | 'success' | 'warning' | 'error' | 'system' | number;

export enum NotificationCategoryEnum {
  General = 0,
  ExamScheduled = 1,
  ExamStarting = 2,
  ExamCompleted = 3,
  ResultPublished = 4,
  CourseEnrolled = 5,
  NewLesson = 6,
  LiveClassScheduled = 7,
  LiveClassStarting = 8,
  Assignment = 9,
  Message = 10,
  System = 11,
  Violation = 12,
  Achievement = 13,
}

export type NotificationCategory = NotificationCategoryEnum | string;

export enum NotificationPriorityEnum {
  Low = 0,
  Normal = 1,
  High = 2,
  Urgent = 3,
}

export type NotificationPriority = NotificationPriorityEnum | 'Low' | 'Normal' | 'High' | 'Urgent' | number;

export enum NotificationChannelEnum {
  InApp = 0,
  Email = 1,
  SMS = 2,
  Push = 3,
}

export type NotificationChannel = NotificationChannelEnum | 'InApp' | 'Email' | 'SMS' | 'Push' | number;

export enum ViolationTypeEnum {
  FaceNotDetected = 0,
  MultipleFacesDetected = 1,
  LookingAway = 2,
  TabSwitch = 3,
  WindowBlur = 4,
  FullScreenExit = 5,
  ForbiddenKeyCombination = 6,
  RightClick = 7,
  CopyPaste = 8,
  AudioDetected = 9,
  UnauthorizedDevice = 10,
  BrowserExtension = 11,
  ScreenShareDetected = 12,
  SuspiciousObject = 13,
  ImpersonationSuspected = 14,
  Other = 15,
}

export type ViolationType = ViolationTypeEnum | number | string;

export enum ViolationSeverityEnum {
  Low = 0,
  Medium = 1,
  High = 2,
  Critical = 3,
}

export type ViolationSeverity = ViolationSeverityEnum | 'Low' | 'Medium' | 'High' | 'Critical' | number;

export enum SnapshotTypeEnum {
  Periodic = 0,
  ViolationTriggered = 1,
  InitialVerification = 2,
  FinalVerification = 3,
  ManualInstructor = 4,
}

export type SnapshotType = SnapshotTypeEnum | number;

export enum LessonTypeEnum {
  Video = 0,
  Live = 1,
  Document = 2,
  Quiz = 3,
  Interactive = 4,
}

export type LessonType = LessonTypeEnum | number;

export enum LiveClassStatusEnum {
  Scheduled = 0,
  Live = 1,
  Ended = 2,
  Cancelled = 3,
}

export type LiveClassStatus = LiveClassStatusEnum | number;

// ----------------------------------------------------------------------------
// 2. AUTHENTICATION & PROFILE MODELS
// ----------------------------------------------------------------------------

export interface RegisterRequest {
  email: string;
  fullName: string;
  password: string;
  phone?: string | null;
  role?: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  token: string;
  refreshToken: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface CheckAvailabilityRequest {
  value: string;
}

export interface ValidateTokenRequest {
  token: string;
}

export interface RevokeTokenRequest {
  token: string;
}

export interface UpdateProfileRequest {
  fullName: string;
  phone?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  profilePicture?: string | null;
}

export interface ChangeEmailRequest {
  newEmail: string;
  password: string;
}

export interface AddPhoneRequest {
  phoneNumber: string;
}

export interface MfaSetupRequest {
  method: string;
}

export interface MfaVerifyRequest {
  code: string;
}

export interface MfaChallengeRequest {
  userId: string;
  code: string;
}

export interface CheckAvailabilityResponse {
  available: boolean;
  message?: string;
}

export interface ValidateTokenResponse {
  valid: boolean;
  userId?: string;
  email?: string;
  role?: UserRole;
  expiresAt?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  bio?: string | null;
  avatarUrl?: string | null;
  profilePicture?: string | null;
  role: UserRole;
  gender?: string | null;
  dateOfBirth?: string | null;
  isApproved?: boolean;
  isActive?: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  mfaEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
  lastLoginAt?: string | null;
}

export interface UserSecurityOverview {
  mfaEnabled: boolean;
  emailVerified: boolean;
  phoneVerified: boolean;
  passwordLastChangedAt?: string | null;
  activeSessionsCount: number;
  activeDevicesCount: number;
  recentSecurityAlertsCount: number;
  twoFactorType?: 'totp' | 'sms' | 'email' | 'none';
}

export interface UserActivityLogItem {
  id: string;
  action: string;
  description: string;
  ipAddress?: string;
  userAgent?: string;
  device?: string;
  location?: string;
  status: 'success' | 'warning' | 'danger' | 'info';
  timestamp: string;
}

export interface MfaStatusResponse {
  enabled: boolean;
  type?: 'totp' | 'sms' | 'email';
  backupCodesRemaining?: number;
  enrolledAt?: string | null;
}

export interface MfaSetupResponse {
  secret: string;
  qrCodeUrl: string;
  otpauthUrl?: string;
  backupCodes?: string[];
}

export interface AuthSession {
  id: string;
  sessionId?: string;
  userId: string;
  deviceId?: string;
  deviceName?: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet' | 'browser';
  browser?: string;
  os?: string;
  ipAddress: string;
  location?: string;
  isCurrentSession: boolean;
  createdAt: string;
  lastActiveAt: string;
  expiresAt?: string;
}

export interface AuthDevice {
  id: string;
  deviceId?: string;
  userId: string;
  name: string;
  type: 'desktop' | 'mobile' | 'tablet' | 'other';
  os?: string;
  browser?: string;
  lastIpAddress?: string;
  isTrusted: boolean;
  firstSeenAt: string;
  lastActiveAt: string;
}

// ----------------------------------------------------------------------------
// 3. USER MANAGEMENT, ROLES & PERMISSIONS
// ----------------------------------------------------------------------------

export interface CreateUserAdminRequest {
  email: string;
  fullName: string;
  password: string;
  role?: UserRole;
  isActive?: boolean;
  isEmailVerified?: boolean;
}

export interface UpdateUserAdminRequest {
  fullName: string;
  role?: UserRole;
  isActive?: boolean;
  isEmailVerified?: boolean;
}

export interface UserAdminListItem {
  id: string;
  userId?: string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  roleName?: string;
  isActive: boolean;
  isLocked?: boolean;
  isEmailVerified?: boolean;
  mfaEnabled?: boolean;
  createdAt: string;
  lastLoginAt?: string | null;
}

export interface CreateRoleRequest {
  name: string;
  description?: string | null;
}

export interface UpdateRoleRequest {
  name: string;
  description?: string | null;
}

export interface AssignPermissionsRequest {
  permissionIds: string[];
}

export interface Role {
  id: string;
  roleId?: string;
  name: string;
  code?: string;
  description?: string | null;
  isSystem?: boolean;
  usersCount?: number;
  permissionsCount?: number;
  permissions?: Permission[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePermissionRequest {
  name: string;
  description?: string | null;
}

export interface UpdatePermissionRequest {
  name: string;
  description?: string | null;
}

export interface Permission {
  id: string;
  permissionId?: string;
  name: string;
  code?: string;
  description?: string | null;
  category?: string;
  createdAt?: string;
}

// ----------------------------------------------------------------------------
// 4. AUDIT & SECURITY
// ----------------------------------------------------------------------------

export interface AuditLog {
  id: string;
  auditId?: string;
  userId?: string;
  actionType?: string;
  action?: string;
  resourceType?: string;
  resourceId?: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface SecurityEvent {
  id: string;
  eventId?: string;
  userId?: string;
  eventLevel?: string;
  eventType?: string;
  description?: string;
  actionType?: string;
  ipAddress?: string;
  timestamp: string;
}

// ----------------------------------------------------------------------------
// 5. COURSE SERVICE & CURRICULUM (CourseService.Models.V1.*)
// ----------------------------------------------------------------------------

export interface CreateCourseRequest {
  title: string;
  description: string;
  level: CourseLevel;
  price: number;
  thumbnailUrl?: string;
}

export interface CreateSectionRequest {
  title: string;
  description?: string;
}

export interface CreateCurriculumItemRequest {
  title: string;
  type: CurriculumType;
  contentUrl?: string | null;
  isFreePreview?: boolean;
  durationSeconds?: number;
}

export interface ReorderRequest {
  orderedIds: string[];
}

export interface AssignInstructorRequest {
  instructorId: string;
}

export interface CurriculumItem {
  id: string;
  itemId?: string;
  title: string;
  type: CurriculumType;
  contentUrl?: string | null;
  isFreePreview: boolean;
  durationSeconds: number;
  orderIndex?: number;
  isCompleted?: boolean;
}

export interface CourseSection {
  id: string;
  sectionId?: string;
  title: string;
  orderIndex: number;
  items: CurriculumItem[];
}

export interface Course {
  id: string;
  courseId?: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  status: CourseStatus;
  level: CourseLevel;
  price: number;
  discountPrice?: number;
  enrollmentCount: number;
  createdBy: string;
  instructorIds: string[];
  createdAt: string;
  updatedAt?: string | null;
  sections: CourseSection[];
  
  // Computed / Optional metadata
  instructorName?: string;
  category?: string;
  averageRating?: number;
  ratingsCount?: number;
  totalDurationMinutes?: number;
  isFree?: boolean;
  isEnrolled?: boolean;
  progressPercentage?: number;
}

// ----------------------------------------------------------------------------
// 6. EXAM SERVICE (ExamService.Models.*)
// ----------------------------------------------------------------------------

export interface ExamSettings {
  randomizeQuestions: boolean;
  randomizeSections: boolean;
  allowReview: boolean;
  showResultsImmediately: boolean;
  requireProctoring: boolean;
  preventTabSwitch: boolean;
  enableAutoSubmit: boolean;
  gracePeriodMinutes?: number | null;
}

export interface ExamGrading {
  enableNegativeMarking: boolean;
  negativeMarkingPercentage: number;
  sectionalPassMarksEnabled: boolean;
}

export interface ExamSection {
  id?: string | null;
  sectionId?: string;
  title: string;
  description?: string | null;
  orderIndex: number;
  questionIds?: string[] | null;
}

export interface CreateExamRequest {
  courseId: string;
  title: string;
  description: string;
  durationMinutes: number;
  scheduledStartTime: string;
  scheduledEndTime: string;
  type: ExamType;
  questionIds: string[];
  settings: ExamSettings;
  grading: ExamGrading;
  totalMarks: number;
  passingMarks: number;
  allowedStudents: string[];
  instructionsHtml: string;
}

export interface Exam {
  id?: string | null;
  examId?: string;
  courseId?: string | null;
  title: string;
  description?: string | null;
  durationMinutes: number;
  scheduledStartTime?: string | null;
  scheduledEndTime?: string | null;
  type?: ExamType;
  status?: ExamStatus;
  createdBy: string;
  createdAt: string;
  updatedAt?: string | null;
  questionIds?: string[] | null;
  sections?: ExamSection[] | null;
  settings?: ExamSettings;
  grading?: ExamGrading;
  instructionsHtml?: string | null;
  totalMarks: number;
  passingMarks: number;
  allowedStudents?: string[] | null;
  blockedStudents?: string[] | null;
  version?: string | null;
  parentExamId?: string | null;
  isLatestVersion?: boolean;
}

export interface ScheduleRequest {
  startTime: string;
  endTime?: string | null;
}

export interface ExamVersionDto {
  versionId: string;
  examId: string;
  createdAt: string;
  createdBy: string;
  isActiveVersion: boolean;
}

// ----------------------------------------------------------------------------
// 7. QUESTION BANK SERVICE (QuestionBankService.Models.*)
// ----------------------------------------------------------------------------

export interface QuestionOption {
  id?: string | null;
  optionId?: string;
  text?: string | null;
  imageUrl?: string | null;
  isCorrect?: boolean;
}

export interface OptionRequest {
  text?: string | null;
  isCorrect: boolean;
}

export interface ReviewLog {
  reviewerId?: string | null;
  action?: QuestionStatus;
  comment?: string | null;
  timestamp?: string;
}

export interface ReviewCommentRequest {
  comment?: string | null;
}

export interface CreateQuestionRequest {
  questionText: string;
  type?: QuestionType;
  options?: QuestionOption[] | null;
  correctAnswer?: string | null;
  correctOptions?: string[] | null;
  marks: number;
  negativeMarks?: number | null;
  difficultyId?: string | null;
  categoryId?: string | null;
  subjectId?: string | null;
  topicId?: string | null;
  tags?: string[] | null;
  explanation?: string | null;
  imageUrl?: string | null;
  codeSnippet?: string | null;
}

export interface Question {
  id?: string | null;
  questionId?: string;
  questionText: string;
  type?: QuestionType;
  options?: QuestionOption[] | null;
  correctAnswer?: string | null;
  correctOptions?: string[] | null;
  marks: number;
  negativeMarks?: number | null;
  explanation?: string | null;
  imageUrl?: string | null;
  codeSnippet?: string | null;
  difficultyId?: string | null;
  categoryId?: string | null;
  subjectId?: string | null;
  topicId?: string | null;
  tags?: string[] | null;
  status?: QuestionStatus;
  version?: number;
  parentQuestionId?: string | null;
  reviewHistory?: ReviewLog[] | null;
  createdBy?: string | null;
  createdAt?: string;
  updatedBy?: string | null;
  updatedAt?: string | null;
  isActive?: boolean;
}

export interface QuestionCategory {
  id: string;
  categoryId?: string;
  name: string;
  description?: string;
}

export interface Subject {
  id: string;
  subjectId?: string;
  name: string;
  code?: string;
  description?: string;
}

export interface Topic {
  id: string;
  topicId?: string;
  subjectId?: string;
  name: string;
  description?: string;
}

export interface Difficulty {
  id: string;
  difficultyId?: string;
  name: string;
  level?: number;
}

export interface QuestionTag {
  id: string;
  tagId?: string;
  name: string;
}

// ----------------------------------------------------------------------------
// 8. ATTEMPTS & EXAM EXECUTION (ExamAttemptService.Models.*)
// ----------------------------------------------------------------------------

export interface StartExamRequest {
  examId: string;
}

export interface SubmitAnswerRequest {
  selectedOption?: string | null;
  selectedOptions?: string[] | null;
  textAnswer?: string | null;
  codeAnswer?: string | null;
}

export interface TimerSyncRequest {
  clientRemainingSeconds: number;
}

export interface ExtendTimeRequest {
  extraMinutes: number;
  reason?: string | null;
}

export interface ActivityLogRequest {
  activity?: string | null;
}

export interface AttemptNavigationState {
  totalQuestions: number;
  answeredCount: number;
  markedForReviewCount: number;
  currentQuestionIndex: number;
  questions: {
    questionId: string;
    index: number;
    status: 'unanswered' | 'answered' | 'marked_review' | 'answered_and_marked';
  }[];
}

export interface AttemptTimerState {
  totalDurationSeconds: number;
  remainingSeconds: number;
  serverTimestamp: string;
  isPaused: boolean;
}

export interface ExamAttempt {
  id: string;
  attemptId?: string;
  examId: string;
  userId: string;
  status: 'Started' | 'InProgress' | 'Paused' | 'Submitted' | 'ForceSubmitted' | 'Terminated' | 'Invalidated';
  startedAt: string;
  submittedAt?: string | null;
  remainingSeconds: number;
  totalMarksScored?: number;
  totalMarksPossible?: number;
  passed?: boolean;
}

// ----------------------------------------------------------------------------
// 9. PROCTORING SERVICE (ProctoringService.Models.*)
// ----------------------------------------------------------------------------

export interface StartProctoringRequest {
  attemptId: string;
  examId: string;
}

export interface ReportViolationRequest {
  sessionId: string;
  type: ViolationType;
  description?: string | null;
  severity?: ViolationSeverity;
  snapshotBase64?: string | null;
}

export interface SubmitSnapshotRequest {
  sessionId: string;
  imageBase64: string;
  type?: SnapshotType;
}

export interface ProctoringSession {
  sessionId: string;
  attemptId: string;
  examId: string;
  status: 'Active' | 'Ended' | 'Terminated';
  startTime: string;
  endTime?: string | null;
  violationsCount: number;
}

// ----------------------------------------------------------------------------
// 10. RESULTS, GRADING & CERTIFICATES (ResultService.Models.*)
// ----------------------------------------------------------------------------

export interface GenerateCertificateRequest {
  resultId: string;
}

export interface GradeQuestionRequest {
  score: number;
  comments?: string | null;
}

export interface OverrideGradeRequest {
  newScore: number;
  reason: string;
}

export interface BulkPublishRequest {
  resultIds: string[];
}

export interface ExportFilterRequest {
  examId?: string | null;
  startDate?: string | null;
  endDate?: string | null;
}

export interface ExamResult {
  id: string;
  resultId?: string;
  attemptId: string;
  examId: string;
  userId: string;
  totalMarks: number;
  score: number;
  percentage: number;
  passed: boolean;
  status: 'Pending' | 'Calculated' | 'Finalized' | 'Published';
  rank?: number;
  percentile?: number;
  sectionScores?: Record<string, number>;
  createdAt: string;
}

export interface Certificate {
  id: string;
  certificateId?: string;
  certificateCode: string;
  resultId: string;
  examTitle: string;
  recipientName: string;
  issuedAt: string;
  grade?: string;
  scorePercentage?: number;
  verificationUrl?: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  score: number;
  percentage: number;
  timeSpentSeconds: number;
  submittedAt: string;
}

// ----------------------------------------------------------------------------
// 11. VIDEO CLASSES & LIVE SESSIONS (VideoClassesService.Models.*)
// ----------------------------------------------------------------------------

export interface VideoClassesCourse {
  id?: string | null;
  title: string;
  description?: string | null;
  thumbnailUrl?: string | null;
  instructorId?: string | null;
  instructorName?: string | null;
  category?: CourseCategory;
  tags?: string[] | null;
  level?: CourseLevel;
  chapterIds?: string[] | null;
  status?: CourseStatus;
  createdAt?: string;
  updatedAt?: string | null;
  totalStudentsEnrolled?: number;
  averageRating?: number;
  totalRatings?: number;
  totalDurationMinutes?: number;
  isFeatured?: boolean;
  isFree?: boolean;
  price?: number | null;
}

export interface Chapter {
  id?: string | null;
  id: string;
  title: string;
  description?: string | null;
  orderIndex?: number;
  lessonIds?: string[] | null;
  createdAt?: string;
}

export interface Lesson {
  id?: string | null;
  chapterId: string;
  title: string;
  description?: string | null;
  orderIndex?: number;
  type?: LessonType;
  videoUrl?: string | null;
  videoFileName?: string | null;
  durationSeconds?: number;
  thumbnailUrl?: string | null;
  scheduledStartTime?: string | null;
  scheduledEndTime?: string | null;
  liveStreamUrl?: string | null;
  isLive?: boolean;
  recordingUrl?: string | null;
  hasQuiz?: boolean;
  quizId?: string | null;
  createdAt?: string;
  viewCount?: number;
  isFree?: boolean;
}

export interface LiveClass {
  id?: string | null;
  lessonId: string;
  instructorId: string;
  instructorName?: string | null;
  scheduledStartTime: string;
  actualStartTime?: string | null;
  endTime?: string | null;
  status?: LiveClassStatus;
  attendeeIds?: string[] | null;
  maxAttendees?: number;
  recordSession?: boolean;
  recordingUrl?: string | null;
  enableChat?: boolean;
  enableQA?: boolean;
  chatMessages?: ChatMessage[] | null;
  polls?: Poll[] | null;
}

export interface ChatMessage {
  id?: string | null;
  senderId?: string | null;
  senderName?: string | null;
  message?: string | null;
  timestamp?: string;
}

export interface Poll {
  id?: string | null;
  question?: string | null;
  options?: PollOption[] | null;
  createdAt?: string;
  isActive?: boolean;
}

export interface PollOption {
  id?: string | null;
  text?: string | null;
  votes?: number;
  votedBy?: string[] | null;
}

export interface AddBookmarkRequest {
  courseId?: string | null;
  timestamp?: number;
}

export interface AddCommentRequest {
  content?: string | null;
  timestamp?: number | null;
  parentCommentId?: string | null;
}

export interface AddNoteRequest {
  courseId?: string | null;
  timestamp?: number;
  content?: string | null;
}

export interface EndLiveClassRequest {
  recordingUrl?: string | null;
}

export interface ProgressUpdate {
  courseId?: string | null;
  watchedSeconds?: number;
  totalSeconds?: number;
}

export interface RateCourseRequest {
  rating?: number;
  review?: string | null;
}

// ----------------------------------------------------------------------------
// 12. NOTIFICATIONS (NotificationService.Models.*)
// ----------------------------------------------------------------------------

export interface SendNotificationRequest {
  userId?: string | null;
  userIds?: string[] | null;
  role?: string | null;
  title: string;
  message: string;
  type?: NotificationType;
  category?: NotificationCategory;
  priority?: NotificationPriority;
  channels?: NotificationChannel[] | null;
  data?: Record<string, any> | null;
  actionUrl?: string | null;
  imageUrl?: string | null;
}

export interface UserNotificationPreferences {
  id?: string | null;
  userId: string;
  emailEnabled?: boolean;
  smsEnabled?: boolean;
  pushEnabled?: boolean;
  inAppEnabled?: boolean;
  categoryPreferences?: Record<string, boolean> | null;
  mutedCategories?: string[] | null;
  quietHoursEnabled?: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  updatedAt?: string;
}

export interface AppNotification {
  id: string;
  notificationId?: string;
  userId?: string;
  title: string;
  message: string;
  type: NotificationType;
  category: NotificationCategory;
  priority: NotificationPriority;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string | null;
}

// ----------------------------------------------------------------------------
// 13. ANALYTICS & REPORTS (AnalyticsService.Models.*)
// ----------------------------------------------------------------------------

export interface CreateReportRequest {
  name: string;
  type: string;
  filters?: Record<string, string> | null;
}

export interface AnalyticsReport {
  id: string;
  reportId?: string;
  name: string;
  type: string;
  status: 'Generating' | 'Ready' | 'Failed';
  downloadUrl?: string;
  createdAt: string;
}
