const fs = require('fs');
let content = fs.readFileSync('src/features/auth/components/ProfilePreferencesTab.tsx', 'utf8');

if (!content.includes("import toast")) {
  content = content.replace(
    "import React, { useState } from 'react';",
    "import React, { useState } from 'react';\nimport toast from 'react-hot-toast';"
  );
}

content = content.replace(
  "setSuccess(true);",
  "setSuccess(true);\n      toast.success('Preferences saved successfully!');"
);

fs.writeFileSync('src/features/auth/components/ProfilePreferencesTab.tsx', content);
