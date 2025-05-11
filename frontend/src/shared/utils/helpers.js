/***************************************************************
                      Data Input
***************************************************************/
/**
 * Given a js file object representing a jpg or png image, such as one taken
 * from a html file input element, return a promise which resolves to the file
 * data as a data url.
 * More info:
 *   https://developer.mozilla.org/en-US/docs/Web/API/File
 *   https://developer.mozilla.org/en-US/docs/Web/API/FileReader
 *   https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs
 *
 * Example Usage:
 *   const file = document.querySelector('input[type="file"]').files[0];
 *   console.log(fileToDataUrl(file));
 * @param {File} file The file to be read.
 * @return {Promise<string>} Promise which resolves to the file as a data url.
 */
export function fileToDataUrl(file) {
  const validFileTypes = [ 'image/jpeg', 'image/png', 'image/jpg' ]
  const valid = validFileTypes.find(type => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw Error('Invalid file type. Please upload a PNG, JPG, or JPEG.');
  }

  const reader = new FileReader();
  const dataUrlPromise = new Promise((resolve,reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });
  reader.readAsDataURL(file);
  return dataUrlPromise;
}

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

// Check if a value is null, undefined, or an empty string
export const isNullOrUndefined = (value) => {
  return  (value === null || value === undefined || value === '');
}

export const splitNumber = (number) => {
  const str = number.toString();
  // split in half
  const mid = Math.floor(str.length / 2);
  const firstPart = str.slice(0, mid);
  const secondPart = str.slice(mid);
  return [firstPart, secondPart];
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
                        Misc
***************************************************************/
export const uid = () => {
  const num = Math.floor(Math.random() * 1000000);
  return parseInt(num, 10); // return as a 10 digit number
}

/***************************************************************
                        Colors
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
