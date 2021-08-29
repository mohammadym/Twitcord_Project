const monthNumberToLabelMap = {
  [1]: 'January',
  [2]: 'February',
  [3]: 'March',
  [4]: 'April',
  [5]: 'May',
  [6]: 'June',
  [7]: 'July',
  [8]: 'August',
  [9]: 'September',
  [10]: 'October',
  [11]: 'November',
  [12]: 'December',
};

const dhm = (t) => {
  const cd = 24 * 60 * 60 * 1000;
  const ch = 60 * 60 * 1000;
  let d = Math.floor(t / cd);
  let h = Math.floor( (t - d * cd) / ch);
  let m = Math.round( (t - d * cd - h * ch) / 60000);
  const pad = function(n) {
    return n < 10 ? 0 + n : n;
  };
  if ( m === 60 ) {
    h++;
    m = 0;
  }
  if ( h === 24 ) {
    d++;
    h = 0;
  }
  return [d, pad(h), pad(m)];
};

export const extractTime = (dateString) => {
  let showingDate = 'now';
  const date = new Date(dateString);
  const currentDate = new Date();
  const dateInMillies = date.getTime();
  const currentDateInMillies = currentDate.getTime();
  const diffInMillies = currentDateInMillies - dateInMillies;
  const dhmResult = dhm(diffInMillies);
  const diffDays = dhmResult[0];
  const diffHours = dhmResult[1];
  const diffMins =dhmResult[2];
  if (diffHours < 1 && diffDays < 1 && diffMins > 0) {
    showingDate = diffMins + ' m';
    return showingDate;
  }
  if (diffDays < 1 && diffHours > 0) {
    showingDate = diffHours + ' h';
    return showingDate;
  }
  if (date.getTime() < currentDate.getTime()) {
    showingDate = date.getFullYear() +
    ' ' + ( monthNumberToLabelMap[date.getMonth() + 1] ) +
    ' ' + date.getDate();
  }
  return showingDate;
};
