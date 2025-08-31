pipeline {
  agent any

  tools { nodejs 'NodeJS 18.17.0' }

  options { 
    timeout(time: 20, unit: 'MINUTES')
    ansiColor('xterm')
  }

  // 배포 시드 여부 선택(체크박스)
  parameters {
    booleanParam(name: 'SEED_DATA', defaultValue: false, description: '초기 데이터 시드 실행 여부')
  }

  environment {
    AWS_PAGER = ''
    AWS_DEFAULT_REGION = credentials('AWS_DEFAULT_REGION')
    S3_BUCKET = credentials('S3_BUCKET_NAME')
    CF_DISTRIBUTION_ID = credentials('CF_DISTRIBUTION_ID')

    SSH_KEY_ID = 'ec2-ssh-key'
    EC2_HOST   = credentials('EC2_HOST_TEXT')
    APP_NAME   = 'estate-project'
    REMOTE_DIR = "/home/ubuntu/${APP_NAME}"

    SEED_DATA = "${params.SEED_DATA}"
  }

  stages {

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Test frontend') {
      steps {
        dir('client') {
          sh '''
            set -e
            npm ci
            npm run lint || true
            npm run typecheck || true
            if npm run | grep -q "^  test"; then
              npm test -- --ci
            fi
          '''
        }
      }
    }

    stage('Build frontend') {
      steps {
        dir('client') {
          withCredentials([file(credentialsId: 'ENV_PROD_FILE', variable: 'ENV_FILE')]) {
            sh '''
              set -e
              umask 077
              trap 'sh -c "shred -u .env.production 2>/dev/null || rm -f .env.production"' EXIT

              # 비밀 파일을 안전 권한으로 복사(로그 출력 X)
              install -m 600 "$ENV_FILE" .env.production

              npm ci
              npm run build

              # trap 으로도 지워지지만 한 번 더
              shred -u .env.production 2>/dev/null || rm -f .env.production
            '''
          }
        }
      }
    }

    stage('Deploy frontend') {
      steps {
        sh '''
          set -e
          DIST_DIR="client/dist"

          echo "프론트엔드 정적 파일을 S3로 동기화"
          aws s3 sync "$DIST_DIR" "s3://$S3_BUCKET" \
            --delete \
            --exclude "index.html" \
            --cache-control "public,max-age=31536000,immutable"

          echo "index.html 파일을 최신 버전으로 업로드"
          aws s3 cp "$DIST_DIR/index.html" "s3://$S3_BUCKET/index.html" \
            --cache-control "no-store, must-revalidate" \
            --content-type "text/html; charset=utf-8"

          echo "CloudFront 캐시 무효화"
          aws cloudfront create-invalidation --distribution-id "$CF_DISTRIBUTION_ID" --paths "/*"
        '''
      }
    }

    stage('Test backend') {
      steps {
        dir('api') {
          sh '''
            set -e
            npm ci
            npm run lint || true
            npm run typecheck || true
            if npm run | grep -q "^  test"; then
              npm test -- --ci
            fi
          '''
        }
      }
    }

    stage('Deploy backend') {
      steps {
        sshagent(credentials: ['ec2-ssh-key']) {
          sh '''#!/usr/bin/env bash
set -euo pipefail

SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
REMOTE="ubuntu@${EC2_HOST}"

# 원격 EC2에 API 디렉토리 준비
ssh $SSH_OPTS "$REMOTE" "mkdir -p '${REMOTE_DIR}/api'"

# api 코드 동기화 (민감/불필요 파일 제외)
rsync -az --delete \
  --exclude='node_modules/' \
  --exclude='.git/' \
  --exclude='.env*' \
  --exclude='coverage/' \
  --exclude='.DS_Store' \
  -e "ssh $SSH_OPTS" \
  api/ "$REMOTE:${REMOTE_DIR}/api/"

# 원격 설치 & PM2 재시작
ssh $SSH_OPTS "$REMOTE" "bash -lc '
  set -e
  REMOTE_DIR=\"${REMOTE_DIR}\"
  APP_NAME=\"${APP_NAME}\"

  cd \"$REMOTE_DIR/api\"

  # nvm 있으면 Node 20 사용 시도(없으면 무시)
  if [ -s \"\\$HOME/.nvm/nvm.sh\" ]; then
    . \"\\$HOME/.nvm/nvm.sh\"
    nvm use 20 >/dev/null 2>&1 || true
  fi

  npm ci --omit=dev
  command -v pm2 >/dev/null 2>&1 || npm i -g pm2
  pm2 restart \"\\$APP_NAME\" || pm2 start app.js --name \"\\$APP_NAME\"
  pm2 save || true
'"
'''
        }
      }
    }

    stage('Seed Data') {
      when { expression { return params.SEED_DATA } }
      steps {
        sshagent(credentials: ['ec2-ssh-key']) {
          sh '''#!/usr/bin/env bash
set -e
SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
REMOTE="ubuntu@${EC2_HOST}"

ssh $SSH_OPTS "$REMOTE" "bash -lc '
  set -e
  cd ${REMOTE_DIR}/api/lib
  if [ -s \"$HOME/.nvm/nvm.sh\" ]; then
    . \"$HOME/.nvm/nvm.sh\"
    nvm use 20 >/dev/null 2>&1 || nvm use 18 >/dev/null 2>&1 || true
  fi
  echo \"Running seed scripts...\"
  node initUserData.js
  node initPostData.js
  node initSavedPostData.js
  node initChatMessage.js
'"
'''
        }
      }
    }
  }

  post {
    success { echo '배포 성공' }
    failure { echo '배포 실패' }
    always  { cleanWs() } // 워크스페이스 정리(민감파일 잔존 방지)
  }
}
