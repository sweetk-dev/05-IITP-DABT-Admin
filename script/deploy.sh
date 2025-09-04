#!/usr/bin/env bash

set -euo pipefail

# 기본 경로 설정 (환경변수로 override 가능)
BE_PATH=${BE_PATH:-"/var/www/iitp-dabt-admin/be"}
FE_PATH=${FE_PATH:-"/var/www/iitp-dabt-admin/fe"}

# 도우미 출력
function usage() {
    echo "사용법: BE_HOST, BE_USER, FE_HOST, FE_USER 등을 환경변수로 설정 후 실행"
    echo "예시:"
    echo "   export BE_HOST=your-backend-server.com"
    echo "   export BE_USER=your-username"
    echo "   export BE_PATH=/var/www/iitp-dabt-admin/be"
    echo "   export FE_HOST=your-frontend-server.com"
    echo "   export FE_USER=your-username"
    echo "   export FE_PATH=/var/www/iitp-dabt-admin/fe"
}

# 실제 배포 로직은 프로젝트 요구에 맞게 구현 (생략) 