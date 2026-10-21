pipeline {
  agent any
  tools { nodejs 'Node22' }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Backend install and syntax') {
      steps {
        dir('backend') {
          bat 'npm ci'
          bat 'node --check server.js'
        }
      }
    }
    stage('Frontend install and production build') {
      steps {
        dir('frontend') {
          bat 'npm ci'
          bat 'npm run build'
        }
      }
    }
  }
}
