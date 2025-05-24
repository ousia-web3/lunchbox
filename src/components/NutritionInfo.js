import React from 'react';
import { Paper, Typography, Box, Grid } from '@mui/material';
import styled from '@emotion/styled';

const NutritionContainer = styled(Paper)`
  padding: 1rem;
  margin-top: 1rem;
  background-color: #e8f5e9;
`;

const NutritionItem = styled(Box)`
  text-align: center;
  padding: 0.5rem;
`;

const NutritionValue = styled(Typography)`
  font-weight: bold;
  color: #2e7d32;
`;

const nutritionLabels = {
  CAL_INFO: '칼로리',
  NTR_INFO: '영양정보',
  NTR_PTN: '단백질',
  NTR_FAT: '지방',
  NTR_NA: '나트륨',
  NTR_CAR: '탄수화물',
};

export default function NutritionInfo({ mealData }) {
  if (!mealData) return null;

  const nutritionData = {
    CAL_INFO: mealData.CAL_INFO || '-',
    NTR_INFO: mealData.NTR_INFO || '-',
    NTR_PTN: mealData.NTR_PTN || '-',
    NTR_FAT: mealData.NTR_FAT || '-',
    NTR_NA: mealData.NTR_NA || '-',
    NTR_CAR: mealData.NTR_CAR || '-',
  };

  return (
    <NutritionContainer elevation={1}>
      <Typography variant="subtitle1" gutterBottom>
        영양 정보
      </Typography>
      <Grid container spacing={2}>
        {Object.entries(nutritionData).map(([key, value]) => (
          <Grid item xs={6} sm={4} key={key}>
            <NutritionItem>
              <Typography variant="body2" color="textSecondary">
                {nutritionLabels[key]}
              </Typography>
              <NutritionValue variant="body1">
                {value}
              </NutritionValue>
            </NutritionItem>
          </Grid>
        ))}
      </Grid>
    </NutritionContainer>
  );
} 