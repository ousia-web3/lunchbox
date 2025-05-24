# 🏫 오늘 급식 뭐야 🍱

학교 급식 정보 시스템 (중학교/초등학교)

## 소개
- 전국 학교의 급식 정보를 월별/일별로 캘린더 UI로 확인할 수 있는 웹 서비스입니다.
- 모바일/PC 모두 최적화된 반응형 UI 제공
- 알레르기 정보, 영양 정보, 급식 상세 정보, 유머 등 다양한 부가 기능 포함

## 주요 기능
- 월별/일별 급식 정보 캘린더
- 급식 상세 레이어 팝업(칼로리, 메뉴, 알레르기, 영양정보)
- 급식 없는 날엔 중학생 유머 랜덤 제공
- 알레르기 정보 이모지/설명 안내
- 모바일/PC 반응형, 미니멀/현대적 디자인

## 설치 및 실행
```bash
# 1. 저장소 클론
$ git clone <저장소 주소>
$ cd lunchbox

# 2. 패키지 설치
$ npm install

# 3. 환경 변수 설정 (NEIS Open API KEY)
# .env.local 파일 생성 후 아래 내용 추가
NEXT_PUBLIC_NEIS_API_KEY=발급받은_인증키

# 4. 개발 서버 실행
$ npm run dev

# 5. 브라우저에서 접속
http://localhost:3000
```

## 환경 변수
- `.env.local` 파일에 아래와 같이 입력
```
NEXT_PUBLIC_NEIS_API_KEY=발급받은_인증키
```

## 기술 스택
- React (Next.js)
- Material UI (MUI)
- Emotion (styled-components)
- Axios
- date-fns

## 폴더 구조
```
├── src/
│   ├── components/         # UI 컴포넌트
│   ├── pages/              # Next.js 페이지
│   ├── utils/              # API, 날짜 등 유틸
│   └── data/               # 유머 등 데이터
├── public/                 # 정적 파일
├── package.json
├── README.md
└── ...
```

## 기여 방법
1. 이슈/버그/기능 제안은 Issue로 등록
2. PR은 main 브랜치 기준으로 요청

## 라이선스
MIT 