const fs = require('fs');
let content = fs.readFileSync('src/features/courses/components/CourseStatsModal.tsx', 'utf8');

content = content.replace(
  "{stats.averageRating.toFixed(1)}",
  "{(stats.averageRating || 0).toFixed(1)}"
);

fs.writeFileSync('src/features/courses/components/CourseStatsModal.tsx', content);
