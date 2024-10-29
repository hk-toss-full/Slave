# Slave
Slack 서비스를 클론 코딩 코딩

## 팀 목표 (달성률 80%)
개인의 성장을 최대한으로 한다.


### 조경준 (달성률 90%)

- 마크다운 편집기능 구현
- 다중 사용자 편집에서 CRDT로 충돌 해결
- 서버 통신을 통한 실시간 편집 기능
- 텍스트 마커 표현 성공
- 레디스를 이용한 빠른 db 반응속도
- 웹소켓이 아닌 다른 통신 방식으로 구현(SSE, HTTP)

아쉬운점

- 데이터 영속성 미구현 (구현시 MongoDB로 구현예정)
- 웹소켓이 아니여서 완전 실시간이 아님(딜레이가 있음)

### 이승진 (달성률 80%)

- NestJs를 이용한 서버 구축
- NestJs를 이용한 WebSocket 구현
- WebSocket을 이용한 실시간 채팅 기능

### 조예은 (달성률 70%)

- 이메일을 이용한 로그인/회원가입 인증 기능
- 워크스페이스 생성 CRUD 기능
- 대화방(채널/다이렉트 메세지)생성 CRUD 기능

달성률(api 호출해보면서 집계중)약 70%가량. 대화방 부분 확인 및 수정 중트러블 슈팅(성능 개선, 고찰)

- 각 유저의 워크스페이스 접근권한과 대화방 접근 권한을 DB에 어떻게 보관하는 것이 가독성/성능 측면에서 좋을지 고민하고 테이블을 설계
- 유저 ID와 그 유저가 접근 가능한 워크스페이스 ID를 연결한 테이블, 그리고 유저와 그 유저가 접근 가능한 대화방ID을 연결한 테이블을 생성하여 검색에 있어 좀 더 직관성을 추구하였음

### 최승혁

- 워크스페이스 내의 채널에서 작동하는 봇 기능
- 봇은 지정한 시간마다 반복 메시지 또는 지정한 시간에 알람 메시지를 남기는 기능
- 필터링 할 단어를 지정하고 그 단어가 포함될 시 경고 메시지 전송

---

## 트러블 슈팅

### 조경준

- 편집 내용을 서버에서 받아 올 때 커서 위치 초기화
    - 커서위치를 관리하는 라이브러리 사용(YJS)
- 다중사용자 편집시 텍스트 편집사항 충돌
    - CRDT를 통한 충돌없는 병합
- 풀링 방식의 미세한 딜레이와 잦은 요청
    - SSE 방식으로 변경하여 이벤트 발생시만 수신으로 요청 및 딜레이 감소
- 한 문서에 많은 기능을 구현하여 코드 가독성 감소
    - 리팩터링 및 컴포넌트화를 통한 가독성 향상

### 이승진

- @Module 중복 사용으로 인한 인스턴스 중복
- React - JavaScript의 타입 자율성으로 인한 오류
- Dynamic Module 로 인한 Module의 동적 모듈 바인딩

### 조예은

 - 편집 내용을 서버에서 받아 올 때 커서 위치 초기화
    - 커서위치를 관리하는 라이브러리 사용(YJS)
 - 다중사용자 편집시 텍스트 편집사항 충돌
    - CRDT를 통한 충돌없는 병합
 - 풀링 방식의 미세한 딜레이와 잦은 요청
    - SSE 방식으로 변경하여 이벤트 발생시만 수신으로 요청 및 딜레이 감소
 - 한 문서에 많은 기능을 구현하여 코드 가독성 감소
    - 리팩터링 및 컴포넌트화를 통한 가독성 향상
   
### 최승혁
 -
 -
 -

<img src="https://github.com/user-attachments/assets/a410ab0c-aa63-4a60-860b-953c939b00aa">

<img src="https://github.com/user-attachments/assets/11f695eb-dc66-465a-a56e-54f23afb07c9">
