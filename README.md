# 🛍️ 리셀 가격 관리 시스템

**대형마트(코스트코, 트레이더스) 리셀 상품의 가격을 효율적으로 관리하는 앱**

## 📋 기능

- 📱 바코드 스캔 (웹캠/휴대폰 카메라)
- 🔍 엑셀 데이터베이스에서 자동 검색
- 💰 가격 실시간 수정
- 📊 수정 이력 관리
- 💾 엑셀 파일 자동 업데이트

## 📊 엑셀 데이터 구조

```
no | 매대번호 | 이미지폴더이름 | 제품번호(바코드) | 카테고리 | 브랜드 | 코스트코 제품명 | 원산지 | 판매가격
```

## 🛠️ 기술 스택

- **Frontend**: React.js (웹) / React Native (모바일)
- **Barcode Scanning**: Quagga.js (웹) / react-native-camera (모바일)
- **Excel**: xlsx / ExcelJS
- **Backend**: Node.js + Express
- **Database**: SQLite / Firebase

## 🚀 설치 및 실행

```bash
# 1. 저장소 클론
git clone https://github.com/202410825/sell.git
cd sell

# 2. 웹앱 설치
cd web
npm install
npm start

# 3. 모바일앱 설치 (선택)
cd ../mobile
npm install
npx react-native run-android  # Android
# 또는
npx react-native run-ios       # iOS
```

## 📂 프로젝트 구조

```
sell/
├── web/                    # 웹앱 (React)
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── BarcodeScanner.jsx
│   │   │   ├── ProductInfo.jsx
│   │   │   └── PriceEditor.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── utils/
│   │   │   ├── excelHandler.js
│   │   │   └── barcodeParser.js
│   │   ├── App.jsx
│   │   └── index.jsx
│   ├── package.json
│   └── vite.config.js
│
├── mobile/                 # 모바일앱 (React Native)
│   ├── src/
│   ├── App.tsx
│   └── package.json
│
├── backend/                # 백엔드 (Node.js)
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── models/
│   ├── package.json
│   └── server.js
│
├── data/                   # 샘플 데이터
│   └── products.xlsx
│
└── README.md
```

## 📝 사용 방법

1. **엑셀 파일 업로드** → 상품 데이터 로드
2. **바코드 스캔** → EAN-13 형식의 제품번호 인식
3. **자동 검색** → 해당 상품 정보 표시 (제품명, 현재가격 등)
4. **가격 수정** → 새 판매가격 입력
5. **저장** → 엑셀 파일 자동 업데이트

## 💡 향후 기능

- [ ] 클라우드 동기화 (Google Drive)
- [ ] 가격 변동 통계 및 분석
- [ ] 여러 계정/지점 관리
- [ ] 자동 할인율 계산
- [ ] 재고 관리 기능
- [ ] 일괄 가격 수정

## ⚙️ 시스템 요구사항

- Node.js 16.0 이상
- npm 또는 yarn
- 모던 브라우저 (Chrome, Firefox, Safari)
- Android 10.0 이상 / iOS 14.0 이상

## 🔐 보안

- 로컬 엑셀 파일 암호화
- 가격 변경 이력 기록
- 사용자 권한 관리

## 📞 지원

문제가 생기면 Issues에 등록해주세요!

---

**프로젝트 목표**: 엄마의 업무 효율화! 🎯  
**현재 상태**: 🚧 개발 중
