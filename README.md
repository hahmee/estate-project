# React Real Estate Project
![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?logo=vite&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-%3E=18.x-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.18-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-Cloud-FF9900?logo=amazon-aws&logoColor=white)

## 프로젝트 개요

중개사와 사용자를 연결하는 매물 등록·검색·채팅·지도 기반 풀스택 SPA 플랫폼

- React + Vite 기반의 SPA 프론트엔드
- Express + Prisma + MongoDB 백엔드 API 서버
- 이미지 업로드, 지도 기반 검색
- 실시간 채팅 및 알림을 위한 Socket.IO 채팅 기능 구현
- Storybook을 활용한 주요 UI 컴포넌트 문서화

--- 

## 프로젝트 소개
Estate Project는 사용자가 쉽고 빠르게 부동산 매물을 등록·검색하고,
실시간 채팅과 지도 기반 탐색 기능을 통해 중개사와 소통할 수 있는 부동산 플랫폼입니다.

---
## 기술 스택
- Frontend: React, Vite, JavaScript, Storybook
- Backend: Node.js, Express, Prisma ORM, MongoDB Atlas, Socket.IO
- Infra & DevOps: AWS EC2, AWS S3, AWS CloudFront, Jenkins CI/CD
---

## 프로젝트 구조

```
    estate-project/
    ├── client/                        # React + Vite 프론트엔드
    │   ├── src/
    │   │   ├── components/            # 재사용 UI 컴포넌트
    │   │   ├── context/               # 전역 상태 관리 (React Context)
    │   │   ├── lib/                   # 유틸 함수, API 호출 등
    │   │   ├── routes/                # 라우팅 관련 컴포넌트
    │   │   ├── UI/                    # 공통 UI (디자인 시스템 성격)
    │   │   ├── util/                  # 헬퍼 함수 모음
    │   │   ├── App.jsx                # 앱 루트 컴포넌트
    │   │   ├── index.scss             # 전역 스타일
    │   │   ├── main.jsx               # React 진입점
    │   │   └── main.scss              # 메인 스타일
    │   └── package.json     
    │
    ├── api/                           # Express 백엔드
    │   ├── controllers/               # 요청 처리 로직 (Controller)
    │   ├── lib/                       # DB, 외부 API 등 공용 모듈
    │   ├── middleware/                # 인증, 에러핸들러, 로깅 미들웨어
    │   ├── prisma/                    # Prisma 스키마 및 마이그레이션
    │   ├── routes/                    # Express 라우트 정의
    │   ├── test/                      
    │   └── package.json
    │
    ├── Jenkinsfile                    # CI/CD 파이프라인 정의
    ├── README.md
    └── ...



```


---


## 설치 및 실행 순서

#### 1. 클론 
```bash
git clone https://github.com/hahmee/estate-project.git
cd estate-project

```
#### 2. 환경 변수 설정
.env 파일을 생성하고 필요한 값을 채워주세요.

#### 3. 프론트엔드 실행
```bash
cd client
npm install
npm run dev
```
#### 4. 백엔드 실행

```bash
cd ../api
npm install
npm run dev
```

