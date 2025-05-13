import { Skeleton } from '@components/loading';
import { useToast } from '@hooks/toast';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Heading } from '@components/heading';
import { Breadcrumbs } from '@components/breadcrumbs';
import { generateAdminPlayerResults } from '@utils/results';
import { ResultsDashboard, PointsScoringSystem } from '@components/results';
import { sessionAPI } from '@services/api';
const breadcrumbs = [
  { label: 'Dashboard', link: '/dashboard' },
  { label: 'Results' },
];

export default function Results({ ...props }) {
  const { sessionId, session } = props;
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const toastify = useToast();

  // Fetch the results of the game
  useEffect(() => {
    if (!sessionId) return;
    const fetchResults = async () => {
      try {
        const ret = await sessionAPI.getResults(sessionId);
        const results = generateAdminPlayerResults(ret, session);
        console.log('Results:', results);
        setResults(results);
      } catch (error) {
        console.error('Error fetching game results:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [sessionId]);

  if (loading) {
    return <Skeleton />;
  }

  if (error) {
    toastify.error({ message: error.message });
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="w-full max-w-2xl mx-auto pb-16">
      <Breadcrumbs crumbs={breadcrumbs} />
      <div className="border-b border-zinc-950/10 pb-6 dark:border-white/10 my-6">
        <Heading>Results</Heading>
      </div>
      <div className="w-full min-h-[calc(100vh-8rem)]">
        <PointsScoringSystem />
        <ResultsDashboard playerResults={results} />
      </div>
    </div>
  );
}
