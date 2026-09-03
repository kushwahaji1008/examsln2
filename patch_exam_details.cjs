const fs = require('fs');
let content = fs.readFileSync('src/features/student/ExamDetails.tsx', 'utf8');

content = content.replace(
  "import apiClient from '@/services/api/client';",
  "import apiClient from '@/services/api/client';\nimport { startExam } from '@/services/api/attemptsApi';"
);

const actionStr = "const [error, setError] = useState<string | null>(null);";
const newActionStr = actionStr + "\n  const [starting, setStarting] = useState(false);\n\n  const handleStartExam = async () => {\n    try {\n      setStarting(true);\n      setError(null);\n      const attempt = await startExam({ examId: examId! });\n      navigate(`/student/attempts/${attempt.id}`);\n    } catch (err: any) {\n      setError(err.response?.data?.message || 'Failed to start exam.');\n      setStarting(false);\n    }\n  };";
content = content.replace(actionStr, newActionStr);

content = content.replace(
  "onClick={() => navigate(`/student/exam/${examId}/attempt`)}",
  "onClick={handleStartExam}\n          disabled={starting}"
);

content = content.replace(
  "Start Assessment Now",
  "{starting ? <><Loader2 className=\"w-5 h-5 animate-spin\"/> Starting...</> : <><PlayCircle className=\"h-5 w-5\" /> Start Assessment Now</>}"
);

fs.writeFileSync('src/features/student/ExamDetails.tsx', content);
