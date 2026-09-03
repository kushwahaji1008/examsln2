const fs = require('fs');
let content = fs.readFileSync('src/features/courses/components/CourseCheckoutModal.tsx', 'utf8');

content = content.replace(
  "₹{receipt.amount.toFixed(2)}",
  "₹{(receipt.amount || 0).toFixed(2)}"
);

fs.writeFileSync('src/features/courses/components/CourseCheckoutModal.tsx', content);
