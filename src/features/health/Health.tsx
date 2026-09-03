import { useEffect, useState } from 'react';
import apiClient from '@/services/api/client';
import { genExams, genAttempts } from '@/services/api/generated';

export default function Health() {
  const [status, setStatus] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      apiClient.get('/auth/health'),
      genExams.examsHealth(),
      genAttempts.attemptsHealth(),
    ])
      .then(([authRes, examsRes, attemptsRes]) => {
        setStatus({ auth: authRes.data, exams: examsRes, attempts: attemptsRes });
      })
      .catch(() => setStatus(null));
  }, []);

  return (
    <div>
      <h1 className="text-xl font-bold">API Health</h1>
      <pre className="mt-4">{JSON.stringify(status, null, 2)}</pre>
    </div>
  );
}
