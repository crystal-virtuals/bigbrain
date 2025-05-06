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
import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import {
  getAverageTimePerQuestion,
  getQuestionAccuracy,
  getQuestionTypeAccuracy
} from '@utils/results';

/***************************************************************
                      Card
***************************************************************/
export function Card({ children }) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-lg">
      <div className="flex flex-col space-y-4">{children}</div>
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
