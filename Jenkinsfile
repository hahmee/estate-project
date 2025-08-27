pipeline {
  agent any

  tools { nodejs 'nodejs-18.17.0' }

  options {
    timeout(time: 20, unit: 'MINUTES')
    ansiColor('xterm')
  }

  environment {
    SSH_KEY_ID = 'ec2-ssh-key'
    EC2_HOST   = credentials('EC2_HOST_TEXT')
    APP_NAME   = 'estate-project'
    REMOTE_DIR = "/var/www/${APP_NAME}"
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

    stage('Test') {
      steps {
        // 필요 시 각 디렉토리에서 테스트 실행
        dir('client') { sh 'npm test -- --ci || true' }
        dir('api')    { sh 'npm ci && npm test -- --ci || true' }
      }
    }

    stage('Deploy') {
      steps {
        sshagent(credentials: [env.SSH_KEY_ID]) {
          sh """
            # 0) 원격 디렉토리 준비
            ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} 'mkdir -p ${REMOTE_DIR}/client ${REMOTE_DIR}/api'

            # 1) client 빌드 산출물 배포 (CRA 기준: client/build/*)
            scp -r client/build/* ubuntu@${EC2_HOST}:${REMOTE_DIR}/client/

            # 2) api 코드 동기화 & 의존성 설치 & PM2 재시작
            ssh -o StrictHostKeyChecking=no ubuntu@${EC2_HOST} bash -lc '
              set -e

              # 레포 없음 -> 초기 클론, 있으면 업데이트
              if [ -d ${REMOTE_DIR}/.git ]; then
                cd ${REMOTE_DIR}
                git fetch --all
                git reset --hard origin/master
              else
                rm -rf ${REMOTE_DIR}/* || true
                git clone --branch master https://github.com/hahmee/estate-project.git ${REMOTE_DIR}
              fi

              # api 배포
              cd ${REMOTE_DIR}/api
              npm ci --omit=dev

              # PM2로 API 실행 (엔트리 파일명이 app.js라고 가정)
              pm2 restart app.js --name ${APP_NAME} || pm2 start app.js --name ${APP_NAME}
              pm2 save || true
            '
          """
        }
      }
    }
  }

  post {
    success { echo '배포 성공' }
    failure { echo '배포 실패' }
  }
}
