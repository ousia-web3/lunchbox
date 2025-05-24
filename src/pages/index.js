import React, { useEffect, useState, useCallback } from 'react';
import { Container, Typography, Box, CircularProgress, IconButton, Snackbar } from '@mui/material';
import styled from '@emotion/styled';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { format, addMonths, subMonths } from 'date-fns';
import MealCalendar from '../components/MealCalendar';
import AllergyInfo from '../components/AllergyInfo';
import { fetchMealInfo } from '../utils/api';
import { shouldUpdateMealData, getNextMonthDate } from '../utils/autoUpdate';

const StyledContainer = styled(Container)`
  padding: 2rem 0;
`;

const Title = styled(Typography)`
  text-align: center;
  margin-bottom: 2rem;
  color: #1976d2;
`;

const LoadingContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
`;

const MonthSelector = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mealData, setMealData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateNotification, setUpdateNotification] = useState(false);

  const loadMealData = useCallback(async (date) => {
    setLoading(true);
    try {
      const data = await fetchMealInfo(date);
      setMealData(data);
      setError(null);

      // 자동 업데이트 체크
      if (shouldUpdateMealData()) {
        const nextMonthDate = getNextMonthDate(date);
        const nextMonthData = await fetchMealInfo(nextMonthDate);
        setMealData(prev => ({
          ...prev,
          mealServiceDietInfo: [
            ...prev.mealServiceDietInfo,
            ...nextMonthData.mealServiceDietInfo
          ]
        }));
        setUpdateNotification(true);
      }
    } catch (err) {
      setError('급식 정보를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMealData(currentDate);
  }, [currentDate, loadMealData]);

  const handlePrevMonth = () => {
    setCurrentDate(prev => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const handleCloseNotification = () => {
    setUpdateNotification(false);
  };

  return (
    <StyledContainer maxWidth="lg">
      <Typography variant="h4" component="h1" align="center" sx={{ fontWeight: 700, fontFamily: 'inherit', fontSize: '1.6em', mb: 2 }}>
        🏫 오늘 급식 뭐야 🍱
      </Typography>
      <MonthSelector>
        <IconButton onClick={handlePrevMonth}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6" sx={{ mx: 2 }}>
          {format(currentDate, 'yyyy년 M월')}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ChevronRight />
        </IconButton>
      </MonthSelector>
      <Box>
        {loading ? (
          <LoadingContainer>
            <CircularProgress />
          </LoadingContainer>
        ) : error ? (
          <Typography color="error" align="center">
            {error}
          </Typography>
        ) : (
          <>
            <MealCalendar mealData={mealData} currentDate={currentDate} />
            <Box mt={2}>
              <AllergyInfo mealData={mealData} />
            </Box>
          </>
        )}
      </Box>
      <Snackbar
        open={updateNotification}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        message="다음 달 급식 정보가 자동으로 업데이트되었습니다."
      />
    </StyledContainer>
  );
} 