const fs = require('fs');
let content = fs.readFileSync('src/app/router/AppRouter.tsx', 'utf8');

const importStr = "import ExamDetails from '@/features/student/ExamDetails';";
content = content.replace(importStr, importStr + "\nimport ActiveExam from '@/features/student/pages/ActiveExam';");

const routeStr = "<Route path=\"/student/exams/:examId\" element={<RoleRoute allowedRoles={[\"Student\", 0]}><ExamDetails /></RoleRoute>} />";
content = content.replace(routeStr, routeStr + "\n          <Route path=\"/student/attempts/:attemptId\" element={<RoleRoute allowedRoles={[\"Student\", 0]}><ActiveExam /></RoleRoute>} />");

fs.writeFileSync('src/app/router/AppRouter.tsx', content);
