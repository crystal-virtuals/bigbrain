/***************************************************************
                       String Processing
***************************************************************/
export const pluralSuffix = (count) => count > 1 ? 's' : '';

export const getInitials = (name) => {
  const names = name.split(' ');
  const initials = names.map((n) => n.charAt(0).toUpperCase()).join('');
  return initials;
}

export const isEmptyString = (string) => {
  if (string === null || string === undefined) {
    return true;
  }
  if (typeof string !== 'string') {
    return true;
  }
  return string.trim() === '';
}

/***************************************************************
                       Date Processing
***************************************************************/
const timeAgo = (timestamp) => {
  const now = new Date();
  const date = new Date(timestamp);

  const diff = {
    seconds: Math.floor((now - date) / 1000),
    minutes: Math.floor((now - date) / (1000 * 60)),
    hours: Math.floor((now - date) / (1000 * 60 * 60)),
    days: Math.floor((now - date) / (1000 * 60 * 60 * 24)),
    weeks: Math.floor((now - date) / (1000 * 60 * 60 * 24 * 7)),
  }

  return diff;
}

export const timeAgoString = (timestamp) => {
  const diff = timeAgo(timestamp);
  const date = new Date(timestamp);

  // less than 1 minute ago
  if (diff.minutes < 1) {
    return "Just now";
  }
  // less than 1 hour ago
  else if (diff.minutes < 60) {
    return `${diff.minutes} min${pluralSuffix(diff.minutes)} ago`;
  }
  // less than 24 hours ago
  else if (diff.hours < 24) {
    return `${diff.hours}h ago`;
  }
  // less than a week ago
  else if (diff.days < 7) {
    return `${diff.days}d ago`;
  }
  // a week ago or more
  else if (diff.days >= 7 && diff.days < 30) {
    const weeks = diff.weeks;
    return `${weeks}week${pluralSuffix(weeks)} ago`;
  }
  // default to "June 8, 2020"
  else {
    return date.toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

export const dateToString = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('en-AU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/***************************************************************
                        React Helpers
***************************************************************/
export const getRandomBgColor = (key) => {
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-amber-500',
    'bg-yellow-500',
    'bg-green-500',
    'bg-emerald-500',
    'bg-teal-500',
    'bg-lime-500',
    'bg-cyan-500',
    'bg-sky-500',
    'bg-indigo-500',
    'bg-violet-500',
    'bg-purple-500',
    'bg-fuchsia-500',
    'bg-pink-500',
    'bg-rose-500',
    'bg-blue-500',
  ];
  return colors[Number(key) % colors.length];
}

export const getRandomColor = (key) => {
  const colors = [
    'lime',
    'purple',
    'red',
    'orange',
    'amber',
    'yellow',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'fuchsia',
    'pink',
    'rose',
  ];
  return colors[Number(key) % colors.length];
}

// Takes a list of class names and returns a single string with all the class names joined by a space
// and filtered to remove any falsy values (e.g. null, undefined, false, etc.)
export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
