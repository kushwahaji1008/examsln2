const fs = require('fs');
let content = fs.readFileSync('src/features/student/pages/ExamDetails.tsx', 'utf8');

content = content.replace(
  'const attempt = await startExam({ examId: id as string });',
  'const attempt = await startExam({ examId: examId as string });'
);

fs.writeFileSync('src/features/student/pages/ExamDetails.tsx', content);
