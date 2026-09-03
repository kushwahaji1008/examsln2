const fs = require('fs');
let content = fs.readFileSync('src/features/courses/CourseDetails.tsx', 'utf8');

content = content.replace(
  /course\.sections\.map\(\(section, idx\) => \(\s*<div key=\{section\.sectionId\}/g,
  `course.sections.map((section, idx) => {
    const secId = section.id || section.sectionId || String(idx);
    return (
      <div key={secId}`
);

content = content.replace(
  /onClick=\{\(\) => toggleSection\(section\.sectionId\)\}/g,
  `onClick={() => toggleSection(secId)}`
);

content = content.replace(
  /expandedSections\[section\.sectionId\]/g,
  `expandedSections[secId]`
);

content = content.replace(
  /key=\{item\.itemId \|\| iIdx\}/g,
  `key={item.id || item.itemId || iIdx}`
);

content = content.replace(
  /                  <\/div>\n                \)\)\n              \) : \(/g,
  `                  </div>\n                );\n              })\n              ) : (`
);

fs.writeFileSync('src/features/courses/CourseDetails.tsx', content);
