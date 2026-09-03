const fs = require('fs');
let content = fs.readFileSync('src/features/student/pages/CourseDetails.tsx', 'utf8');

content = content.replace(
  '<div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">',
  '<div className="grid lg:grid-cols-[380px_1fr] gap-8 items-start">'
);

content = content.replace(
  '        {/* Main Content Area (Player / Details) */}\n        <div className="space-y-8">',
  '        {/* Main Content Area (Player / Details) */}\n        <div className="space-y-8 order-1 lg:order-2">'
);

content = content.replace(
  '        {/* Sidebar Curriculum */}\n        <div className="lg:sticky lg:top-6">',
  '        {/* Sidebar Curriculum */}\n        <div className="lg:sticky lg:top-6 order-2 lg:order-1">'
);

fs.writeFileSync('src/features/student/pages/CourseDetails.tsx', content);
