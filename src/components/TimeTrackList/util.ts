const getInitConflictRange = () => {
  let conflictRange = [];
  for (let i = 0; i < 1440; i++) {
    conflictRange[i] = 0;
  }
  return conflictRange;
};
const getTimeScale = () => {
  let conflictRange = [];
  for (let i = 0; i < 1440; i++) {
    conflictRange[i] = 0;
  }
  return conflictRange;
};

const getTimeRange = () => {
  let timeRange = [];
  timeRange.push({
    id: Math.random().toString(32).slice(2),
    start: 20,
    duration: 400,
  });
  timeRange.push({
    id: Math.random().toString(32).slice(2),
    start: 20,
    duration: 80,
  });
  timeRange.push({
    id: Math.random().toString(32).slice(2),
    start: 40,
    duration: 498,
  });
  for (let i = 0; i < 20; i++) {
    timeRange.push({
      id: Math.random().toString(32).slice(2),
      start: 40,
      duration: Math.ceil(Math.random() * 500),
    });
  }
  return timeRange;
};

const getMockConflictRange = () => {
  const initConflictRange = getInitConflictRange();
  for (let i = 0; i < 20; i++) {
    initConflictRange[i] = 2;
  }
  for (let i = 77; i < 100; i++) {
    initConflictRange[i] = 2;
  }

  for (let i = 114; i < 200; i++) {
    initConflictRange[i] = 3;
  }
  for (let i = 248; i < 600; i++) {
    initConflictRange[i] = 3;
  }
  for (let i = 744; i < 1200; i++) {
    initConflictRange[i] = 3;
  }
  return initConflictRange;
};

export const calculateConflict = (
  range: [number, number],
  ranges: Array<[number, number]>
) => {
  const conflict = [];
  for (let i = 0; i < ranges.length; i++) {
    let lo = Math.max(range[0], ranges[i][0]);
    let hi = Math.min(range[1], ranges[i][1]);
    if (lo <= hi) {
      conflict.push([lo, hi - lo]);
    }
  }
  return conflict;
};

export const initConflictRange = getInitConflictRange();
export const mockConflictRange = getMockConflictRange();
export const initTimeRange = getTimeRange();
export const initTimeScale = getTimeScale();
