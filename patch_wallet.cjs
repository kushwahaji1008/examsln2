const fs = require('fs');
let content = fs.readFileSync('src/features/student/pages/WalletDashboard.tsx', 'utf8');

content = content.replace(
  "{balance !== null ? `₹${balance.toFixed(2)}` : 'Loading...'}",
  "{(balance !== null && balance !== undefined) ? `₹${balance.toFixed(2)}` : 'Loading...'}"
);

fs.writeFileSync('src/features/student/pages/WalletDashboard.tsx', content);
