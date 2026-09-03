#!/bin/bash
sed -i -e "s/<span>Student Portal<\/span>/{window.location.hostname.startsWith('teacher.') ? <span>Teacher Portal<\/span> : <span>Student Portal<\/span>}/g" src/features/auth/Login.tsx
