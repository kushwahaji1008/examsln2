#!/bin/bash
sed -i -e '/catch (err: any) {/a \
      if (err?.response?.data?.requiresMfa || err?.response?.data?.message?.includes("MFA")) {\
        setMfaChallenge({ userId: err?.response?.data?.userId || "" });\
        setError(null);\
        return;\
      }\
' src/features/auth/Login.tsx
