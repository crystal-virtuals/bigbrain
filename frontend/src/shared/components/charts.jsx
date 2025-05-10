import { ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { rainbowSurgePalette } from '@mui/x-charts/colorPalettes';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import {
  getAverageTimePerQuestion,
  getQuestionAccuracy,
  getQuestionTypeAccuracy,
} from '@utils/results';
import * as React from 'react';

export function MuiColorTemplate({ children }) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? 'dark' : 'light',
        },
      }),
    [prefersDarkMode]
  );

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

/***************************************************************
                      Charts
***************************************************************/
const emptySeries = {
  series: [],
  height: 300,
};

export function QuestionAccuracyChart({ playerResults }) {
  // Calculate the percentage of players who answered each question correctly
  const chartData = getQuestionAccuracy(playerResults);
  const isEmpty = chartData.every((q) => q.percentCorrect === null);

  const nonEmptySeries = {
    series: [{
      data: chartData.map((q) => q.percentCorrect),
      label: 'Accuracy (%)',
      area: true,
    }],
    height: 300,
  }

  const xAxis = [
    {
      scaleType: 'band',
      data: chartData.map((q) => `${q.question}`),
    },
  ];

  const yAxis = [
    {
      min: 0,
      max: 100,
      label: 'Percent of Players (%)',
    },
  ];

  return (
    <BarChart
      loading={!playerResults}
      colors={rainbowSurgePalette}
      xAxis={xAxis}
      yAxis={yAxis}
      {...isEmpty ? emptySeries : nonEmptySeries}
    />
  );
}

export function ResponseTimeChart({ playerResults }) {
  // Calculate average time per question
  const chartData =getAverageTimePerQuestion(playerResults);
  const isEmpty = chartData.every((q) => q.avgTime === null);

  const nonEmptySeries = {
    series: [{
      data: chartData.map((q) => q.avgTime),
      label: 'Average Time (sec)',
      area: true,
      color: '#ff9da7',
    }],
    height: 300,
  }

  const xAxis = [
    {
      scaleType: 'band',
      data: chartData.map((q) => `${q.question}`),
    },
  ];

  const yAxis = [
    {
      min: 0,
      max: Math.max(...playerResults.map((q) => q.maxDuration)),
      label: 'Average Time (sec)',
    },
  ];

  return (
    <LineChart
      loading={!playerResults}
      xAxis={xAxis}
      yAxis={yAxis}
      colors={rainbowSurgePalette}
      {...isEmpty ? emptySeries : nonEmptySeries}
    />
  );
}

export function QuestionTypeAccuracyChart({ playerResults }) {
  const chartData = getQuestionTypeAccuracy(playerResults);
  const isEmpty = chartData === null;

  const legendPlacement = {
    slotProps: {
      legend: {
        direction: 'row',
        position: { vertical: 'bottom', horizontal: 'middle' },
      },
    },
  };

  const nonEmptySeries = {
    series: [{
      data: chartData,
      innerRadius: 40,
      outerRadius: 100,
      paddingAngle: 5,
      cornerRadius: 5,
    }],
    height: 300,
  }


  return (
    <PieChart
      loading={!playerResults}
      colors={rainbowSurgePalette}
      {...isEmpty ? emptySeries : nonEmptySeries}
      {...legendPlacement}
    />
  );
}
