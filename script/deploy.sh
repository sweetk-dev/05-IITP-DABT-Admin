#!/bin/bash
# Linux/Mac용 배포 스크립트

set -e

# 실행 권한 확인 및 설정
if [ ! -x "$0" ]; then
    echo "🔧 실행 권한을 설정합니다..."
    chmod +x "$0"
fi

# 배포 설정
BE_HOST=${BE_HOST:-"your-backend-server.com"}
BE_USER=${BE_USER:-"your-username"}
BE_PATH=${BE_PATH:-"/var/www/iitp-dabt-adm-be"}
BE_PORT=${BE_PORT:-"22"}

FE_HOST=${FE_HOST:-"your-frontend-server.com"}
FE_USER=${FE_USER:-"your-username"}
FE_PATH=${FE_PATH:-"/var/www/iitp-dabt-adm-fe"}
FE_PORT=${FE_PORT:-"22"}

echo "🖥️  Linux/Mac 배포 스크립트 시작..."

# 환경 변수 확인
if [ "$BE_HOST" = "your-backend-server.com" ] || [ "$FE_HOST" = "your-frontend-server.com" ]; then
    echo "⚠️  환경 변수가 설정되지 않았습니다."
    echo "📋 필요한 환경 변수:"
    echo "   BE_HOST: Backend 서버 호스트"
    echo "   BE_USER: Backend 서버 사용자명"
    echo "   BE_PATH: Backend 서버 경로"
    echo "   FE_HOST: Frontend 서버 호스트"
    echo "   FE_USER: Frontend 서버 사용자명"
    echo "   FE_PATH: Frontend 서버 경로"
    echo ""
    echo "💡 사용법:"
    echo "   export BE_HOST=your-backend-server.com"
    echo "   export BE_USER=your-username"
    echo "   export BE_PATH=/var/www/iitp-dabt-adm-be"
    echo "   export FE_HOST=your-frontend-server.com"
    echo "   export FE_USER=your-username"
    echo "   export FE_PATH=/var/www/iitp-dabt-adm-fe"
    echo "   bash script/deploy.sh"
    exit 1
fi

# 배포할 파일들 준비
prepare_deploy_files() {
    echo "📦 배포 파일 준비 중..."
    
    # 1. 전체 빌드
    echo "🔨 전체 프로젝트 빌드 중..."
    cd ..
    npm run build
    cd script
    
    if [ $? -ne 0 ]; then
        echo "❌ 빌드 실패"
        exit 1
    fi
    
    echo "✅ 빌드 완료"
}

# Backend 배포
deploy_backend() {
    echo "🔧 Backend 배포 중..."
    
    BE_DIST_PATH="../be/dist"
    BE_PACKAGE_PATH="../be/package.json"
    BE_PACKAGE_LOCK_PATH="../be/package-lock.json"
    BE_BUILD_INFO_PATH="../be/build-info.json"
    
    # 배포할 파일들 확인
    files_to_deploy=("$BE_DIST_PATH" "$BE_PACKAGE_PATH" "$BE_PACKAGE_LOCK_PATH" "$BE_BUILD_INFO_PATH")
    
    for file in "${files_to_deploy[@]}"; do
        if [ ! -e "$file" ]; then
            echo "❌ 파일이 없습니다: $file"
            exit 1
        fi
    done
    
    # rsync로 배포
    echo "📤 Backend 파일 업로드 중..."
    rsync -avz --delete \
        -e "ssh -p $BE_PORT" \
        "$BE_DIST_PATH/" \
        "$BE_PACKAGE_PATH" \
        "$BE_PACKAGE_LOCK_PATH" \
        "$BE_BUILD_INFO_PATH" \
        "$BE_USER@$BE_HOST:$BE_PATH/"
    
    if [ $? -eq 0 ]; then
        echo "✅ Backend 배포 완료"
    else
        echo "❌ Backend 배포 실패"
        exit 1
    fi
}

# Frontend 배포
deploy_frontend() {
    echo "🎨 Frontend 배포 중..."
    
    FE_DIST_PATH="../fe/dist"
    
    if [ ! -e "$FE_DIST_PATH" ]; then
        echo "❌ Frontend 빌드 결과물이 없습니다: $FE_DIST_PATH"
        exit 1
    fi
    
    # rsync로 배포
    echo "📤 Frontend 파일 업로드 중..."
    rsync -avz --delete \
        -e "ssh -p $FE_PORT" \
        "$FE_DIST_PATH/" \
        "$FE_USER@$FE_HOST:$FE_PATH/"
    
    if [ $? -eq 0 ]; then
        echo "✅ Frontend 배포 완료"
    else
        echo "❌ Frontend 배포 실패"
        exit 1
    fi
}

# 서버 재시작
restart_servers() {
    echo "🔄 서버 재시작 중..."
    
    # Backend 서버 재시작
    echo "🔄 Backend 서버 재시작 중..."
    ssh -p "$BE_PORT" "$BE_USER@$BE_HOST" "cd $BE_PATH && npm install && pm2 restart iitp-dabt-adm-be"
    
    if [ $? -eq 0 ]; then
        echo "✅ Backend 서버 재시작 완료"
    else
        echo "❌ Backend 서버 재시작 실패"
        exit 1
    fi
}

# 메인 실행
main() {
    echo "🚀 IITP DABT Admin 배포 시작..."
    
    # 1. 빌드
    prepare_deploy_files
    
    # 2. Backend 배포
    deploy_backend
    
    # 3. Frontend 배포
    deploy_frontend
    
    # 4. 서버 재시작
    restart_servers
    
    echo "🎉 배포 완료!"
    echo ""
    echo "📋 배포된 서비스:"
    echo "   Backend: http://$BE_HOST:30000"
    echo "   Frontend: http://$FE_HOST"
}

main 