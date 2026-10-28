
pipeline {
    agent any

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
                bat '"C:\\Users\\madhu\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" build -t madhunisha23/asset-system:v1 .'
            }
        }

        stage('Push Docker Image') {
            steps {
                bat '"C:\\Users\\madhu\\AppData\\Local\\Programs\\DockerDesktop\\resources\\bin\\docker.exe" push madhunisha23/asset-system:v1'
            }
        }
    }
}
