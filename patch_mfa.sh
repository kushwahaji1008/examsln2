#!/bin/bash

# We will use sed to insert the MFA state and logic into Login.tsx.
# First, insert state variables.
sed -i -e '/const \[error, setError\]/i \
  const [mfaChallenge, setMfaChallenge] = useState<{ userId: string } | null>(null);\
  const [mfaCode, setMfaCode] = useState("");\
  const [recoveryMode, setRecoveryMode] = useState(false);\
' src/features/auth/Login.tsx

# Then, insert the import for challengeMfa and verifyMfaRecoveryCode.
sed -i -e '/import { loginUser }/a \
import { challengeMfa, verifyMfaRecoveryCode } from "@/services/api/authApi";\
' src/features/auth/Login.tsx

