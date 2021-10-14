pipeline {
  agent any

  environment {
    Ali_OSS_KEY = credentials('Ali_OSS_KEY')
    Ali_OSS_SECRET = credentials('Ali_OSS_SECRET')
  }

  // tools {
  //   git "Git2.x"
  // }

  options {
    // 保留最近历史构建记录的数量
    buildDiscarder(logRotator(numToKeepStr: '8'))
    // 不允许同时执行 pipeline
    disableConcurrentBuilds()
    // 跳过默认的git Checkout
    skipDefaultCheckout()
    // 设置 pipeline 运行的超时时间
    timeout(time: 8, unit: 'MINUTES')
    // 在失败时, 重新尝试整个 pipeline 的指定次数
    // retry(3)
    // 控制台输出时间
    timestamps()
  }

  triggers {
    // Jenkins 会检查新的源代码更新。如果存在更改, pipeline 就会被重新触发
    pollSCM('H/5 * * * *')
  }

  // parameters {}

  stages {
    stage('Clone代码') {
      steps {
        checkout scm
      }
    }

    stage('编译dgiot_amis') {
      steps {
        sh 'yarn install --prefer-offline'
        // sh 'yarn cross-env TS_NODE_PROJECT="./build/webpack.tsconfig.json" ENABLE_CDN=true OSS_KEY="$Ali_OSS_KEY" OSS_SECRET="$Ali_OSS_SECRET" NODE_ENV=production webpack --config build/webpack.conf.ts'
      }
    }

    stage('编译server模块') {
      steps {
        dir('./server') {
          sh 'yarn install --prefer-offline'
        }
      }
    }

    stage('部署') {
      steps {
        withCredentials([sshUserPrivateKey(credentialsId: 'MSVC_SSH_SECRET', keyFileVariable: 'id_rsa')]) {
          sh 'ssh -i $id_rsa lizw@ssh.msvc.top -p 28822 "echo 远程执行"'
        }
      }
    }
  }

  post {
    always {
      echo '项目构建完成'
      emailext subject: "[Jenkins] ${currentBuild.fullDisplayName}",
      body: '${DEFAULT_CONTENT}',
      mimeType: 'text/html',
      replyTo: '1183409807@qq.com',
      to: 'lzw1000000@163.com,mlrsyz@vip.qq.com'
    }
  }
}
