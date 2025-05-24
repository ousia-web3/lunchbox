import axios from 'axios';
import { format } from 'date-fns';

const BASE_URL = 'https://open.neis.go.kr/hub/mealServiceDietInfo';
const SCHOOL_CODE = '7602133';
const OFFICE_CODE = 'J10';
const API_KEY = '3952aeeb3ecf447c866ed6f0218aaddf';

export const fetchMealInfo = async (date) => {
  try {
    const formattedDate = format(date, 'yyyyMM');
    const response = await axios.get(BASE_URL, {
      params: {
        KEY: API_KEY,
        Type: 'json',
        pIndex: 1,
        pSize: 100,
        ATPT_OFCDC_SC_CODE: OFFICE_CODE,
        SD_SCHUL_CODE: SCHOOL_CODE,
        MLSV_YMD: formattedDate,
      },
    });

    // JSON 응답 구조 확인
    if (response.data && response.data.mealServiceDietInfo && response.data.mealServiceDietInfo[1]?.row) {
      let rows = response.data.mealServiceDietInfo[1].row;
      if (!Array.isArray(rows)) {
        rows = rows ? [rows] : [];
      }
      return {
        mealServiceDietInfo: [
          { head: response.data.mealServiceDietInfo[0].head },
          { row: rows }
        ]
      };
    }

    // 급식 정보가 없는 경우
    return {
      mealServiceDietInfo: [
        { head: [{ list_total_count: 0 }] },
        { row: [] }
      ]
    };
  } catch (error) {
    return {
      mealServiceDietInfo: [
        { head: [{ list_total_count: 0 }] },
        { row: [] }
      ]
    };
  }
}; 