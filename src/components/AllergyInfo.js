import React, { useState } from 'react';
import { Paper, Typography, Box, Chip, Collapse, IconButton, useMediaQuery } from '@mui/material';
import styled from '@emotion/styled';
import InfoIcon from '@mui/icons-material/Info';
import CloseIcon from '@mui/icons-material/Close';

const AllergyContainer = styled(Paper)`
  padding: 1rem;
  margin-top: 1rem;
  background-color: #fff3e0;
`;

const AllergyChip = styled(Chip)`
  margin: 0.25rem;
  background-color: #ff9800;
  color: white;
`;

const InfoButton = styled(IconButton)`
  margin-left: 0.5rem;
  color: #ff9800;
`;

const InfoBox = styled(Box)`
  margin-top: 1rem;
  padding: 1rem;
  background-color: #fff8e1;
  border-radius: 4px;
`;

const AllergyEmoji = styled.span`
  font-size: 1rem;
  margin-left: 0.5rem;
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Android Emoji', 'EmojiSymbols', sans-serif;
`;

const allergyMap = {
  '1': { name: '난류', emoji: '🥚' },
  '2': { name: '우유', emoji: '🥛' },
  '3': { name: '메밀', emoji: '🌾' },
  '4': { name: '땅콩', emoji: '🥜' },
  '5': { name: '대두', emoji: '🌱' },
  '6': { name: '밀', emoji: '🌾' },
  '7': { name: '고등어', emoji: '🐟' },
  '8': { name: '게', emoji: '🦀' },
  '9': { name: '새우', emoji: '🦐' },
  '10': { name: '돼지고기', emoji: '🐷' },
  '11': { name: '복숭아', emoji: '🍑' },
  '12': { name: '토마토', emoji: '🍅' },
  '13': { name: '아황산류', emoji: '🧪' },
  '14': { name: '호두', emoji: '🌰' },
  '15': { name: '닭고기', emoji: '🐔' },
  '16': { name: '쇠고기', emoji: '🐄' },
  '17': { name: '오징어', emoji: '🦑' },
  '18': { name: '조개류(굴, 전복, 홍합 포함)', emoji: '🦪' },
  '19': { name: '잣', emoji: '🌰' }
};

const allergyDescription = Object.entries(allergyMap)
  .map(([key, { name, emoji }]) => `${key}. ${name} ${emoji}`)
  .join('\n');

export default function AllergyInfo({ mealData }) {
  const [showInfo, setShowInfo] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  if (!mealData?.mealServiceDietInfo?.[1]?.row) return null;

  const allergies = new Set();
  mealData.mealServiceDietInfo[1].row.forEach(meal => {
    if (meal.DDISH_NM) {
      const matches = meal.DDISH_NM.match(/\(([\d.,\s]+)\)/g);
      if (matches) {
        matches.forEach(match => {
          const numbers = match.replace(/[()]/g, '').split(/[.,\s]+/).filter(Boolean);
          numbers.forEach(num => allergies.add(num));
        });
      }
    }
  });

  const sortedAllergies = Array.from(allergies).sort((a, b) => Number(a) - Number(b));

  return (
    <AllergyContainer elevation={1} style={{ maxWidth: isMobile ? '100%' : 400, margin: isMobile ? '0 auto' : '2rem auto' }}>
      <Box display="flex" alignItems="center">
        <Typography variant="subtitle1" gutterBottom>
          알레르기 정보
        </Typography>
        <InfoButton onClick={() => setShowInfo(!showInfo)}>
          <InfoIcon />
        </InfoButton>
      </Box>
      <Collapse in={showInfo}>
        <InfoBox>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Typography variant="subtitle2" color="textSecondary" align="center" sx={{ fontWeight: 'bold', mb: 1 }}>
              알레르기 유발 식재료 번호
            </Typography>
            <Box display="flex" flexDirection="column" alignItems="flex-start" sx={{ width: '100%' }}>
              {Object.entries(allergyMap).sort((a, b) => Number(a[0]) - Number(b[0])).map(([key, { name, emoji }]) => (
                <Typography key={key} variant="body2" sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontWeight: 'bold', marginRight: 4 }}>{key}.</span>
                  <span style={{ fontSize: '1.2em', marginRight: 4 }}>{emoji}</span>
                  {name}
                </Typography>
              ))}
            </Box>
          </Box>
        </InfoBox>
      </Collapse>
    </AllergyContainer>
  );
} 