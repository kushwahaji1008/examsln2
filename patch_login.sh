#!/bin/bash
sed -i -e "/\/\/ Default fallback is Student/i \
      \/\/ Subdomain routing for Teachers vs Students\
      const isTeacherDomain = window.location.hostname.startsWith('teacher.');\
      if (roleVal === 1 || data.user.role === 'Teacher') {\
        if (isTeacherDomain) {\
          navigate('/teacher', { replace: true });\
        } else {\
          const isDev = window.location.hostname === 'localhost' || window.location.hostname.includes('ais-dev');\
          if (isDev) {\
            console.warn('In dev/preview environment, subdomain routing is simulated.');\
            navigate('/teacher', { replace: true });\
          } else {\
            const targetUrl = window.location.protocol + '//teacher.' + window.location.host + '/auth-sync#token=' + data.token + '&refreshToken=' + (data.refreshToken || '');\
            window.location.href = targetUrl;\
          }\
        }\
        return;\
      } else {\
        if (isTeacherDomain) {\
          const targetUrl = window.location.protocol + '//' + window.location.host.replace('teacher.', '') + '/auth-sync#token=' + data.token + '&refreshToken=' + (data.refreshToken || '');\
          window.location.href = targetUrl;\
          return;\
        }\
      }\
" src/features/auth/Login.tsx
