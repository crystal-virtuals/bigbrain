import { DescriptionDetails, DescriptionTerm } from '@components/description-list';
import { Heading } from '@components/heading';
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


/***************************************************************
                      Stats
***************************************************************/
export function StatsList({ stats }) {
  return (
    <div>
      <Heading>Summary</Heading>
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
  )
}

function StatCard({ name, value, unit = '' }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white dark:bg-white/5 shadow-sm px-6 py-3">
      <DescriptionTerm className="truncate text-sm/6 font-medium">{name}</DescriptionTerm>
      <DescriptionDetails className="mt-2 flex items-baseline gap-x-2">
        <span className="text-4xl font-semibold tracking-tight text-neutral dark:text-white">{value}</span>
        {unit ? <span className="text-sm dark:text-gray-400 text-gray-500">{unit}</span> : null}
      </DescriptionDetails>
    </div>
  );
}

/***************************************************************
                      Table
***************************************************************/
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
          <TableHeader className="text-right">Time Taken (sec)</TableHeader>
          <TableHeader className="text-right">Points</TableHeader>
          <TableHeader>Status</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {results.map((question) => (
          <TableRow key={question.index}>
            <TableCell className="tabular-nums">{question.index}</TableCell>
            <TableCell className="text-right tabular-nums">
              {question.timeTaken ?? 'N/A'}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {question.score} / {question.points}
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center gap-1.5 ${
                  question.correct ? 'text-green-500 dark:text-success' : 'text-rose-400'
                }`}
              >
                {question.correct ? (
                  <>
                    <CheckIcon className="size-4"/> <span className='hidden md:block'>Correct</span>
                  </>
                ) : (
                  <>
                    <XMarkIcon className="size-4" /> <span className='hidden md:block'>Incorrect</span>
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
