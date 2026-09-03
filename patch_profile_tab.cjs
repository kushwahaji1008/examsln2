const fs = require('fs');
let content = fs.readFileSync('src/features/auth/components/ProfileGeneralTab.tsx', 'utf8');

if (!content.includes("import toast")) {
  content = content.replace(
    "import { useAuth }",
    "import toast from 'react-hot-toast';\nimport { useAuth }"
  );
}

content = content.replace(
  "setMessage({ type: 'success', text: 'Profile details updated successfully.' });",
  "setMessage({ type: 'success', text: 'Profile details updated successfully.' });\n      toast.success('Profile saved successfully!');"
);

content = content.replace(
  "text: err?.response?.data?.message || 'Failed to update profile. Please try again.',\n      });",
  "text: err?.response?.data?.message || 'Failed to update profile. Please try again.',\n      });\n      toast.error('Failed to save profile.');"
);

fs.writeFileSync('src/features/auth/components/ProfileGeneralTab.tsx', content);
