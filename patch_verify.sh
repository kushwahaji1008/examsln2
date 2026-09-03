#!/bin/bash
sed -i -e '/const userRole = Number(data.user.role);/c \
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
' src/features/auth/VerifyEmail.tsx
