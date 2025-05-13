import {
  MuiColorTemplate,
  QuestionAccuracyChart,
  QuestionTypeAccuracyChart,
  ResponseTimeChart,
} from '@components/charts';
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
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import {
  NumberedList,
  NumberedListItem,
  List,
  ListItemIcon,
} from '@components/list';
import { Maths } from '@components/maths';
import { Accordion } from './accordion';
import { Text, Strong } from '@components/text';

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
  const steps = [
    {
      title: 'Divide response time by the question duration.',
      description: 'For example, if the player answered 3 seconds after a 10-second question timer started, the value would be 3/10 = 0.3.',
    },
    {
      title: "Multiply that value by the question's total point value.",
      description:
        'For example, if the question was worth 5 points, then 5 × 0.3 = 1.5.',
    },
    {
      title: 'Round to the nearest whole number.',
      description: 'For example, 1.5 would round up to 2 points.',
    },
  ];

  return (
    <div className="mx-auto w-full divide-y dark:divide-white/5 my-6 border border-zinc-950/5 dark:border-white/5  px-3">
      <Accordion title="Points Scoring System">
        <div className="p-6 rounded-lg border flex flex-col items-start space-y-4">

          <Subheading>How Your Score Was Calculated</Subheading>

          <Text>
            Points are awarded based on the speed of the answer. The faster you
            answer, the more points you earn!
          </Text>

          <Text>Here’s how it works: </Text>
          <NumberedList>
            {steps.map((step, index) => (
              <NumberedListItem key={index} number={index + 1} color="dark">
                <Text><Strong>{step.title}</Strong>{step.description}</Text>
              </NumberedListItem>
            ))}
          </NumberedList>

          <Text> For math wizards, this can be expressed as:</Text>
          <List>
            <ListItemIcon type="success">
              <Text><Strong>Correct answers</Strong> earn <Maths>⌈ points × ( response time / question timer )⌉</Maths> possible points.</Text>
            </ListItemIcon>
            <ListItemIcon type="error">
              <Text><Strong>Incorrect answers</Strong> earn <Maths>0</Maths> points.</Text>
            </ListItemIcon>
          </List>
        </div>
      </Accordion>
    </div>
  );
}

/***************************************************************
                  Admin Results Dashboard
***************************************************************/
export function ResultsDashboard({ playerResults }) {
  if (!playerResults || playerResults.length === 0) {
    return (
      <div className="py-8 text-center">
        <Text>No results available</Text>
      </div>
    );
  }

  return (
    <MuiColorTemplate>
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
    </MuiColorTemplate>
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
