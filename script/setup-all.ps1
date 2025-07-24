# 전체 프로젝트 설정 스크립트 (PowerShell)

Write-Host "🚀 IITP DABT Admin 전체 프로젝트 설정 시작..." -ForegroundColor Green

# 현재 디렉토리 확인
if (-not (Test-Path "package.json")) {
    Write-Host "❌ 루트 디렉토리에서 실행해주세요." -ForegroundColor Red
    exit 1
}

Write-Host "📦 packages/common 설정 중..." -ForegroundColor Green
# packages/common 설정
Set-Location "packages/common"
npm install
npm run build
Set-Location "../script"

Write-Host "🔧 Backend 설정 중..." -ForegroundColor Green
# BE 설정
Set-Location "../be"
if (Test-Path "scripts/setup.sh") {
    # Windows에서는 bash 대신 npm 스크립트 사용
    npm install
    if (Test-Path ".env.example") {
        if (-not (Test-Path ".env")) {
            Copy-Item ".env.example" ".env"
            Write-Host ".env.example을 .env로 복사했습니다." -ForegroundColor Yellow
        }
    }
    # 로그 디렉토리 생성
    if (-not (Test-Path "logs")) {
        New-Item -ItemType Directory -Path "logs"
    }
    Write-Host "✅ [BE] 설정 완료" -ForegroundColor Green
} else {
    Write-Host "❌ be/scripts/setup.sh 파일이 없습니다." -ForegroundColor Red
    exit 1
}
Set-Location "../script"

Write-Host "🎨 Frontend 설정 중..." -ForegroundColor Green
# FE 설정
Set-Location "../fe"
if (Test-Path "scripts/setup.sh") {
    # Windows에서는 bash 대신 npm 스크립트 사용
    npm install
    Write-Host "✅ [FE] 설정 완료" -ForegroundColor Green
} else {
    Write-Host "❌ fe/scripts/setup.sh 파일이 없습니다." -ForegroundColor Red
    exit 1
}
Set-Location "../script"

Write-Host "✅ 전체 프로젝트 설정 완료!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 다음 단계:" -ForegroundColor Cyan
Write-Host "1. BE 환경 변수 설정:" -ForegroundColor White
Write-Host "   cd be && copy .env.example .env" -ForegroundColor Gray
Write-Host "   # .env 파일을 편집하여 데이터베이스 정보 입력" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 개발 서버 실행:" -ForegroundColor White
Write-Host "   # Backend: cd be && npm run dev" -ForegroundColor Gray
Write-Host "   # Frontend: cd fe && npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. 전체 빌드:" -ForegroundColor White
Write-Host "   npm run build" -ForegroundColor Gray 