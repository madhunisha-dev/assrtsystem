pipeline {
    agent any
    stages {
        stage('Build Docker Image') {
            steps {
                bat 'docker build -t madhunisha-dev/asset-system:v1 .'
            }
        }
        stage('Push to DockerHub') {
            steps {
                bat 'docker push madhunisha-dev/asset-system:v1'
            }
        }
    }
}