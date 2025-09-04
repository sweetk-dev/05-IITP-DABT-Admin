# 로컬 개발 환경용 임시 배포 스크립트 (Windows PowerShell)
# 이 스크립트는 package.json에 포함되지 않으며, 로컬 개발용으로만 사용됩니다.

param(
    [string]$ConfigFile = "deploy-config.json"
)

# 배포 설정 파일 경로
$configPath = Join-Path $PSScriptRoot $ConfigFile

Write-Host "🚀 로컬 개발 환경 배포 스크립트 시작..." -ForegroundColor Green
Write-Host "📁 설정 파일: $configPath" -ForegroundColor Cyan

# 설정 파일 존재 확인
if (-not (Test-Path $configPath)) {
    Write-Host "❌ 설정 파일이 없습니다: $configPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "📋 설정 파일을 생성해주세요:" -ForegroundColor Yellow
    Write-Host "   $configPath" -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 설정 파일 예시:" -ForegroundColor Cyan
    Write-Host @"
{
  "common": {
    "host": "your-common-server.com",
    "user": "your-username",
    "path": "/var/www/iitp-dabt-common",
    "port": "22"
  },
  "backend": {
    "host": "your-backend-server.com",
    "user": "your-username",
    "path": "/var/www/iitp-dabt-admin/be",
    "port": "22"
  },
  "frontend": {
    "host": "your-frontend-server.com",
    "user": "your-username",
    "path": "/var/www/iitp-dabt-admin/fe",
    "port": "22"
  }
}
"@ -ForegroundColor Gray
    exit 1
}

# 설정 파일 읽기
try {
    $config = Get-Content $configPath | ConvertFrom-Json
    Write-Host "✅ 설정 파일 로드 완료" -ForegroundColor Green
} catch {
    Write-Host "❌ 설정 파일 읽기 실패: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# 설정 검증
$requiredFields = @(
    @{Section="common"; Fields=@("host", "user", "path")},
    @{Section="backend"; Fields=@("host", "user", "path")},
    @{Section="frontend"; Fields=@("host", "user", "path")}
)

foreach ($section in $requiredFields) {
    $sectionName = $section.Section
    $sectionConfig = $config.$sectionName
    
    if (-not $sectionConfig) {
        Write-Host "❌ 설정 파일에 '$sectionName' 섹션이 없습니다." -ForegroundColor Red
        exit 1
    }
    
    foreach ($field in $section.Fields) {
        if (-not $sectionConfig.$field) {
            Write-Host "❌ 설정 파일에 '$sectionName.$field' 값이 없습니다." -ForegroundColor Red
            exit 1
        }
    }
}

Write-Host "✅ 설정 검증 완료" -ForegroundColor Green

# 환경 변수 설정
Write-Host "🔧 환경 변수 설정 중..." -ForegroundColor Yellow

# Common 패키지 환경 변수
$env:COMMON_HOST = $config.common.host
$env:COMMON_USER = $config.common.user
$env:COMMON_PATH = $config.common.path
$env:COMMON_PORT = $config.common.port

# Backend 환경 변수
$env:BE_HOST = $config.backend.host
$env:BE_USER = $config.backend.user
$env:BE_PATH = $config.backend.path
$env:BE_PORT = $config.backend.port

# Frontend 환경 변수
$env:FE_HOST = $config.frontend.host
$env:FE_USER = $config.frontend.user
$env:FE_PATH = $config.frontend.path
$env:FE_PORT = $config.frontend.port

Write-Host "✅ 환경 변수 설정 완료" -ForegroundColor Green

# 배포 타입 선택
Write-Host ""
Write-Host "📋 배포 타입을 선택하세요:" -ForegroundColor Cyan
Write-Host "1. 전체 배포 (Common + Backend + Frontend)" -ForegroundColor White
Write-Host "2. Common 패키지만 배포" -ForegroundColor White
Write-Host "3. Backend만 배포" -ForegroundColor White
Write-Host "4. Frontend만 배포" -ForegroundColor White
Write-Host "5. 취소" -ForegroundColor White

$choice = Read-Host "선택 (1-5)"

# 배포 실행
try {
    Set-Location (Split-Path $PSScriptRoot -Parent)
    
    switch ($choice) {
        "1" {
            Write-Host "🚀 전체 배포 시작..." -ForegroundColor Green
            npm run deploy
        }
        "2" {
            Write-Host "🚀 Common 패키지 배포 시작..." -ForegroundColor Green
            npm run deploy:common
        }
        "3" {
            Write-Host "🚀 Backend 배포 시작..." -ForegroundColor Green
            npm run deploy:be
        }
        "4" {
            Write-Host "🚀 Frontend 배포 시작..." -ForegroundColor Green
            npm run deploy:fe
        }
        "5" {
            Write-Host "❌ 배포가 취소되었습니다." -ForegroundColor Yellow
            exit 0
        }
        default {
            Write-Host "❌ 잘못된 선택입니다. 1-5 중에서 선택해주세요." -ForegroundColor Red
            exit 1
        }
    }
    
    Write-Host ""
    Write-Host "🎉 배포 완료!" -ForegroundColor Green
    Write-Host "📋 배포된 서비스:" -ForegroundColor Cyan
    Write-Host "   Backend: http://$($config.backend.host):30000" -ForegroundColor White
    Write-Host "   Frontend: http://$($config.frontend.host)" -ForegroundColor White
    
} catch {
    Write-Host "❌ 배포 실패: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} 