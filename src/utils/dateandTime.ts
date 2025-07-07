export const convertTo24Hour = (timeStr: string): string => {
 
    if (!timeStr) return '00:00';

  // Normalize string: remove unicode space (e.g. ` `) and trim
  timeStr = timeStr.replace(/\u202f/g, ' ').trim().toLowerCase();

  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s?(am|pm)$/i);
  if (!match) return '00:00';

  let [_, hourStr, minuteStr, period] = match;
  let hours = parseInt(hourStr, 10);
  const minutes = parseInt(minuteStr, 10);

  if (period === 'pm' && hours < 12) hours += 12;
  if (period === 'am' && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
};
export const getParsedTime = (timeStr: string): Date => {
    console.log("time-->,",timeStr)
  if (!timeStr) return new Date();

  // Normalize space between time and AM/PM
  timeStr = timeStr.replace(/(am|pm)$/i, ' $1').trim();

  const match = timeStr.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
  if (!match) return new Date();

  let [_, hourStr, minuteStr, period] = match;
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);

  if (period.toLowerCase() === 'pm' && hour < 12) hour += 12;
  if (period.toLowerCase() === 'am' && hour === 12) hour = 0;

  const now = new Date();
  now.setHours(hour);
  now.setMinutes(minute);
  now.setSeconds(0);
  now.setMilliseconds(0);
  return now;
};
export const convert24To12Hour = (time: string): string => {
  const [hourStr, minuteStr] = time.split(':');
  let hour = parseInt(hourStr, 10);
  const minute = parseInt(minuteStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';

  hour = hour % 12 || 12;

  return `${hour.toString().padStart(2, '0')}:${minuteStr} ${ampm}`;
};