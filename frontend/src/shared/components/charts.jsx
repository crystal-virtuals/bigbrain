import { ThemeProvider, createTheme, useMediaQuery } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import {
  getAverageTimePerQuestion,
  getQuestionAccuracy,
  getQuestionTypeAccuracy,
} from '@utils/results';
import * as React from 'react';
import {
  blueberryTwilightPalette,
  mangoFusionPalette,
  cheerfulFiestaPalette,
  strawberrySkyPalette,
  rainbowSurgePalette,
  bluePalette,
  greenPalette,
  purplePalette,
  redPalette,
  orangePalette,
  yellowPalette,
  cyanPalette,
  pinkPalette,
} from '@mui/x-charts/colorPalettes';

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
export function QuestionAccuracyChart({ playerResults }) {
  // Calculate the percentage of players who answered each question correctly
  const chartData =
    playerResults && playerResults.length > 0
      ? getQuestionAccuracy(playerResults)
      : [];

  const series = [
    {
      data: chartData.map((q) => q.percentCorrect),
      label: 'Accuracy (%)',
      area: true,
    },
  ]

  const xAxis = [
    {
      scaleType: 'band',
      data: chartData.map((q) => `${q.question}`),
    },
  ];

  const yAxis = [
    {
      label: 'Percent of Players (%)',
    },
  ];

  return (
    <BarChart
      loading={!playerResults}
      colors={rainbowSurgePalette}
      xAxis={xAxis}
      yAxis={yAxis}
      series={series}
      height={300}
    />
  );
}

export function ResponseTimeChart({ playerResults }) {
  // Calculate average time per question
  const chartData =
    playerResults && playerResults.length > 0
      ? getAverageTimePerQuestion(playerResults)
      : [];

  const series = [
    {
      data: chartData.map((q) => q.avgTime),
      label: 'Average Time (sec)',
      area: true,
      color: '#ff9da7',
    },
  ];

  const xAxis = [
    {
      scaleType: 'band',
      data: chartData.map((q) => `${q.question}`),
    },
  ];

  const yAxis = [
    {
      label: 'Average Time (sec)',
    },
  ];

  return (
    <LineChart
      loading={!playerResults}
      xAxis={xAxis}
      yAxis={yAxis}
      series={series}
      height={300}
    />
  );
}

export function QuestionTypeAccuracyChart({ playerResults }) {
  const series = [
    {
      data: getQuestionTypeAccuracy(playerResults),
      innerRadius: 40,
      outerRadius: 100,
      paddingAngle: 5,
      cornerRadius: 5,
    },
  ];

  const legendPlacement = {
    slotProps: {
      legend: {
        direction: 'row',
        position: { vertical: 'bottom', horizontal: 'middle' },
      },
    },
  };

  return (
    <PieChart
      loading={!playerResults}
      colors={rainbowSurgePalette}
      series={series}
      height={300}
      {...legendPlacement}
    />
  );
}
