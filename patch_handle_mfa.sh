#!/bin/bash
sed -i -e '/const handleLogin = async/i \
  const handleMfaSubmit = async (e: React.FormEvent) => {\
    e.preventDefault();\
    setError(null);\
    if (!mfaCode) {\
      setError("Please enter your verification code.");\
      return;\
    }\
    setLoading(true);\
    try {\
      const reqPayload = { userId: mfaChallenge?.userId || "", code: mfaCode };\
      const data = recoveryMode ? await verifyMfaRecoveryCode(reqPayload) : await challengeMfa(reqPayload);\
      localStorage.setItem("token", data.token);\
      localStorage.setItem("user", JSON.stringify(data.user));\
      await login(data.user, data.token, data.refreshToken);\
      \
      const roleVal = Number(data.user.role);\
      const isTeacherDomain = window.location.hostname.startsWith("teacher.");\
      if (roleVal === 1 || data.user.role === "Teacher") {\
        if (isTeacherDomain) {\
          navigate("/teacher", { replace: true });\
        } else {\
          const targetUrl = window.location.protocol + "//teacher." + window.location.host + "/auth-sync#token=" + data.token + "&refreshToken=" + (data.refreshToken || "");\
          window.location.href = targetUrl;\
        }\
        return;\
      } else {\
        if (isTeacherDomain) {\
          const targetUrl = window.location.protocol + "//" + window.location.host.replace("teacher.", "") + "/auth-sync#token=" + data.token + "&refreshToken=" + (data.refreshToken || "");\
          window.location.href = targetUrl;\
          return;\
        }\
      }\
      navigate("/student", { replace: true });\
    } catch (err: any) {\
      setError(err?.response?.data?.message || "Invalid verification code.");\
    } finally {\
      setLoading(false);\
    }\
  };\
' src/features/auth/Login.tsx
