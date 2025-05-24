import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import styled from '@emotion/styled';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import NutritionInfo from './NutritionInfo';
import funnyList from '../data/middle_school_funny_100';

const StyledDialog = styled(Dialog)`
  .MuiDialog-paper {
    min-width: 400px;
  }
`;

const MealItem = styled(ListItem)`
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const AllergyEmoji = styled.span`
  font-size: 1rem;
  margin-left: 0.5rem;
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Android Emoji', 'EmojiSymbols', sans-serif;
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
  
  // CDATA 태그 제거
  const cleanText = mealText.replace(/<!\[CDATA\[|\]\]>/g, '');
  
  // 메뉴와 알레르기 정보 분리
  return cleanText.split('<br/>').map(item => {
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

const getMealType = (code) => {
  if (code === '1') return '아침';
  if (code === '2') return '점심';
  if (code === '3') return '저녁';
  return '';
};

function getDayOfWeek(date) {
  return format(date, 'E', { locale: ko });
}

function stripHtmlTags(str) {
  return str.replace(/<[^>]*>?/gm, '');
}

export default function MealDetailModal({ open, onClose, mealData, selectedDate }) {
  if (!open || !selectedDate) return null;

  const dateObj = new Date(selectedDate);
  const formattedDate = `${dateObj.getFullYear()}년 ${dateObj.getMonth() + 1}월 ${dateObj.getDate()}일 (${getDayOfWeek(dateObj)})`;
  const hasMeal = mealData && mealData.DDISH_NM;

  // 급식정보 없는 날(토/일/공휴일 등) 처리
  if (!hasMeal) {
    // middle_school_funny_100에서 랜덤 1개
    const randomIdx = Math.floor(Math.random() * funnyList.length);
    const funnyText = funnyList[randomIdx];
    return (
      <StyledDialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          <Typography variant="h6" component="div" align="center">
            {formattedDate}
          </Typography>
        </DialogTitle>
        <DialogContent dividers>
          <Typography variant="h6" align="center" sx={{ border: '1px solid #1976d2', borderRadius: 2, p: 1, mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
            맛있게 먹으면 0 Kcal
          </Typography>
          <Box mt={2}>
            <Typography variant="body1" align="center" color="#7c3aed">
              {funnyText}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary" fullWidth>
            닫기
          </Button>
        </DialogActions>
      </StyledDialog>
    );
  }

  // 기존 급식정보가 있는 날은 기존대로(식사명 문구만 삭제)
  const menuItems = parseMealInfo(mealData.DDISH_NM);
  const calInfo = mealData.CAL_INFO || (mealData.NTR_INFO && mealData.NTR_INFO.match(/([\d.]+)\s*Kcal/)?.[0]);
  let ntrInfo = '';
  if (mealData.NTR_INFO) {
    const clean = stripHtmlTags(mealData.NTR_INFO);
    const carb = clean.match(/탄수화물[^(\d]*([\d.]+)g?/);
    const fat = clean.match(/지방[^(\d]*([\d.]+)g?/);
    const protein = clean.match(/단백질[^(\d]*([\d.]+)g?/);
    ntrInfo = [
      carb ? `탄수화물 : ${carb[1]}g` : null,
      fat ? `지방 : ${fat[1]}g` : null,
      protein ? `단백질 : ${protein[1]}g` : null
    ].filter(Boolean).join(', ');
  }

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div" align="center">
          {formattedDate}
        </Typography>
      </DialogTitle>
      <DialogContent dividers>
        {calInfo && (
          <Typography variant="h6" align="center" sx={{ border: '1px solid #1976d2', borderRadius: 2, p: 1, mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
            {calInfo}
          </Typography>
        )}
        <Box>
          {menuItems.map((item, index) => (
            <Box key={index} sx={{ mb: 1 }}>
              <Typography variant="body1" align="center">
                {item.name}
              </Typography>
              {item.allergies.length > 0 && (
                <Typography variant="body2" align="center" color="textSecondary">
                  ({item.allergies.map((allergy, i) => (
                    <span key={allergy}>
                      {allergy}
                      {allergyEmojiMap[allergy] ? (
                        <AllergyEmoji title={`${allergy}.`}>{allergyEmojiMap[allergy]}</AllergyEmoji>
                      ) : null}
                      {i < item.allergies.length - 1 ? '.' : ''}
                    </span>
                  ))})
                </Typography>
              )}
            </Box>
          ))}
        </Box>
        {ntrInfo && (
          <Box mt={2}>
            <Typography variant="subtitle2" align="center" color="#2e7d32">
              {ntrInfo}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary" fullWidth>
          닫기
        </Button>
      </DialogActions>
    </StyledDialog>
  );
} 