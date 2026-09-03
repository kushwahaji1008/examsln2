const fs = require('fs');
let content = fs.readFileSync('src/features/auth/components/ProfileEmailPhoneTab.tsx', 'utf8');

content = content.replace(
  "setEmailMessage({ type: 'success', text: 'Email changed and verified successfully!' });",
  "setEmailMessage({ type: 'success', text: 'Email changed and verified successfully!' });\n      toast.success('Email changed successfully!');"
);

content = content.replace(
  "setEmailMessage({ type: 'error', text: err?.response?.data?.message || 'Invalid or expired OTP.' });",
  "setEmailMessage({ type: 'error', text: err?.response?.data?.message || 'Invalid or expired OTP.' });\n      toast.error('Invalid OTP');"
);

content = content.replace(
  "setEmailMessage({ type: 'success', text: 'Verification email resent!' });",
  "setEmailMessage({ type: 'success', text: 'Verification email resent!' });\n      toast.success('Verification email resent!');"
);

content = content.replace(
  "setEmailMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to resend code.' });",
  "setEmailMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to resend code.' });\n      toast.error('Failed to resend code.');"
);

fs.writeFileSync('src/features/auth/components/ProfileEmailPhoneTab.tsx', content);
