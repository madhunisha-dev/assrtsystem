pipeline {
    agent any
    stages {
        stage('Build Docker Image') {
            steps {
                bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" build -t madhunisha-dev/asset-system:v1 .'
            }
        }
        stage('Push to DockerHub') {
            steps {
                bat '"C:\\Program Files\\Docker\\Docker\\resources\\bin\\docker.exe" push madhunisha-dev/asset-system:v1'
            }
        }
    }
}