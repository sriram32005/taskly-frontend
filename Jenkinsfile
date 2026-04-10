pipeline {
    agent any

    environment {
        DOCKERHUB_USER = "sriram32005"
        IMAGE_NAME = "taskly-frontend"
        IMAGE_TAG = "latest"
        CONTAINER_NAME = "taskly-frontend"
    }

    stages {

        stage('Clone Repo') {
            steps {
                checkout scm
            }
        }

        stage('Build Image') {
            steps {
                sh 'docker build --build-arg NEXT_PUBLIC_API_URL=http://98.91.115.68:8085 -t $DOCKERHUB_USER/$IMAGE_NAME:$IMAGE_TAG .'
            }
        }

        stage('Login Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh 'echo $PASS | docker login -u $USER --password-stdin'
                }
            }
        }

        stage('Push Image') {
            steps {
                sh 'docker push $DOCKERHUB_USER/$IMAGE_NAME:$IMAGE_TAG'
            }
        }

        stage('Deploy (Local EC2)') {
            steps {
                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true

                docker run -d -p 80:3000 \
                  --name $CONTAINER_NAME \
                  --restart always \
                  -e NEXT_PUBLIC_API_URL=http://98.91.115.68:8085 \
                  --network bridge \
                  $DOCKERHUB_USER/$IMAGE_NAME:$IMAGE_TAG
                '''
            }
        }
    }

    post {
        success {
            echo "Deployment Successful"
        }
        failure {
            echo "Deployment Failed"
        }
    }
}