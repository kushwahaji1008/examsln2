const fs = require('fs');
let content = fs.readFileSync('src/features/auth/components/ProfileMfaTab.tsx', 'utf8');

if (!content.includes("import toast")) {
  content = content.replace(
    "import React, { useState, useEffect } from 'react';",
    "import React, { useState, useEffect } from 'react';\nimport toast from 'react-hot-toast';"
  );
}

content = content.replace(
  "setMessage({ type: 'success', text: 'Two-Factor Authentication is now ENABLED on your account!' });",
  "setMessage({ type: 'success', text: 'Two-Factor Authentication is now ENABLED on your account!' });\n      toast.success('MFA Enabled!');"
);

content = content.replace(
  "setMessage({ type: 'error', text: err?.response?.data?.message || 'Invalid verification code. Please check your authenticator app.' });",
  "setMessage({ type: 'error', text: err?.response?.data?.message || 'Invalid verification code. Please check your authenticator app.' });\n      toast.error('Invalid verification code.');"
);

content = content.replace(
  "setMessage({ type: 'success', text: 'MFA has been disabled.' });",
  "setMessage({ type: 'success', text: 'MFA has been disabled.' });\n      toast.success('MFA Disabled!');"
);

content = content.replace(
  "setMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to disable MFA. Invalid password.' });",
  "setMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to disable MFA. Invalid password.' });\n      toast.error('Failed to disable MFA.');"
);

fs.writeFileSync('src/features/auth/components/ProfileMfaTab.tsx', content);
