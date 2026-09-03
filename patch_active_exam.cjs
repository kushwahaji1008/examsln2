const fs = require('fs');
let content = fs.readFileSync('src/features/student/pages/ActiveExam.tsx', 'utf8');

if (!content.includes("import toast")) {
  content = content.replace(
    "import { useParams, useNavigate } from 'react-router-dom';",
    "import { useParams, useNavigate } from 'react-router-dom';\nimport toast from 'react-hot-toast';"
  );
}

content = content.replace(
  "await submitAttempt(attemptId!);\n      navigate(`/student/results/${attemptId}`);",
  "await submitAttempt(attemptId!);\n      toast.success('Exam submitted successfully!');\n      navigate(`/student/results/${attemptId}`);"
);

content = content.replace(
  "alert(\"Failed to submit exam: \" + (err.response?.data?.message || err.message));",
  "toast.error(\"Failed to submit exam: \" + (err.response?.data?.message || err.message));"
);

content = content.replace(
  "alert(\"Time is up! Your exam will be submitted automatically.\");",
  "toast.error(\"Time is up! Your exam will be submitted automatically.\", { duration: 5000 });"
);

content = content.replace(
  "await submitAttempt(attemptId!);\n      navigate(`/student/results/${attemptId}`);",
  "await submitAttempt(attemptId!);\n      toast.success('Exam submitted automatically!');\n      navigate(`/student/results/${attemptId}`);"
);

fs.writeFileSync('src/features/student/pages/ActiveExam.tsx', content);
