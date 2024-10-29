# Slave
Slack 서비스를 클론 코딩 코딩

## 팀 목표 (달성률 80%)
개인의 성장을 최대한으로 한다.

## 개인 목표

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
- 각 유저의 워크스페이스 접근권한과 대화방 접근 권한을 DB에 어떻게 보관하는 것이 가독성/성능 측면에서 좋을지 고민하고 테이블을 설계
- 유저 ID와 그 유저가 접근 가능한 워크스페이스 ID를 연결한 테이블, 그리고 유저와 그 유저가 접근 가능한 대화방ID을 연결한 테이블을 생성하여 검색에 있어 좀 더 직관성을 추구하였음
- 워크스페이스 생성하기 관련, userId에 대해 로컬스토리지에 undefined로 저장되어 워크스페이스가 생성되지 않는 오류가 발생함 -> 서버에서 보내는 데이터와, 클라이언트쪽에서 받으려는 데이터 형식이 차이 있어 문제가 되었음. 데이터 형식을 맞춰서 수정함
- 유저별 워크스페이스 리스트 조회가 안되는 부분 -> @Query 관련해서, 조인 문법을 틀려서(ON을 안써준것이 원인) 데이터베이스에서 워크스페이스 리스트가 불러와지지 않았던 것. 쿼리문을 수정하여 해결함
   
### 최승혁

<img src="https://github.com/user-attachments/assets/a410ab0c-aa63-4a60-860b-953c939b00aa">

<img src="https://github.com/user-attachments/assets/11f695eb-dc66-465a-a56e-54f23afb07c9">




# 기능 명세서
|API 종류|Method|Endpoint(요청 URL)|Description|
|------|------|------|------|
|Users|POST|/users/sending-code|유저 이메일로 코드 전송|
||POST|/users/verification|유저 이메일 로그인|
||PUT|/users/logout|유저 로그아웃 기능|
|Workspaces|GET|/workspaces/{userId}|소속 워크스페이스 조회|
||POST|/workspaces/create|워크스페이스 생성|
||PUT|/workspaces/{workspaceId}|워크스페이스 수정|
||DELETE|/workspaces/{workspaceId}|워크스페이스 삭제|
|Conversations|GET|/conversations/{workspaceId}|워크스페이스 내 대화방 조회|
||POST|/conversations/new-workspace|대화방(채널/다이렉트 메세지) 생성|
||PUT|/conversations/{conversationId}|대화방(채널/다이렉트 메세지) 수정|
||DELETE|/conversations/{conversationId}|대화방(채널/다이렉트 메세지) 삭제|
|Canvas|Post|/canvas|헤더에 워크스페이스 아이디 및 채널 아이디, 캔버스 번호를 발송 생성 및 업데이트 동일|
||GET|/canvas/workspaceid/channelid/canvasid|전체 캔버스 조회|
||GET|/canvas/workspaceid/channelid/canvasid|워크스페이스 까지만 입력시 워크 스페이스내 캔버스들 조회채널까지 입력시 채널 내 캔버스들 조회|
||DELETE|/canvas?workspaceId={workspaceid}, channel={channelid}|캔버스를 삭제|
|Canvas-Cursor|POST, PUT|/canvas/cursor|헤더에 워크스페이스 아이디 및 채널 아이디,유저 이름 ,캔버스 번호를 발송 현재 커서 위치를 저장 및 갱신|
||GET|/canvas/cursor/{canvasid}/|현재 캔버스내 유저 정보|
||DELETE||1분 갱신없으면 자동 삭제|
|Chat|GET|/workspaces/{:workspaceid}/conversations/{:channelId}|워크스페이스의 채널 채팅 조회|
||POST|/workspaces/{:workspaceid}/conversations/{:channelId}|워크스페이스의 채널 채팅 보내기|
||PUT|/workspaces/{:workspaceid}/conversations/{:channelId}|워크스페이스의 채널 채팅 수정|
||DELETE|/workspaces/{:workspaceid}/conversations/{:channelId}|워크스페이스의 채널 채팅 삭제|
||GET|/workspaces/{:workspaceid}/conversations/{:directmessageid}|워크스페이스의 다이렉트 메시지 방 조회|
||POST|/worlspaces{:workspaceid}//conversations/{:directmessageId}|워크스페이스의 다이렉트 메시지 방 채팅 보내기|
||PUT|/worlspaces{:workspaceid}//conversations/{:directmessageId}|워크스페이스의 다이렉트 메시지 방 채팅 수정|
||DELETE|/worlspaces{:workspaceid}//conversations/{:directmessageId}|워크스페이스의 다이렉트 메시지 방 채팅 삭제|
|Bot|POST|/workspaces/{workspaceid}/conversations/{conversationsid}/bot|워크스페이스 id와 채널 id를 통해 Bot을 생성 body 보내는 데이터를 기준으로 구분|
||GET|/workspaces/{workspaceid}/conversations/{conversationsid}/bot|존재하는 봇 조회|
||PUT|/workspaces/{workspaceid}/conversations/{conversationsid}/bot|봇의 설정(1,2,3) 업데이트|
||DELETE|/workspaces/{workspaceid}/conversations/{conversationsid}/bot|봇 삭제|

