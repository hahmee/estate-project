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
    REMOTE_DIR = "/home/ubuntu/apps/${APP_NAME}" // 홈 폴더 배포
  }

  stages {
    stage('Checkout') {
      steps {
          checkout scm
//         git branch: 'master', url: 'https://github.com/hahmee/estate-project.git'
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

//     stage('Test') {
//       steps {
//         // 필요 시 각 디렉토리에서 테스트 실행
//         dir('client') { sh 'npm test -- --ci || true' }
//         dir('api')    { sh 'npm ci && npm test -- --ci || true' }
//       }
//     }

     stage('Deploy') {
          steps {
            sshagent(credentials: ['ec2-ssh-key']) {
             sh '''
                    set -e
                    echo "[DEBUG] ssh-agent identities:"
                    ssh-add -l || true
                    SSH_OPTS="-o StrictHostKeyChecking=no -o IdentitiesOnly=yes -v"
                    ssh $SSH_OPTS ubuntu@${EC2_HOST} 'echo OK && whoami && hostname'
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
