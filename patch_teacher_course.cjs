const fs = require('fs');
let content = fs.readFileSync('src/features/teacher/pages/TeacherCourseCurriculum.tsx', 'utf8');

content = content.replace(
  "const secId = section.sectionId;",
  "const secId = section.id || section.sectionId || sIdx;"
);

content = content.replace(
  "const itemId = item.itemId;",
  "const itemId = item.id || item.itemId || iIdx;"
);

fs.writeFileSync('src/features/teacher/pages/TeacherCourseCurriculum.tsx', content);
