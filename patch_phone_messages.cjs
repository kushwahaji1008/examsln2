const fs = require('fs');
let content = fs.readFileSync('src/features/auth/components/ProfileEmailPhoneTab.tsx', 'utf8');

content = content.replace(
  /setPhoneMessage\(\{ type: 'success', text: `Verification OTP sent to \$\{phone\}\. Enter code below\.` \}\);/g,
  "setPhoneMessage({ type: 'success', text: `Verification OTP sent to ${phone}. Enter code below.` });\n      toast.success('OTP sent successfully!');"
);

content = content.replace(
  /setPhoneMessage\(\{ type: 'error', text: err\?\.response\?\.data\?\.message \|\| 'Failed to register phone number\.' \}\);/g,
  "setPhoneMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to register phone number.' });\n      toast.error('Failed to register phone number.');"
);

content = content.replace(
  "setPhoneMessage({ type: 'success', text: 'Phone number verified successfully!' });",
  "setPhoneMessage({ type: 'success', text: 'Phone number verified successfully!' });\n      toast.success('Phone verified!');"
);

content = content.replace(
  "setPhoneMessage({ type: 'error', text: err?.response?.data?.message || 'Invalid phone verification code.' });",
  "setPhoneMessage({ type: 'error', text: err?.response?.data?.message || 'Invalid phone verification code.' });\n      toast.error('Invalid OTP');"
);

content = content.replace(
  "setPhoneMessage({ type: 'success', text: 'Phone number removed.' });",
  "setPhoneMessage({ type: 'success', text: 'Phone number removed.' });\n      toast.success('Phone removed!');"
);

content = content.replace(
  "setPhoneMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to remove phone number.' });",
  "setPhoneMessage({ type: 'error', text: err?.response?.data?.message || 'Failed to remove phone number.' });\n      toast.error('Failed to remove phone number.');"
);

content = content.replace(
  "setPhoneMessage({ type: 'success', text: 'SMS OTP resent!' });",
  "setPhoneMessage({ type: 'success', text: 'SMS OTP resent!' });\n      toast.success('SMS OTP resent!');"
);

content = content.replace(
  "setPhoneMessage({ type: 'error', text: 'Failed to resend SMS.' });",
  "setPhoneMessage({ type: 'error', text: 'Failed to resend SMS.' });\n      toast.error('Failed to resend SMS.');"
);

fs.writeFileSync('src/features/auth/components/ProfileEmailPhoneTab.tsx', content);
