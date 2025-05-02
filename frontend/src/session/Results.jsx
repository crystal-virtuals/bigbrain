import { Skeleton } from '@components/loading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/table';
import { useToast } from '@hooks/toast';
import { sessionAPI } from '@services/api';
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Heading } from '@components/heading';
import { Breadcrumbs } from '@components/breadcrumbs';
// A table of up to top 5 users and their scores
function ResultsTable({ players }) {
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const topPlayers = sortedPlayers.slice(0, 5);

  return (
    <Table dense className="[--gutter:--spacing(6)] sm:[--gutter:--spacing(8)]">
      <TableHead>
        <TableRow>
          <TableHeader>Rank</TableHeader>
          <TableHeader>Player</TableHeader>
          <TableHeader className="text-right">Score</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {topPlayers.map((player, index) => (
          <TableRow key={player.index}>
            <TableCell className="tabular-nums">{index + 1}</TableCell>
            <TableCell className="font-medium">{player.name}</TableCell>
            <TableCell className="text-right tabular-nums">
              {player.score}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

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
        setResults(ret);
        console.log('Fetched results:', ret);
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
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex flex-col space-y-12">
        <Breadcrumbs crumbs={breadcrumbs} />
        <div className="border-b border-zinc-950/10 pb-6 dark:border-white/10">
          <Heading>Results</Heading>
        </div>
        <div className="w-full min-h-[calc(100vh-8rem)]">
          <ResultsTable players={results} />
        </div>
      </div>
    </div>
  );
}
