import {
  DescriptionDetails,
  DescriptionTerm,
} from '@components/description-list';
import { Subheading } from '@components/heading';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/table';
import { Text } from '@components/text';
import { CheckIcon, XMarkIcon, BoltIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/20/solid';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import {
  getAverageTimePerQuestion,
  getQuestionAccuracy,
  getQuestionTypeAccuracy,
} from '@utils/results';
import { Accordion } from './accordion';
/***************************************************************
                      Card
***************************************************************/
export function Card({ children }) {
  return (
    <div className="bg-zinc-50 dark:bg-white/5 p-6 rounded-lg">
      <div className="flex flex-col space-y-4">{children}</div>
    </div>
  );
}

/***************************************************************
                      Points Scoring System
***************************************************************/
export function PointsScoringSystem() {
  return (
    <div className="mx-auto w-full divide-y divide-white/5 my-6 border border-white/5">
      <Accordion title="Points Scoring System">
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-md font-semibold text-blue-800 mb-4">
            How Your Score Was Calculated
          </h2>
          <div className="prose text-blue-700 flex flex-col space-y-4">
            <p>
              Your score is based on both <strong>accuracy</strong> and <strong>speed</strong>:
            </p>
            <ul className="list-inside space-y-2">
              <li className="flex items-center gap-2">
                <CheckCircleIcon className="size-6 text-green-500" />
                <span>
                  <strong>Correct answers</strong> earn the question&apos;s base points
                </span>
              </li>
              <li className="flex items-center gap-2">
                <BoltIcon className="size-6 text-yellow-500" />
                <span>
                  <strong>Fast response</strong> times earn bonus points (up to 2× the base points)
                </span>
              </li>
              <li className="flex items-center gap-2">
                <ExclamationTriangleIcon className="size-6 text-red-500" />
                <span>
                 Incorrect answers earn 0 points
                </span>
              </li>
            </ul>
            <p className="text-sm flex flex-col items-start gap-2">
              <span><u>Example:</u> A 5-point question answered correctly in 3 seconds (within a 10s duration) would earn:</span>
              <code>5 × (1 + (10 - 3)/10) = 5 × 1.7 = 8.5 points</code>
            </p>
          </div>
        </div>
      </Accordion>
    </div>
  );
}

/***************************************************************
                      Charts
***************************************************************/
function QuestionAccuracyChart({ playerResults }) {
  if (!playerResults || playerResults.length === 0) return null;
  // Calculate the percentage of players who answered each question correctly
  const chartData = getQuestionAccuracy(playerResults);

  return (
    <BarChart
      xAxis={[
        {
          scaleType: 'band',
          data: chartData.map((q) => `${q.question}`),
        },
      ]}
      yAxis={[
        {
          label: 'Percent of Players (%)',
        },
      ]}
      series={[
        { data: chartData.map((d) => d.percentCorrect), label: 'Accuracy (%)' },
      ]}
      height={300}
    />
  );
}

function ResponseTimeChart({ playerResults }) {
  if (!playerResults || playerResults.length === 0) return null;
  // Calculate average time per question
  const chartData = getAverageTimePerQuestion(playerResults);
  return (
    <LineChart
      xAxis={[
        {
          scaleType: 'band',
          data: chartData.map((d) => d.question),
        },
      ]}
      yAxis={[
        {
          label: 'Average Time',
        },
      ]}
      series={[
        {
          data: chartData.map((q) => q.avgTime),
          label: 'Response Time (sec)',
          area: true,
        },
      ]}
      height={300}
    />
  );
}

function QuestionTypeAccuracyChart({ playerResults }) {
  if (!playerResults || playerResults.length === 0) return null;

  const data = getQuestionTypeAccuracy(playerResults);

  return (
    <PieChart
      series={[
        {
          data,
          innerRadius: 40,
          outerRadius: 100,
          paddingAngle: 5,
          cornerRadius: 4,
        },
      ]}
      height={300}
      tooltip={{
        trigger: 'item',
        formatter: (params) => `${params.label}: ${params.value.toFixed(1)}%`,
      }}
      slotProps={{
        legend: {
          direction: 'row',
          position: { vertical: 'bottom', horizontal: 'middle' },
        },
      }}
    />
  );
}

export function ResultsDashboard({ playerResults }) {
  return (
    <div className="flex flex-col space-y-8">
      {/* Top Players Table */}
      <Card>
        <Subheading>Top Performers</Subheading>
        <TopPlayerResultsTable playerResults={playerResults} />
      </Card>

      {/* Question Accuracy */}
      <Card>
        <Subheading>Question Accuracy</Subheading>
        <Text className="text-gray-600 mb-4">
          Percentage of players who answered each question correctly.
        </Text>
        <QuestionAccuracyChart playerResults={playerResults} />
      </Card>

      {/* Response Times */}
      <Card>
        <Subheading>Response Time</Subheading>
        <Text className="text-gray-600 mb-4">
          Average time players spent on each question before answering.
        </Text>
        <ResponseTimeChart playerResults={playerResults} />
      </Card>

      {/* Question Type Performance */}
      <Card>
        <Subheading>Accuracy by Question Type</Subheading>
        <Text className="text-gray-600 mb-4">
          Comparison of accuracy across different question types.
        </Text>
        <QuestionTypeAccuracyChart playerResults={playerResults} />
      </Card>
    </div>
  );
}

/***************************************************************
                      Stats
***************************************************************/
export function StatsList({ stats }) {
  return (
    <div>
      <Subheading>Summary</Subheading>
      <dl className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4">
        {stats.map((item, index) => (
          <StatCard
            key={index}
            name={item.name}
            value={item.value}
            unit={item.unit}
          />
        ))}
      </dl>
    </div>
  );
}

function StatCard({ name, value, unit = '' }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white dark:bg-white/5 shadow-sm px-6 py-3">
      <DescriptionTerm className="truncate text-sm/6 font-medium">
        {name}
      </DescriptionTerm>
      <DescriptionDetails className="mt-2 flex items-baseline gap-x-2">
        <span className="text-4xl font-semibold tracking-tight text-neutral dark:text-white">
          {value}
        </span>
        {unit ? (
          <span className="text-sm dark:text-gray-400 text-gray-500">
            {unit}
          </span>
        ) : null}
      </DescriptionDetails>
    </div>
  );
}

/***************************************************************
                      Table
***************************************************************/
// A table of up to top 5 users and their scores
export function TopPlayerResultsTable({ playerResults }) {
  if (!playerResults || playerResults.length === 0) return null;
  const topPlayers = playerResults
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 5);

  return (
    <Table dense className="[--gutter:--spacing(6)] sm:[--gutter:--spacing(8)]">
      <TableHead>
        <TableRow>
          <TableHeader>Rank</TableHeader>
          <TableHeader>Player</TableHeader>
          <TableHeader className="text-right hidden md:block">
            Accuracy
          </TableHeader>
          <TableHeader className="text-right">Score</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {topPlayers.map((player, index) => (
          <TableRow key={index}>
            <TableCell className="tabular-nums">{index + 1}</TableCell>
            <TableCell className="font-medium">{player.name}</TableCell>
            <TableCell className="text-right tabular-nums hidden md:block">
              {player.successRate}%
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {player.totalScore}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function PlayerResultsTable({ results }) {
  if (!results || results.length === 0) {
    return (
      <div className="py-8 text-center">
        <Text>No results available</Text>
      </div>
    );
  }

  return (
    <Table dense>
      <TableHead>
        <TableRow>
          <TableHeader>Question</TableHeader>
          <TableHeader className="text-right">Score</TableHeader>
          <TableHeader className="text-right">Response Time (s)</TableHeader>
          <TableHeader>Status</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {results.answers.map((answer) => (
          <TableRow key={answer.index}>
            <TableCell className="tabular-nums">{answer.index}</TableCell>
            <TableCell className="text-right tabular-nums">
              {answer.score}
            </TableCell>

            <TableCell className="text-right tabular-nums">
              {answer.timeTaken ?? 'N/A'}
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center gap-1.5 ${
                  answer.correct
                    ? 'text-green-500 dark:text-success'
                    : 'text-rose-400'
                }`}
              >
                {answer.correct ? (
                  <>
                    <CheckIcon className="size-4" />{' '}
                    <span className="hidden md:block">Correct</span>
                  </>
                ) : (
                  <>
                    <XMarkIcon className="size-4" />{' '}
                    <span className="hidden md:block">Incorrect</span>
                  </>
                )}
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
