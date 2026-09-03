const fs = require('fs');
let content = fs.readFileSync('src/features/auth/components/ProfileEmailPhoneTab.tsx', 'utf8');

if (!content.includes("import toast")) {
  content = content.replace(
    "import React, { useState } from 'react';",
    "import React, { useState } from 'react';\nimport toast from 'react-hot-toast';"
  );
}

content = content.replace(
  /setEmailMessage\(\{ type: 'success', text: `Verification code sent to \$\{newEmail\}\. Please enter the OTP to confirm\.` \}\);/g,
  "setEmailMessage({ type: 'success', text: `Verification code sent to ${newEmail}. Please enter the OTP to confirm.` });\n      toast.success('Verification code sent!');"
);

content = content.replace(
  /setEmailMessage\(\{ type: 'error', text: err\?\.response\?\.data\?\.message \|\| 'Failed to request email change\.' \}\);/g,
  "setEmailMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to request email change.' });\n      toast.error('Failed to request email change.');"
);

fs.writeFileSync('src/features/auth/components/ProfileEmailPhoneTab.tsx', content);
