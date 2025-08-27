pipeline {
  agent any

  tools { nodejs 'NodeJS 18.17.0' }

  options {
    timeout(time: 20, unit: 'MINUTES')
    ansiColor('xterm')
  }

  environment {
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

    stage('Deploy') {
      steps {
        sshagent(credentials: ['ec2-ssh-key']) {
          sh '''#!/usr/bin/env bash
set -euo pipefail

SSH_OPTS="-o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
REMOTE="ubuntu@${EC2_HOST}"

# 원격 디렉토리 준비
ssh $SSH_OPTS "$REMOTE" "mkdir -p '${REMOTE_DIR}/client' '${REMOTE_DIR}/api'"

# client 정적파일 동기화
rsync -az --delete -e "ssh $SSH_OPTS" client/dist/ "$REMOTE:${REMOTE_DIR}/client/"

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
