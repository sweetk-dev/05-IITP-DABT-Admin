# 🚀 IITP DABT Admin 단일 서버(Build+Deploy+Run) 가이드

본 문서는 하나의 서버에서 빌드 서버와 실행(배포) 서버 역할을 동시에 수행하는 환경을 대상으로, 처음부터 끝까지 문제 없이 Backend/Frontend가 기동되도록 상세 스텝을 정리합니다.

전제 조건(요약):
- 동일 서버에서 빌드와 배포 수행 (1대 서버)
- 빌드: `iitp-adm` 계정으로 실행
- 배포: `iitp-adm` 계정으로 실행하되, 필요 명령은 `sudo` 사용
- Nginx: `/etc/nginx/conf.d/iitp-dabt-admin.conf`에서 문서(`/docs`)와 Admin 서비스(`/adm`, `/adm/api`)를 함께 제공
- 배포 후 BE/FE 모두 정상 기동 검증, start/restart/stop 명령 포함

---

## 0. 서버 기본 세팅

아래는 Ubuntu 20.04+ 기준 예시입니다. 다른 배포판은 패키지 명칭만 차이 있을 수 있습니다.

### 0.0 기본 패키지 설치
```bash
sudo apt update && sudo apt upgrade -y

# 필수 패키지
sudo apt install -y git curl unzip jq build-essential nginx

# PostgreSQL (필요 시)
sudo apt install -y postgresql postgresql-contrib
```

### Node.js 22.x 설치 (아래 중 하나 선택)

**방법 1: nvm 사용 (권장 - 버전 관리 용이)**
```bash
# nvm 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc  # 또는 source ~/.zshrc

# Node.js 22 설치 및 기본 버전 설정
nvm install 22
nvm use 22
nvm alias default 22
```
- **장점**: 여러 Node.js 버전 관리 가능, 사용자별 설치 (sudo 불필요)
- **단점**: 쉘 재시작 필요, PM2 PATH 설정 주의 필요

**방법 2: snap 사용 (가장 간단)**
```bash
sudo snap install node --classic --channel=22
```
- **장점**: 한 줄로 설치 완료, 자동 업데이트
- **단점**: Ubuntu/일부 배포판만 지원, snap 환경 필요

**방법 3: NodeSource 사용 (전통적 방식, 안정적)**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```
- **장점**: 시스템 전역 설치, 가장 안정적, 모든 사용자가 사용
- **단점**: 버전 변경 시 재설치 필요

**설치 확인:**
```bash
node -v   # v22.x.x 출력 확인
npm -v    # 10.x 이상 확인
which node
```

**PM2 글로벌 설치:**
```bash
# nvm 또는 NodeSource 사용 시
sudo npm install -g pm2

# snap 사용 시
sudo npm install -g pm2

# 확인
pm2 -v
```

> **PM2 사용 시 주의**: nvm으로 설치한 경우 PM2 startup 설정 시 PATH를 명시해야 합니다.
> ```bash
> # nvm 사용 시
> sudo env PATH=$PATH pm2 startup systemd -u <user> --hp /home/<user>
> ```

**문제 해결:**
```bash
# nvm 명령을 찾을 수 없을 때
source ~/.nvm/nvm.sh

# snap 설치 실패 시
sudo apt install snapd
sudo systemctl start snapd

# NodeSource 설치 충돌 시
sudo apt remove -y nodejs npm
sudo apt purge -y nodejs npm
sudo apt autoremove -y
# 그 다음 재설치
```

### 0.1 운영 계정 및 디렉터리 구조

```bash
# iitp-adm 사용자 사용(이미 존재한다고 가정). 홈 아래 기본 구조 생성
sudo mkdir -p /home/iitp-adm/iitp-dabt-admin/{source,deploy}
sudo chown -R iitp-adm:iitp-adm /home/iitp-adm/iitp-dabt-admin

# 서비스 루트 생성 (실행 경로)
sudo mkdir -p /var/www/iitp-dabt-admin/{be,fe,script,packages/common}
sudo chown -R iitp-adm:iitp-adm /var/www/iitp-dabt-admin
```

설명:
- `/var/www/iitp-dabt-admin/packages/common`은 BE가 참조하는 공통 패키지의 실제 위치입니다.
  - BE의 `be/package.json`에는 `"@iitp-dabt/common": "file:../packages/common"`로 선언되어 있어
    설치 시 `be/node_modules/@iitp-dabt/common`이 위 경로를 가리키는 심볼릭 링크로 생성됩니다.
  - 배포 시 이 디렉터리에 `dist/**`와 `package.json`이 동기화되어야 런타임에서 모듈을 정상 로드합니다.

### 0.2 최소 환경변수(.env) 설정 가이드(필수)

프로덕션 동작을 위해서는 빌드 시점 변수(FE)와 런타임 변수(BE)를 정확히 설정해야 합니다.

- FE(빌드 시 주입: Vite)
  - 빌드 전에 아래 변수를 쉘에 export 하거나 빌드 스크립트 실행 전에 주입하세요.
  - 서브패스 `/adm/`, API 프록시 `/adm/api`를 사용하는 현재 구성 예시:
    ```bash
    export VITE_BASE=/adm/
    export VITE_API_BASE_URL=/adm/api
    # 선택: 타임아웃/추가 베이스 등
    # export VITE_API_TIMEOUT=10000
    ```
  - 전체 빌드 실행 시 자동으로 FE도 빌드되므로, 반드시 `npm run build:server`(또는 `build:server:fe`) 실행 전에 설정하세요.

- BE(런타임 주입: dotenv)
  - 실행 서버의 BE 경로에 `.env`를 생성하세요: `/var/www/iitp-dabt-admin/be/.env`
    최소 예시:
    ```env
    NODE_ENV=production
    PORT=30000
    
    # Database
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=iitp_dabt_admin
    DB_USER=your_db_user
    DB_PASSWORD=your_db_password
    
    # JWT / 암호화
    JWT_SECRET=your-jwt-secret
    JWT_ISSUER=iitp-dabt-api
    ACCESS_TOKEN_EXPIRES_IN=15m
    REFRESH_TOKEN_EXPIRES_IN=7d
    ENC_SECRET=your-encryption-secret
    
    # CORS (필요 시 프론트 도메인 추가)
    CORS_ORIGINS=http://192.168.60.142
    ```
  - `.env`는 배포(rsync) 시 보존되도록 스크립트가 설정되어 있습니다(`--exclude .env*`).

---

## 1. 소스 준비(동일 서버 빌드용)

`iitp-adm` 계정으로 로그인 후 진행합니다.

```bash
sudo -iu iitp-adm

cd /home/iitp-adm/iitp-dabt-admin/source
git clone <YOUR_REPOSITORY_URL> .

# 빌드 서버용 .env 작성
cp script/env.sample.build-server script/.env
vi script/.env
```

필수 항목 예시:
```bash
SOURCE_PATH=/home/iitp-adm/iitp-dabt-admin/source
DEPLOY_PATH=/home/iitp-adm/iitp-dabt-admin/deploy
GIT_REPO_URL=<YOUR_REPOSITORY_URL>
GIT_BRANCH=main
```

---

## 2. 빌드(서버에서 수행)

```bash
cd /home/iitp-adm/iitp-dabt-admin/source

# 전체 빌드 (common → be → fe 순, dist 검증 및 보강 포함)
npm run build:server

# 또는 개별 빌드
npm run build:server:common    # Common만
npm run build:server:be        # Backend만
npm run build:server:fe        # Frontend만

# 빌드 산출물 확인
ls -l /home/iitp-adm/iitp-dabt-admin/deploy
ls -l /home/iitp-adm/iitp-dabt-admin/deploy/backend
ls -l /home/iitp-adm/iitp-dabt-admin/deploy/frontend
ls -l /home/iitp-adm/iitp-dabt-admin/deploy/common
```

빌드 결과(의도):
- `deploy/backend/`: `be/dist` + `be/package.json` + (있으면) `package-lock.json`, `build-info.json`
- `deploy/frontend/`: `fe/dist`
- `deploy/common/`: `packages/common/dist` + `packages/common/package.json`

---

## 3. 배포(동일 서버 내 rsync)

동일 서버에서 배포하므로 `BUILD_SERVER_HOST`와 `PROD_SERVER_HOST`가 동일해도 됩니다. 스크립트는 sameHost 모드에서 로컬 rsync 수행하며, 다음을 보존합니다:
- `node_modules/` 보존
- `.env`, `.env*` 보존

```bash
cd /home/iitp-adm/iitp-dabt-admin/source

# 배포 서버용 .env 작성
cp script/env.sample.deploy-server script/.env
vi script/.env
```

필수 항목 예시:
```bash
BUILD_SERVER_HOST=localhost
BUILD_SERVER_USER=iitp-adm
BUILD_SERVER_PATH=/home/iitp-adm/iitp-dabt-admin/deploy
BUILD_SERVER_PORT=22

PROD_SERVER_HOST=localhost
PROD_SERVER_USER=iitp-adm
PROD_SERVER_PORT=22

PROD_BE_PATH=/var/www/iitp-dabt-admin/be
PROD_FE_PATH=/var/www/iitp-dabt-admin/fe
```

배포 실행:
```bash
# 전체 배포 (동일 서버지만 필요 작업에 sudo가 요구될 수 있음)
sudo npm run deploy:server

# 또는 개별 배포
sudo npm run deploy:server:common  # Common만
sudo npm run deploy:server:be      # Backend만
sudo npm run deploy:server:fe      # Frontend만
```

> **Common 단독 배포 후 주의:**
> - 배포 후 **반드시 BE 재시작 필수**: `sudo npm run restart:server:be`
> - FE는 재시작 불필요 (정적 파일, 빌드 시 이미 포함됨)

배포 후 확인:
```bash
ls -l /var/www/iitp-dabt-admin/be
ls -l /var/www/iitp-dabt-admin/fe/dist
ls -l /var/www/iitp-dabt-admin/packages/common
```

> 중요: Backend 의존성 설치 (최초 또는 be/package.json 변경 시)
```bash
cd /var/www/iitp-dabt-admin/be
npm ci --omit=dev || npm install --omit=dev
```

### 3.1 packages/common 동기화와 BE 연동(중요)

이 프로젝트의 Backend는 `be/package.json`에 아래와 같이 공통 패키지를 로컬 경로로 참조합니다.

```json
"@iitp-dabt/common": "file:../packages/common"
```

그 결과 BE에서 `npm install`을 수행하면 `be/node_modules/@iitp-dabt/common`이 심볼릭 링크(symlink)로 생성되며, 실제 대상은 실행 서버의 워크스페이스 경로인:

```
/var/www/iitp-dabt-admin/packages/common
```

입니다. 따라서 배포 시 반드시 위 경로를 다음처럼 채워야 합니다.

- 빌드 서버의 `deploy/common/` → 실행 서버 `/var/www/iitp-dabt-admin/packages/common/`
  - 포함 파일: `dist/**`, `package.json`

본 문서의 배포 스크립트는 위 동기화를 자동으로 수행합니다. 배포 후 반드시 다음을 확인하세요.

```bash
ls -l /var/www/iitp-dabt-admin/packages/common
ls -l /var/www/iitp-dabt-admin/packages/common/dist
cat /var/www/iitp-dabt-admin/packages/common/package.json | grep -E '"name"|"main"|"version"'

# 심볼릭 링크가 올바른지(있다면) 확인
ls -l /var/www/iitp-dabt-admin/be/node_modules/@iitp-dabt
readlink -f /var/www/iitp-dabt-admin/be/node_modules/@iitp-dabt/common || true
```

정상이라면 BE 런타임에서 `@iitp-dabt/common` 모듈을 문제 없이 로드할 수 있습니다.

---

## 4. Nginx 설정(문서 + Admin FE/BE)

파일: `/etc/nginx/conf.d/iitp-dabt-admin.conf`

```nginx
upstream iitp_dabt_backend {
    server 127.0.0.1:30000;
    keepalive 32;
}

server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;

    root /var/www/html;

    # 문서 서비스
    location /docs/ {
        index index.html;
        try_files $uri $uri/ =404;
    }

    # FE: /adm → /adm/
    location = /adm {
        return 301 /adm/;
    }

    # 정적 자산 캐시
    location ^~ /adm/assets/ {
        alias /var/www/iitp-dabt-admin/fe/dist/assets/;
        try_files $uri =404;
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    # 루트 레벨 정적 파일 (이미지 등)
    location ~* ^/adm/([^/]+\.(?:png|jpg|jpeg|gif|svg|ico|woff2?|js|css|map))$ {
        alias /var/www/iitp-dabt-admin/fe/dist/$1;
        try_files $uri =404;
        expires 7d;
        add_header Cache-Control "public, max-age=604800";
    }

    # SPA fallback (React Router 지원)
    location /adm/ {
        alias /var/www/iitp-dabt-admin/fe/dist/;
        index index.html;
        # 중요: alias 사용 시 fallback은 location prefix 포함 경로로 지정
        try_files $uri $uri/ /adm/index.html;
    }

    # API 프록시 (/adm/api/* → /api/*)
    location /adm/api/ {
        proxy_pass http://iitp_dabt_backend/api/;  # 끝 슬래시 필수
        proxy_http_version 1.1;
        proxy_read_timeout 120s;
        proxy_send_timeout 120s;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        client_max_body_size 20m;
    }

    add_header X-Frame-Options SAMEORIGIN always;
    add_header X-Content-Type-Options nosniff always;
    add_header Referrer-Policy strict-origin-when-cross-origin always;
}
```

적용:
```bash
sudo nginx -t
sudo systemctl reload nginx
```

---

## 5. Backend 시작/재시작/중지 및 검증

시작(최초):
```bash
# 스크립트는 .env 로드, npm install --omit=dev, PM2 start 수행
npm run start:server:be
```

재시작/중지:
```bash
npm run restart:server:be
npm run stop:server:be
```

상태/로그:
```bash
pm2 status
pm2 logs iitp-dabt-adm-be --lines 100
```

헬스체크:
```bash
# BE 직접
curl -i http://127.0.0.1:30000/api/common/health

# Nginx 경유
curl -i http://127.0.0.1/adm/api/common/health
```

---

## 6. Frontend 제공 및 검증

브라우저 접속:
```
http://<서버_IP_또는_도메인>/adm/
```

정적 파일 확인:
```bash
ls -l /var/www/iitp-dabt-admin/fe/dist
```

---

## 7. 운영 팁 및 주의사항

- 실행 서버에서 `be/package.json`이 변경된 배포를 받은 경우:
  ```bash
  cd /var/www/iitp-dabt-admin/be
  npm ci --omit=dev || npm install --omit=dev
  pm2 restart iitp-dabt-adm-be
  ```
- 배포 스크립트는 `node_modules/`, `.env`, `.env*`를 보존합니다.
- `@iitp-dabt/common`은 `/var/www/iitp-dabt-admin/packages/common`으로 동기화되며, BE의 `node_modules/@iitp-dabt/common`은 해당 경로를 가리키는 symlink일 수 있습니다.
- 포트 충돌 시 30000 사용 중인 프로세스 확인: `ss -tlpn | grep :30000 || true`
- Nginx 프록시 경로 주의: `location /adm/api/` 블록에서 `proxy_pass .../api/;`처럼 끝 슬래시가 꼭 있어야 `/adm/api/* → /api/*`로 정확히 매핑됩니다.

---

## 8. 문제 해결(요약)

- PM2 online이지만 즉시 `errored`로 바뀌는 경우
  - `.env` 누락, 포트 충돌, DB 연결 실패, 의존성 미설치 여부 확인
  - `pm2 logs iitp-dabt-adm-be --lines 200`

- `MODULE_NOT_FOUND: '@iitp-dabt/common'`
  - `/var/www/iitp-dabt-admin/packages/common` 경로에 `dist/`와 `package.json`이 있는지 확인
  - BE 디렉터리에서 `npm ci --omit=dev || npm install --omit=dev`

- 배포 후 `node_modules`가 사라짐
  - 현재 스크립트는 `node_modules/`를 제외하도록 수정되어 보존됩니다.

- Nginx 404
  - `proxy_pass http://iitp_dabt_backend/api/;` 끝 슬래시 포함 여부 확인

---

이 문서 순서대로 수행하면 단일 서버 환경에서 빌드 → 배포 → 기동까지 원활히 진행되며, `/adm`(FE)와 `/adm/api`(BE)가 정상 동작합니다.


