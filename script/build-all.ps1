# 전체(공통, BE, FE) 빌드 스크립트 (PowerShell)

Write-Host "🧹 Clean build 시작..." -ForegroundColor Yellow

# packages/common clean
if (Test-Path "../packages/common/dist") {
    Remove-Item -Recurse -Force "../packages/common/dist"
}
# BE clean
if (Test-Path "../be/dist") {
    Remove-Item -Recurse -Force "../be/dist"
}
# FE clean
if (Test-Path "../fe/dist") {
    Remove-Item -Recurse -Force "../fe/dist"
}

Write-Host "📦 packages/common 빌드 중..." -ForegroundColor Green
# 공통 패키지 빌드
Set-Location "../packages/common"
npm run build
Set-Location "../../script"

Write-Host "🔧 Backend 빌드 중..." -ForegroundColor Green
# BE 빌드
Set-Location "../be"
npm run build
Set-Location "../script"

Write-Host "🎨 Frontend 빌드 중..." -ForegroundColor Green
# FE 빌드
Set-Location "../fe"
npm run build
Set-Location "../script"

Write-Host "✅ [ALL] common, be, fe 빌드 완료!" -ForegroundColor Green
Write-Host "📁 빌드 결과물:" -ForegroundColor Cyan
Write-Host "   - packages/common/dist/" -ForegroundColor White
Write-Host "   - be/dist/" -ForegroundColor White
Write-Host "   - fe/dist/" -ForegroundColor White 