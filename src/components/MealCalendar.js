import React, { useState } from 'react';
import { Paper, Grid, Typography, Box, useMediaQuery } from '@mui/material';
import styled from '@emotion/styled';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, startOfWeek, endOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';
import MealDetailModal from './MealDetailModal';

const CalendarContainer = styled(Paper)`
  padding: 1.5rem 0.5rem 1.5rem 0.5rem;
  margin-top: 2rem;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,0.04);
  font-family: 'Pretendard', 'Noto Sans KR', 'Apple SD Gothic Neo', 'sans-serif';
`;

const DayCell = styled(Box)`
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  /* border: 1px solid rgba(0,0,0,0.04); */
  background: transparent;
  transition: background 0.2s;
`;

const DayNumber = styled(Typography)`
  font-family: inherit;
  font-size: 1.1em;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.2em;
  height: 2.2em;
  border-radius: 50%;
  background: ${props => props.isSelected ? '#7c3aed' : 'transparent'};
  color: ${props => props.isSelected ? '#fff' : props.isSunday ? '#e53935' : props.isToday ? '#7c3aed' : '#222'};
  transition: background 0.2s, color 0.2s;
`;

const MealInfo = styled(Typography)`
  font-size: 0.9rem;
  margin-top: 0.5rem;
  color: #666;
  white-space: pre-line;
`;

const AllergyEmoji = styled.span`
  font-size: 0.8rem;
  margin-left: 0.2rem;
`;

const allergyEmojiMap = {
  '1': '🥚', // 난류
  '2': '🥛', // 우유
  '3': '🌾', // 메밀
  '4': '🥜', // 땅콩
  '5': '🌱', // 대두
  '6': '🌾', // 밀
  '7': '🐟', // 고등어
  '8': '🦀', // 게
  '9': '🦐', // 새우
  '10': '🐷', // 돼지고기
  '11': '🍑', // 복숭아
  '12': '🍅', // 토마토
  '13': '🧪', // 아황산류
  '14': '🌰', // 호두
  '15': '🐔', // 닭고기
  '16': '🐄', // 쇠고기
  '17': '🦑', // 오징어
  '18': '🦪', // 조개류
  '19': '🌰'  // 잣
};

const parseMealInfo = (mealText) => {
  if (!mealText) return [];
  // CDATA, 공백 제거
  const cleanText = mealText.replace(/<!\[CDATA\[|\]\]>/g, '').trim();
  // <br/>, <br >, <br /> 등 모든 변형에 대응
  return cleanText.split(/<br\s*\/?>/i).map(item => {
    const match = item.match(/(.*?)\s*\(([\d.,\s]+)\)/);
    if (match) {
      return {
        name: match[1].trim(),
        allergies: match[2].split(/[.,\s]+/).filter(Boolean)
      };
    }
    return {
      name: item.trim(),
      allergies: []
    };
  });
};

const renderMealWithAllergies = (menuItem) => {
  return (
    <Box key={menuItem.name}>
      <Typography variant="body2">
        {menuItem.name}
        {menuItem.allergies.length > 0 && (
          <Tooltip title={menuItem.allergies.map(a => `${a}. ${allergyEmojiMap[a]}`).join(', ')}>
            <AllergyEmoji>
              {menuItem.allergies.map(a => allergyEmojiMap[a]).join('')}
            </AllergyEmoji>
          </Tooltip>
        )}
      </Typography>
    </Box>
  );
};

export default function MealCalendar({ mealData, currentDate }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');
  
  // 월의 시작일과 종료일
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  
  // 캘린더에 표시할 시작일과 종료일 (일요일부터 토요일까지)
  const calendarStart = startOfWeek(monthStart, { locale: ko });
  const calendarEnd = endOfWeek(monthEnd, { locale: ko });
  
  // 캘린더에 표시할 모든 날짜
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getMealForDate = (date) => {
    if (!mealData?.mealServiceDietInfo?.[1]?.row) return null;
    const target = format(date, 'yyyyMMdd');
    const rows = Array.isArray(mealData.mealServiceDietInfo[1].row)
      ? mealData.mealServiceDietInfo[1].row
      : [];
    return rows.find(
      meal => meal.MLSV_YMD && meal.MLSV_YMD.replace(/\s|\[|\]|CDATA|!|<|>|\//g, '') === target
    );
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setModalOpen(true);
  };

  const isCurrentMonth = (date) => {
    return format(date, 'M') === format(currentDate, 'M');
  };

  // 날짜 표기에서 0 제거
  const getMonth = (date) => String(date.getMonth() + 1);
  const getDay = (date) => String(date.getDate());

  return (
    <>
      <CalendarContainer elevation={0} style={{ maxWidth: isMobile ? '100%' : 400, margin: isMobile ? '0 auto' : '2rem auto' }}>
        <Grid container spacing={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => (
            <Grid item xs={12/7} key={day}>
              <Typography align="center" variant="subtitle1" sx={{
                color: idx === 0 ? '#e53935' : '#222',
                fontWeight: 600,
                fontFamily: 'inherit',
                fontSize: '1em',
                mb: 0.5
              }}>
                {day}
              </Typography>
            </Grid>
          ))}
          {days.map((date) => {
            const isToday = isSameDay(date, new Date());
            const isCurrentMonthDay = isCurrentMonth(date);
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isSunday = date.getDay() === 0;
            return (
              <Grid item xs={12/7} key={date.toString()}>
                <DayCell
                  onClick={() => isCurrentMonthDay && handleDayClick(date)}
                  style={{
                    cursor: isCurrentMonthDay ? 'pointer' : 'default',
                    opacity: isCurrentMonthDay ? 1 : 0.3,
                    background: 'transparent',
                  }}
                >
                  <DayNumber
                    isToday={isToday}
                    isSelected={isSelected || (isToday && !selectedDate)}
                    isSunday={isSunday}
                  >
                    {getDay(date)}
                  </DayNumber>
                </DayCell>
              </Grid>
            );
          })}
        </Grid>
      </CalendarContainer>
      <MealDetailModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        mealData={selectedDate ? getMealForDate(selectedDate) : null}
        selectedDate={selectedDate}
      />
    </>
  );
} 