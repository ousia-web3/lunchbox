import { format, getDate, getMonth, getYear } from 'date-fns';

export const shouldUpdateMealData = () => {
  const now = new Date();
  const currentDate = getDate(now);
  
  // 매월 20일 00:00에 업데이트
  if (currentDate === 20) {
    return true;
  }

  return false;
};

export const getNextMonthDate = (date) => {
  const currentMonth = getMonth(date);
  const currentYear = getYear(date);

  // 12월인 경우 다음 해 1월로
  if (currentMonth === 11) {
    return new Date(currentYear + 1, 0, 1);
  }

  // 그 외의 경우 다음 달 1일로
  return new Date(currentYear, currentMonth + 1, 1);
};

export const formatDateForAPI = (date) => {
  return format(date, 'yyyyMM');
}; 