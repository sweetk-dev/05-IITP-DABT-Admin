# 로컬 개발 환경 배포 가이드

## 📋 개요

이 가이드는 로컬 개발 환경에서 실제 서버로 배포할 때 사용하는 임시 배포 스크립트에 대한 설명입니다.

## 🚀 로컬 배포 스크립트

### 파일 위치
- **스크립트**: `script/deploy-local.ps1`
- **설정 파일**: `script/deploy-config.json` (개인 설정)
- **설정 템플릿**: `script/deploy-config.json.example`

### 특징
- **임시 스크립트**: package.json에 포함되지 않음
- **개인 설정**: Git에 커밋되지 않는 개인 설정 파일 사용
- **대화형**: 배포 타입을 선택할 수 있는 메뉴 제공
- **환경 변수 자동 설정**: 설정 파일에서 환경 변수를 자동으로 설정

## 🔧 설정 방법

### 1. 설정 파일 생성
```bash
# 템플릿 파일을 복사
copy script\deploy-config.json.example script\deploy-config.json
```

### 2. 설정 파일 편집
`script/deploy-config.json` 파일을 편집하여 실제 서버 정보를 입력:

```json
{
  "common": {
    "host": "192.168.1.100",
    "user": "deploy",
    "path": "/var/www/iitp-dabt-common",
    "port": "22"
  },
  "backend": {
    "host": "192.168.1.100",
    "user": "deploy",
    "path": "/var/www/iitp-dabt-backend",
    "port": "22"
  },
  "frontend": {
    "host": "192.168.1.101",
    "user": "deploy",
    "path": "/var/www/iitp-dabt-frontend",
    "port": "22"
  }
}
```

## 🚀 사용법

### 기본 사용법
```powershell
# PowerShell에서 실행
.\script\deploy-local.ps1
```

### 다른 설정 파일 사용
```powershell
# 다른 설정 파일 사용
.\script\deploy-local.ps1 -ConfigFile "deploy-config-prod.json"
```

### 실행 과정
1. **설정 파일 확인**: `deploy-config.json` 파일 존재 및 유효성 검사
2. **환경 변수 설정**: 설정 파일의 값을 환경 변수로 설정
3. **배포 타입 선택**: 대화형 메뉴에서 배포 타입 선택
4. **배포 실행**: 선택한 배포 스크립트 실행

### 배포 타입
```
📋 배포 타입을 선택하세요:
1. 전체 배포 (Common + Backend + Frontend)
2. Common 패키지만 배포
3. Backend만 배포
4. Frontend만 배포
5. 취소
```

## 🔒 보안

### 설정 파일 보안
- `deploy-config.json`은 `.gitignore`에 포함되어 Git에 커밋되지 않음
- 개인 서버 정보를 안전하게 보관
- 팀원마다 다른 설정 파일 사용 가능

### SSH 키 설정
배포 전 SSH 키 설정이 필요합니다:

```bash
# SSH 키 생성 (없는 경우)
ssh-keygen -t rsa -b 4096 -C "your-email@example.com"

# 서버에 SSH 키 등록
ssh-copy-id user@your-server.com
```

## 📝 예시

### 개발 서버 배포
```json
{
  "common": {
    "host": "dev-server.company.com",
    "user": "developer",
    "path": "/home/developer/iitp-dabt-common",
    "port": "22"
  },
  "backend": {
    "host": "dev-server.company.com",
    "user": "developer",
    "path": "/home/developer/iitp-dabt-backend",
    "port": "22"
  },
  "frontend": {
    "host": "dev-server.company.com",
    "user": "developer",
    "path": "/home/developer/iitp-dabt-frontend",
    "port": "22"
  }
}
```

### 프로덕션 서버 배포
```json
{
  "common": {
    "host": "prod-server.company.com",
    "user": "deploy",
    "path": "/var/www/iitp-dabt-common",
    "port": "22"
  },
  "backend": {
    "host": "prod-server.company.com",
    "user": "deploy",
    "path": "/var/www/iitp-dabt-backend",
    "port": "22"
  },
  "frontend": {
    "host": "prod-server.company.com",
    "user": "deploy",
    "path": "/var/www/iitp-dabt-frontend",
    "port": "22"
  }
}
```

## 🆘 문제 해결

### 설정 파일 오류
```
❌ 설정 파일이 없습니다: script/deploy-config.json
```
**해결**: `deploy-config.json.example`을 복사하여 `deploy-config.json` 생성

### SSH 연결 오류
```
❌ Backend 배포 실패
```
**해결**: SSH 키 설정 확인, 서버 접근 권한 확인

### 권한 오류
```
❌ Frontend 배포 실패
```
**해결**: 서버 디렉토리 쓰기 권한 확인

## 💡 팁

### 여러 환경 관리
```bash
# 개발 환경
deploy-config-dev.json

# 스테이징 환경
deploy-config-staging.json

# 프로덕션 환경
deploy-config-prod.json
```

### 배치 파일로 간편 실행
`deploy.bat` 파일 생성:
```batch
@echo off
powershell -ExecutionPolicy Bypass -File script\deploy-local.ps1
pause
```

### 자동화
CI/CD 파이프라인에서는 이 스크립트 대신 환경 변수를 직접 설정하여 사용하세요. 