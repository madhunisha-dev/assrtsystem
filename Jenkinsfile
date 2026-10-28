
pipeline {
    agent any

    environment {
        DOCKER_EXE = 'C:\\Users\\madhu\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe'
        DOCKER_CONFIG = "${WORKSPACE}\\.docker-config"
        IMAGE_NAME = 'madhunisha23/asset-system:v1'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Check Node.js') {
            steps {
                bat 'node --version'
                bat 'npm --version'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat '"%DOCKER_EXE%" build -t "%IMAGE_NAME%" .'
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKERHUB_USERNAME',
                        passwordVariable: 'DOCKERHUB_TOKEN'
                    )
                ]) {
                    bat '''
                        if not exist "%DOCKER_CONFIG%" mkdir "%DOCKER_CONFIG%"
                        powershell -NoProfile -ExecutionPolicy Bypass -Command "$env:DOCKERHUB_TOKEN | & $env:DOCKER_EXE login --username $env:DOCKERHUB_USERNAME --password-stdin"
                    '''
                }
            }
        }

        stage('Push Docker Image') {
            steps {
                bat '"%DOCKER_EXE%" push "%IMAGE_NAME%"'
            }
        }
    }

    post {
        always {
            bat '''
                if exist "%DOCKER_CONFIG%" rmdir /s /q "%DOCKER_CONFIG%"
            '''
        }
    }
}
