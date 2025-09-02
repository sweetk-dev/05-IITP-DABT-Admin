# Windows용 배포 스크립트 (PowerShell)

param(
    [string]$BeHost = $env:BE_HOST,
    [string]$BeUser = $env:BE_USER,
    [string]$BePath = $env:BE_PATH,
    [string]$FeHost = $env:FE_HOST,
    [string]$FeUser = $env:FE_USER,
    [string]$FePath = $env:FE_PATH
)

# 배포 설정
$deployConfig = @{
    Backend = @{
        Host = $BeHost
        User = $BeUser
        Path = $BePath
        Port = "22"
    }
    Frontend = @{
        Host = $FeHost
        User = $FeUser
        Path = $FePath
        Port = "22"
    }
}

Write-Host "🖥️  Windows 배포 스크립트 시작..." -ForegroundColor Green

# 환경 변수 확인
if (-not $deployConfig.Backend.Host -or -not $deployConfig.Frontend.Host) {
    Write-Host "⚠️  환경 변수가 설정되지 않았습니다." -ForegroundColor Yellow
    Write-Host "📋 필요한 환경 변수:" -ForegroundColor Cyan
    Write-Host "   BE_HOST: Backend 서버 호스트" -ForegroundColor White
    Write-Host "   BE_USER: Backend 서버 사용자명" -ForegroundColor White
    Write-Host "   BE_PATH: Backend 서버 경로" -ForegroundColor White
    Write-Host "   FE_HOST: Frontend 서버 호스트" -ForegroundColor White
    Write-Host "   FE_USER: Frontend 서버 사용자명" -ForegroundColor White
    Write-Host "   FE_PATH: Frontend 서버 경로" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 사용법:" -ForegroundColor Cyan
    Write-Host "   .\script\deploy.ps1 -BeHost your-backend-server.com -BeUser your-username -BePath /var/www/iitp-dabt-adm-be -FeHost your-frontend-server.com -FeUser your-username -FePath /var/www/iitp-dabt-adm-fe" -ForegroundColor Gray
    exit 1
}

# 배포할 파일들 준비
function Prepare-DeployFiles {
    Write-Host "📦 배포 파일 준비 중..." -ForegroundColor Green
    
    # 1. 전체 빌드
    Write-Host "🔨 전체 프로젝트 빌드 중..." -ForegroundColor Green
    Set-Location ".."
    npm run build
    Set-Location "script"
    
    if ($LASTEXITCODE -ne 0) {
        throw "빌드 실패"
    }
    
    Write-Host "✅ 빌드 완료" -ForegroundColor Green
}

# Backend 배포
function Deploy-Backend {
    Write-Host "🔧 Backend 배포 중..." -ForegroundColor Green
    
    $beDistPath = "..\be\dist"
    $bePackagePath = "..\be\package.json"
    $bePackageLockPath = "..\be\package-lock.json"
    $beBuildInfoPath = "..\be\build-info.json"
    
    # 배포할 파일들 확인
    $filesToDeploy = @($beDistPath, $bePackagePath, $bePackageLockPath, $beBuildInfoPath)
    
    foreach ($file in $filesToDeploy) {
        if (-not (Test-Path $file)) {
            Write-Host "❌ 파일이 없습니다: $file" -ForegroundColor Red
            exit 1
        }
    }
    
    Write-Host "📤 Backend 배포 명령어:" -ForegroundColor Cyan
    Write-Host "scp -P $($deployConfig.Backend.Port) -r $beDistPath\* $($deployConfig.Backend.User)@$($deployConfig.Backend.Host):$($deployConfig.Backend.Path)/" -ForegroundColor Gray
    Write-Host "scp -P $($deployConfig.Backend.Port) $bePackagePath $($deployConfig.Backend.User)@$($deployConfig.Backend.Host):$($deployConfig.Backend.Path)/" -ForegroundColor Gray
    Write-Host "scp -P $($deployConfig.Backend.Port) $bePackageLockPath $($deployConfig.Backend.User)@$($deployConfig.Backend.Host):$($deployConfig.Backend.Path)/" -ForegroundColor Gray
    Write-Host "scp -P $($deployConfig.Backend.Port) $beBuildInfoPath $($deployConfig.Backend.User)@$($deployConfig.Backend.Host):$($deployConfig.Backend.Path)/" -ForegroundColor Gray
    
    Write-Host "⚠️  위 명령어를 Git Bash에서 수동으로 실행하세요." -ForegroundColor Yellow
}

# Frontend 배포
function Deploy-Frontend {
    Write-Host "🎨 Frontend 배포 중..." -ForegroundColor Green
    
    $feDistPath = "..\fe\dist"
    
    if (-not (Test-Path $feDistPath)) {
        Write-Host "❌ Frontend 빌드 결과물이 없습니다: $feDistPath" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "📤 Frontend 배포 명령어:" -ForegroundColor Cyan
    Write-Host "scp -P $($deployConfig.Frontend.Port) -r $feDistPath\* $($deployConfig.Frontend.User)@$($deployConfig.Frontend.Host):$($deployConfig.Frontend.Path)/" -ForegroundColor Gray
    
    Write-Host "⚠️  위 명령어를 Git Bash에서 수동으로 실행하세요." -ForegroundColor Yellow
}

# 서버 재시작
function Restart-Servers {
    Write-Host "🔄 서버 재시작 중..." -ForegroundColor Green
    
    Write-Host "📤 Backend 서버 재시작 명령어:" -ForegroundColor Cyan
    Write-Host "ssh -p $($deployConfig.Backend.Port) $($deployConfig.Backend.User)@$($deployConfig.Backend.Host) 'cd $($deployConfig.Backend.Path) && npm install && pm2 restart iitp-dabt-adm-be'" -ForegroundColor Gray
    
    Write-Host "⚠️  위 명령어를 Git Bash에서 수동으로 실행하세요." -ForegroundColor Yellow
}

# 메인 실행
try {
    Write-Host "🚀 IITP DABT Admin 배포 시작..." -ForegroundColor Green
    
    # 1. 빌드
    Prepare-DeployFiles
    
    # 2. Backend 배포
    Deploy-Backend
    
    # 3. Frontend 배포
    Deploy-Frontend
    
    # 4. 서버 재시작
    Restart-Servers
    
    Write-Host "🎉 배포 준비 완료!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 배포된 서비스:" -ForegroundColor Cyan
    Write-Host "   Backend: http://$($deployConfig.Backend.Host):30000" -ForegroundColor White
    Write-Host "   Frontend: http://$($deployConfig.Frontend.Host)" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 위의 명령어들을 Git Bash에서 실행하여 실제 배포를 완료하세요." -ForegroundColor Yellow
    
} catch {
    Write-Host "❌ 배포 실패: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} 