
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
                bat 'docker build -t madhunisha23/asset-system:v1 .'
            }
        }

        stage('Push Docker Image') {
            steps {
                bat 'docker push madhunisha23/asset-system:v1'
            }
        }
    }
}
