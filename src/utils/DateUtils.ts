const convertDateToDDMMYYYY = (value: Date | string) => {
  if (!value) return '';
  const date = new Date(value);
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const convertDateToYYYYMMDD = (value: Date | string) => {
  if (!value) return '';
  const dateObj = new Date(value);
  if (isNaN(dateObj.getTime())) return ''; 

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();

  return `${year}-${month}-${day}`;
};
const convertDateToYYYYMMDD1 = (value: Date | string) => {
  if (!value) return '';
  const dateObj = new Date(value);
  if (isNaN(dateObj.getTime())) return ''; 

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();

  return `${year}/${month}/${day}`;
};

const convertDateToDDMMYYYY_H_M = (value: Date | string) => {
  if (!value) return '';
  const date = new Date(value);
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const month =
    date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
  const year = date.getFullYear();
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes =
    date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const convertToDateWithZeroTime = (dateInput: Date) => {
  const date = new Date(dateInput);
  date.setUTCHours(0, 0, 0, 0);
  return date.toISOString();
};
const convertDateToNextDate = (dateInput?: Date | string | null) => {
  if (!dateInput) return null;

  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return null;

  date.setHours(date.getHours() + 7);
  return date;
};

const convertToYesterdayISO = (dateStr: string) => {
  const date = new Date(dateStr);

  const isoDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    17, 0, 0
  ).toISOString();

  return isoDate;
}

const checkIsOrderThen18 = (dateInput?: Date | string) => {
  if (!dateInput) {
    return false;
  }
  const today = new Date();
  const birthDate = new Date(dateInput);
  const age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    return age > 18;
  }
  return age >= 18;
};

const convertTime = (totalMilliseconds: number) => {
  const totalSeconds = Math.floor(totalMilliseconds / 1000);

  const days = Math.floor(totalSeconds / 86400);
  const remainingSecondsAfterDays = totalSeconds % 86400;

  const hours = Math.floor(remainingSecondsAfterDays / 3600);
  const remainingSecondsAfterHours = remainingSecondsAfterDays % 3600;

  const minutes = Math.floor(remainingSecondsAfterHours / 60);

  return `${days}d${hours}h${minutes}m`;
};

const formatTimeAMPM = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  const paddedMinutes = minutes < 10 ? '0' + minutes : minutes;
  return `${hour12}:${paddedMinutes} ${ampm}`;
};

export default {
  convertDateToDDMMYYYY,
  convertToDateWithZeroTime,
  checkIsOrderThen18,
  convertDateToDDMMYYYY_H_M,
  convertTime,
  convertDateToNextDate,
  convertToYesterdayISO,
  formatTimeAMPM,
  convertDateToYYYYMMDD,
  convertDateToYYYYMMDD1
};
