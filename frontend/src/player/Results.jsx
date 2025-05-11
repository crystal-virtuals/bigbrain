import { Heading } from '@components/heading';
import { Skeleton } from '@components/loading';
import { playerAPI } from '@services/api';
import { useEffect, useState } from 'react';
import { useSession } from '@hooks/session';
import { generatePlayerResults, generatePlayerStats } from '@utils/results';
import { Card, PlayerResultsTable, StatsList, PointsScoringSystem } from '@components/results';

export default function Results({ playerId }) {
  const { questions } = useSession();
  const [results, setResults] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true);
        const response = await playerAPI.getResults(playerId);
        const newResults = generatePlayerResults(response, questions);
        const stats = generatePlayerStats(newResults);
        setResults(newResults);
        setStats(stats);
      } catch (err) {
        console.error('Failed to fetch results:', err);
        setError('Failed to load results. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [playerId, questions]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Skeleton />
      </div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">{error}</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="flex flex-col space-y-2">
        <div className="border-b border-zinc-950/10 pb-6 dark:border-white/10">
          <Heading>Results</Heading>
        </div>

        <div className="w-full h-full flex flex-col space-y-6 pb-16">
          <PointsScoringSystem />

          <Card>
            <PlayerResultsTable results={results} />
          </Card>

          {stats && (
            <Card>
              <StatsList stats={stats} />
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
