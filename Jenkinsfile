pipeline {
  agent any

  tools { nodejs 'NodeJS 18.17.0' }

  options { 
    timeout(time: 20, unit: 'MINUTES')
    ansiColor('xterm')
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
  }

  stages {

    stage('Checkout') {
      steps {
            checkout scm
      }
    }

    stage('Build (client)') {
      steps {
        dir('client') {
          sh 'npm ci'
          sh 'npm run build'
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

    stage('Deploy backend') {
      steps {
        sshagent(credentials: ['ec2-ssh-key']) {
          sh '''#!/usr/bin/env bash
set -euo pipefail

SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
REMOTE="ubuntu@${EC2_HOST}"

# 원격 EC2에 API 디렉토리 준비
ssh $SSH_OPTS "$REMOTE" "mkdir -p '${REMOTE_DIR}/api'"

# api 코드 동기화 (node_modules 등 제외)
rsync -az --delete \
  --exclude node_modules --exclude .git --exclude .env --exclude .env.local --exclude coverage \
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
  }

  post {
    success { echo '배포 성공' }
    failure { echo '배포 실패' }
  }
}
