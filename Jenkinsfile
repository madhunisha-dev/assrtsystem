pipeline {
    agent any
    stages {
        stage('Checkout v1 Code') {
            steps {
                git branch: 'v1', url: 'https://github.com/madhunisha-dev/asset-system.git'
            }
        }
        stage('Build Docker Image') {
            steps {
                script {
                    dockerImage = docker.build("madhunisha23/asset-system:v1")
                }
            }
        }
        stage('Push to DockerHub') {
            steps {
                script {
                    docker.withRegistry('https://index.docker.io/v1/', 'dockerhub-credentials') {
                        dockerImage.push("v1")
                    }
                }
            }
        }
    }
}