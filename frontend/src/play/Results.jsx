import { Heading } from '@components/heading';
import { Skeleton } from '@components/loading';
import { playerAPI } from '@services/api';
import { useEffect, useState } from 'react';
import { usePlayer } from '@hooks/player';
import { calculateAverageTime, calculateTimeTaken, calculateSuccessRate, calculateTotalAnswered } from '@utils/session';
import { PlayerResultsTable, StatsList } from '@components/session/results';

export default function Results({ playerId }) {
  const { player, questions } = usePlayer();
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResults() {
      try {
        setLoading(true);
        const response = await playerAPI.getResults(playerId);

        const newResults = response.map((q, index) => {

          const timeTaken = calculateTimeTaken(
            q.questionStartedAt,
            q.answeredAt
          );

          const points = questions[index]?.points || 0;
          const score = q.correct ? points : 0;

          return {
            index: index + 1,
            timeTaken,
            score,
            points,
            correct: q.correct,
            answers: q.answers,
          };
        });

        setResults(newResults);
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

  const stats = [
    {
      name: 'Total Answered',
      value: calculateTotalAnswered(results),
      unit: '/ ' + results.length,
    },
    {
      name: 'Average Time',
      value: calculateAverageTime(results),
      unit: 'secs',
    },
    {
      name: 'Success Rate',
      value: calculateSuccessRate(results),
      unit: '%',
    }
  ]

  return (
    <div className="w-full max-w-4xl mx-auto px-6">
      <div className="flex flex-col space-y-8">
        <div className="border-b border-zinc-950/10 pb-6 dark:border-white/10">
          <Heading>Results</Heading>
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-lg">
          <PlayerResultsTable results={results} />
        </div>

        {results && (
          <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-lg">
            <StatsList stats={stats} />
          </div>
        )}
      </div>
    </div>
  );
}