# 🖥 BPS_Frontend Sever
<br/>

### ⚙ Project Settings

```
$ node --version
v20.11.0

$ npm --version
v10.5.0

$ docker --version
v24.0.5

$ nginx --v
nginx/1.18.0
```

___
### 🛠 Project Setup

```sh
$ npm install -g npm@10.5.0
$ npm install vite
$ npm install axios
$ npm install -D sass
$ npm install js-cookie
$ npm install chart.js
$ npm install @fortawesome/fontawesome-free
$ npm install xlsx file-saver
$ npm install lodash-es
$ npm install autonumeric
```

___
### 💡 Compile and Hot-Reload for Development

```sh
npm run dev
```

___
### 📀 Deploy URL
- https://bpssystem.store

___
### 🚩 Github Action Deploy to EC2 with docker container
<br/>

![image](https://github.com/Team5-be01-Final-Project/Frontend/assets/149128094/f7fe7fce-9df0-44fe-a317-844d61d97a6f)



___
### 🎨 FrontEnd View
<br/>

### [화면 설계서](화면설계서 링크!!!!)

<br/>

<details>
<summary> ⭐ <b>로그인</b> </summary>
<div markdown="1">

### 로그인 / 로그아웃
<br/>

- DB에 저장되어있는 사번과 비밀번호로 로그인한다.
- 퇴사자는 로그인할 수 없다.
<br/>

- 로그인에 성공한 사람만 로그아웃을 할 수 있다.

</div>
</details>
<br/>

<details>
<summary> ⭐ <b>대시 보드</b> </summary>
<div markdown="1">

### 온도 조회
<br/>

- 창고의 온도를 대시보드에서 확인할 수 있다.
- 각 차량 별로 온도를 그래프를 통해 대시보드에서 확인할 수 있다.

<br/>

### 월별 매출 조회
<br/>

- 월별로 총매출 합계와 순이익을 조회할 수 있다.

</div>
</details>
<br/>

<details>
<summary> ⭐ <b>사원 관리</b>  </summary>
<div markdown="1">

### 사원 조회
<br/>

- 대표와 팀장은 전직원 조회가 가능하지만 팀원은 조회할 수 없다.
<br/>

- 대표 권한자만 권한을 수정할 수 있다.
<br/>

- 대표 권한자만 알림 수신 여부를 수정할 수 있다.


</div>
</details>
<br/>

<details>
<summary> ⭐ <b>이상 온도</b>  </summary>
<div markdown="1">

### 이상 온도 알림
- 온도가 특정 범위(냉장(2∼8℃))를 벗어나면 관리자(알림대상자) 이메일로 알림을 전송한다.
- 관리자(알림대상자)는 알림 로그 목록을 조회할 수 있다.

</div>
</details>
<br/>

<details>
<summary> ⭐ <b>제품 관리</b>  </summary>
<div markdown="1">

### 제품 조회
- 제품 목록 조회 시 대표, 팀장의 경우 모두 조회할 수 있지만 사원은 단가를 조회할 수 없다.
<br/>

- 특정 거래처에 대한 제품을 검색하여 조회할 수 있다.
<br/>

### 제품 등록, 수정, 삭제
- 거래처별 판매 목록에 등록은 대표와 팀장만 가능하다.
<br/>

- 거래처에 중복된 조건의 제품은 등록이 불가능하다.
<br/>

- 대표와 팀장은 수정, 삭제가 가능하지만 사원은 불가능하다.

</div>
</details>
<br/>

<details>
<summary> ⭐ <b>재고 관리</b>  </summary>
<div markdown="1">

### 재고 조회
- 재고 조회는 현재 남아있는 재고를 조회하며 전 직원이 조회할 수 있다.
<br/>

- 재고를 등록하기 위해서 특정 제품을 검색할 수 있다.
<br/>

- 재고 등록은 대표와 팀장만 가능하다. 

</div>
</details>
<br/>

<details>
<summary> ⭐ <b>전표 관리</b>  </summary>
<div markdown="1">

### 전표 조회
- 전표의 상태는 승인대기, 승인완료, 반려가 있다.
- 모든 전표 목록은 전 직원이 조회할 수 있다.
<br/>

- 해당 전표 조회는 전표를 생성한 팀만 조회가 가능하다.
<br/>

### 전표 등록
- 전표 등록은 사원만 가능하다.
- 일자별로 출고 전표를 등록 할 수 있다.
<br/>

- 전표를 등록하면 승인 대기 상태가 된다.
<br/>

- 등록된 전표의 목록들은 전 사원이 조회가 가능하다.
<br/>

- 전표 등록 시 재고는 차감이 된다.
<br/>

### 전표 승인 및 반려
- 대표, 팀장만 전표 승인 및 반려 권한이 있으며 대기 상태의 출고전표를 승인 및 반려 할 수 있다.
- 반려 시 전표 등록에 차감되었던 물품 수량은 재고로 재등록 된다.
<br/>

</div>
</details>
<br/>

<details>
<summary> ⭐ <b>판매 관리</b>  </summary>
<div markdown="1">

### 매출 
- 제품별로 판매 현황을 테이블로 조회할 수 있다.
- 사원은 제품명, 판매가, 수량, 매출액 만 확인할 수 있다.
<br/>

- 거래처별로 판매 현황을 테이블로 조회할 수 있다.
- 사원은 제품명, 판매가, 수량, 매출액 만 확인할 수 있다.

</div>
</details>
<br/>

<details>
<summary> ⭐ <b>거래처 관리</b>  </summary>
<div markdown="1">

### 거래처 조회
- 매출 거래처 목록을 조회 할 수 있다.
<br/>

### 거래처 등록 및 수정
- 대표, 팀장만 매출 거래처 등록, 수정과 삭제 권한이 있으며 사원은 등록, 수정 삭제 기능을 이용할 수 없다.
<br/>

</div>
</details>
<br/>

<details>
<summary> ⭐ <b>인센티브 관리</b>  </summary>
<div markdown="1">

### 인센티브 현황
- 대표는 전 직원에 대한 인센티브 조회가 가능하다.
- 팀장인 본인 팀원에 대한 인센티브 조회가 가능하다.
- 사원은 이 메뉴를 이용할 수 없다.
<br/>

</div>
</details>
<br/>

<details>
<summary> ⭐ <b>My 영업</b>  </summary>
<div markdown="1">

### 내 정보 조회
- 사원은 자신의 정보를 조회할 수 있다.
<br/>

### 내 거래처 조회
- 사원은 자신의 담당 병원에 대한 이름, 담당자, 담당자 전화번호를 조회할 수 있다.
<br/>

### 내 매출 현황
- 사원은 자신의 최근 3개월 거래처 당 매출현황을 볼 수 있다.
<br/>

### 내 인센티브
- 사원은 자신의 현재매출 대비 인센티브를 확인할 수 있다.
<br/>

- 추가 매출을 기입하여 예상 인센티브를 확인할 수 있다.
- 시뮬레이션 기능이기 때문에 데이터를 변환하지 않는다.

</div>
</details>
<br/>

___
### 🧾 릴리즈 내역
<br>

- [Release v6.0.0](https://github.com/Team5-be01-Final-Project/Frontend2/releases/tag/v6.0.0)
  - 버그 수정 및 기타 디자인 수정
    
<details>
<summary>  릴리즈 모음  </summary>
<div markdown="1">
  
- [Release v5.0.0](https://github.com/Team5-be01-Final-Project/Frontend2/releases/tag/v5.0.0)
  - 디자인 및 기타 오류 수정
- [Release v4.0.0](https://github.com/Team5-be01-Final-Project/Frontend2/releases/tag/v4.0.0)
  - 권한 관리 추가.
- [Release v3.0.0](https://github.com/Team5-be01-Final-Project/Frontend2/releases/tag/v3.0.0)
  - 대시보드, My영업 및 매출 관리 기능 추가.
- [Release v2.0.0](https://github.com/Team5-be01-Final-Project/Frontend2/releases/tag/v2.0.0)
  - Docker, Nginx 사용, npm run build로 수정 및 쿠키 들어오는거 확인
- [Release v1.0.0](https://github.com/Team5-be01-Final-Project/Frontend2/releases/tag/v1.0.0)
  - Github Flow를 통해 EC2로 CI/CD 구축. (Docker 및 nginx는 사용하지 않고, npm run dev로 실행 확인)

 </div>
</details>

