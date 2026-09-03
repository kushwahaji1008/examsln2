const fs = require('fs');
let content = fs.readFileSync('src/features/courses/components/CourseCheckoutModal.tsx', 'utf8');

content = content.replace(
  "const basePrice = course.discountPrice !== undefined && course.discountPrice > 0 \n    ? course.discountPrice \n    : course.price;",
  "const basePrice = course.discountPrice !== undefined && course.discountPrice > 0 \n    ? course.discountPrice \n    : (course.price || 0);"
);

content = content.replace(
  "{course.price === 0 ? 'Free' : `₹${course.price.toFixed(2)}`}",
  "{(course.price || 0) === 0 ? 'Free' : `₹${(course.price || 0).toFixed(2)}`}"
);

fs.writeFileSync('src/features/courses/components/CourseCheckoutModal.tsx', content);
