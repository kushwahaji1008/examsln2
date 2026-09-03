const fs = require('fs');
let content = fs.readFileSync('src/features/student/components/RecommendedCourses.tsx', 'utf8');

content = content.replace(
  "{course.rating.toFixed(1)}",
  "{(course.rating || 0).toFixed(1)}"
);

fs.writeFileSync('src/features/student/components/RecommendedCourses.tsx', content);
