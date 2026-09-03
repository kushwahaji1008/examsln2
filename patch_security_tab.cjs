const fs = require('fs');
let content = fs.readFileSync('src/features/auth/components/ProfileSecurityTab.tsx', 'utf8');

if (!content.includes("import toast")) {
  content = content.replace(
    "import React, { useState } from 'react';",
    "import React, { useState } from 'react';\nimport toast from 'react-hot-toast';"
  );
}

content = content.replace(
  "setPassMessage({ type: 'success', text: 'Password updated successfully.' });",
  "setPassMessage({ type: 'success', text: 'Password updated successfully.' });\n      toast.success('Password updated successfully!');"
);

content = content.replace(
  "text: err?.response?.data?.message || 'Failed to update password. Please check your current password.',\n      });",
  "text: err?.response?.data?.message || 'Failed to update password. Please check your current password.',\n      });\n      toast.error('Failed to update password.');"
);

fs.writeFileSync('src/features/auth/components/ProfileSecurityTab.tsx', content);
