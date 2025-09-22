# 성령과 동행하는 삶 - Holy Spirit Companion App

크리스천 영적 성장 추적 및 관리를 위한 Progressive Web App

## 📖 개요

이 웹 애플리케이션은 성령과의 동행 여정을 체계적으로 관리하고 기록할 수 있도록 도와주는 도구입니다. 4단계 영적 성장 프레임워크를 기반으로 하여 개인의 영적 여정을 추적하고 발전시킬 수 있습니다.

## ✨ 주요 기능

### 🎯 4단계 영적 성장 프레임워크
- **1단계: 인식** - 성령의 존재와 역할을 깨닫는 단계
- **2단계: 순종** - 성령의 음성에 순종하며 변화를 경험하는 단계
- **3단계: 동행** - 성령과 깊은 교제를 나누는 단계
- **4단계: 사역** - 성령의 능력으로 다른 사람들을 섬기는 단계

### 📊 200점 평가 시스템
- **성령과의 관계** (50점): 기도, 교제, 음성 듣기
- **성품과 열매** (50점): 사랑, 기쁨, 평화, 인내 등
- **영적 분별력** (50점): 진리 인식, 거짓 분별, 지혜
- **사역과 영향력** (50점): 섬김, 전도, 멘토링, 리더십

### 📅 일상 실천 도구
- 6가지 핵심 실천 사항의 일일 체크리스트
- 성경 읽기, 기도, 순종 등의 습관 추적
- 진행률 및 통계 표시

### 🆘 위기 관리 시스템
- 영적 침체, 유혹, 갈등 등 상황별 대응 가이드
- 단계별 해결 방법 및 성경적 원리 제시
- 즉시 실행 가능한 구체적 행동 지침

### 📝 묵상 저널
- 구조화된 저널 템플릿
- 일상 묵상, 기도 응답, 도전과 극복, 깨달음과 은혜 등 카테고리별 기록
- 검색 및 필터링 기능

## 🛠️ 기술 스택

- **Frontend**: Vanilla HTML5, CSS3, JavaScript (ES6+)
- **Storage**: LocalStorage API
- **PWA**: Service Worker, Web App Manifest
- **Responsive**: Mobile-first design
- **Icons**: Unicode symbols and CSS styling

## 🚀 설치 및 실행

### 로컬 개발 환경

```bash
# 프로젝트 디렉토리로 이동
cd holy-spirit-companion-app

# 로컬 서버 실행 (Python 3)
python3 -m http.server 8080

# 또는 Node.js 사용시
npx serve -p 8080

# 브라우저에서 접속
open http://localhost:8080
```

### PWA 설치
1. 모바일 브라우저에서 웹사이트 방문
2. "홈 화면에 추가" 옵션 선택
3. 앱 아이콘이 홈 화면에 생성됨
4. 오프라인에서도 기본 기능 사용 가능

## 📱 화면 구성

### 대시보드
- 현재 영적 성장 단계 표시
- 일일 체크리스트 (6개 항목)
- 진행률 및 통계 요약
- 여정 시작 후 경과 일수

### 영적 평가
- 4개 영역 20개 질문
- 1-10점 슬라이더 평가
- 실시간 점수 계산 및 표시
- 단계별 맞춤 추천사항

### 실천 가이드
- **성경 읽기**: 5단계 읽기 방법, 묵상법
- **기도 생활**: ACTS 기도법, 중보기도 가이드
- **순종 실천**: 구체적 순종 영역 및 방법
- **위기 관리**: 상황별 대응 매뉴얼

### 묵상 저널
- 새 저널 작성 (모달 형태)
- 기존 저널 목록 및 미리보기
- 날짜 및 카테고리별 정리
- 검색 및 필터링

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: #2C3E50 (깊은 남색 - 신뢰, 안정감)
- **Secondary**: #E8F4FD (연한 하늘색 - 평화, 순수함)
- **Accent**: #3498DB (밝은 파랑 - 소망, 성령의 역사)
- **Success**: #27AE60 (초록 - 성장, 열매)
- **Warning**: #F39C12 (주황 - 주의, 깨달음)

### 타이포그래피
- **Font Family**: 시스템 폰트 (Apple/Segoe UI/Noto Sans)
- **Scale**: 12px ~ 30px (0.75rem ~ 1.875rem)
- **Weight**: 400 (일반), 500 (중간), 600/700 (강조)

### 간격 시스템
- **Base Unit**: 4px
- **Scale**: 4px, 8px, 16px, 24px, 32px, 48px
- **Layout**: 최대 너비 1200px, 반응형 그리드

## 💾 데이터 저장

### LocalStorage 구조
```javascript
{
  "holy-spirit-companion-data": {
    "currentStage": 1,
    "totalScore": 85,
    "checklistStates": {"item1": true, "item2": false},
    "assessmentScores": {"q1": 7, "q2": 8},
    "lastUpdated": "2025-01-15T10:30:00.000Z"
  },
  "journal-entries": [
    {
      "id": 1642234567890,
      "date": "2025-01-15",
      "title": "오늘의 깨달음",
      "type": "insight",
      "content": "성령님의 인도하심을 경험했습니다...",
      "timestamp": "2025-01-15T10:30:00.000Z"
    }
  ],
  "journey-start-date": "2025-01-01"
}
```

## 🔧 사용자 정의

### 평가 기준 수정
`script.js`의 `calculateTotalScore()` 함수에서 단계 진급 기준 점수 조정 가능:
- 1단계 (인식): 0-79점
- 2단계 (순종): 80-119점
- 3단계 (동행): 120-159점
- 4단계 (사역): 160-200점

### 체크리스트 항목 변경
`index.html`의 체크리스트 섹션에서 항목 추가/수정 가능

### 스타일 커스터마이징
`styles.css`의 `:root` 변수에서 색상, 폰트, 간격 등 조정 가능

## 🌐 배포

### GitHub Pages
1. GitHub 레포지토리 생성
2. 파일 업로드 후 커밋
3. Settings > Pages에서 배포 설정
4. HTTPS URL로 접속 가능

### Netlify
1. 프로젝트 폴더를 Netlify에 드래그 앤 드롭
2. 자동 배포 및 HTTPS 제공
3. 커스텀 도메인 설정 가능

### Vercel
1. Vercel CLI 설치: `npm i -g vercel`
2. 프로젝트 폴더에서 `vercel` 명령 실행
3. 안내에 따라 배포 완료

## 📊 성능 최적화

- **Bundle Size**: 전체 앱 크기 < 500KB
- **Load Time**: 초기 로딩 < 3초 (3G 네트워크)
- **Offline Support**: Service Worker를 통한 오프라인 캐싱
- **Mobile Optimization**: 터치 친화적 인터페이스

## 🔒 보안 및 프라이버시

- 모든 데이터는 사용자 기기의 LocalStorage에 저장
- 외부 서버로 개인정보 전송 없음
- HTTPS 환경에서 사용 권장
- 브라우저 데이터 삭제 시 모든 정보 제거

## 🤝 기여 방법

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 지원

문제가 발생하거나 개선 사항이 있으시면 이슈를 등록해 주세요.

## 📄 라이선스

이 프로젝트는 교회 및 개인 신앙 목적으로 자유롭게 사용 가능합니다.

---

*"성령이 이르시되 내가 나실 때와 나의 정하신 날에 그들에게 일깨워 주리라 하시니라" (요한복음 14:26)*# holy-spirit-companion-app
