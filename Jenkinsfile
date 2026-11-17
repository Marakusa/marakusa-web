pipeline {
    agent any

    environment {
        IMAGE   = 'marakusa/marakusa-web'
        TAG     = "${env.BUILD_NUMBER}"
        COMPOSE = 'docker compose -p marakusa-web -f deploy/docker-compose.yml'
    }

    options {
        disableConcurrentBuilds()   // never run two deploys at once
        buildDiscarder(logRotator(numToKeepStr: '20'))
    }

    stages {
        stage('Build') {
            steps {
                // Runs npm ci, the type check and the Vite build inside Docker
                // Only prod gets :latest (tagged in Push), so a branch/PR build can never become what a
                // plain `docker compose up -d` (TAG unset -> latest) starts on this VPS
                sh 'docker build -t $IMAGE:$TAG .'
            }
        }

        stage('Push') {
            // Only deploy from prod (updated by merging a PR)
            when { branch 'prod' }
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub',
                        usernameVariable: 'DH_USER', passwordVariable: 'DH_TOKEN')]) {
                    sh 'echo "$DH_TOKEN" | docker login -u "$DH_USER" --password-stdin'
                    sh 'docker tag $IMAGE:$TAG $IMAGE:latest'
                    sh 'docker push $IMAGE:$TAG && docker push $IMAGE:latest'
                }
            }
        }

        stage('Deploy') {
            when { branch 'prod' }
            steps {
                // Jenkins runs on the VPS, so the image built above is already local
                // TAG comes from the environment block; pass it explicitly so the exact build is deployed
                sh 'TAG="$TAG" $COMPOSE up -d --remove-orphans'

                // Fail the build if the new container doesn't answer within ~60s
                sh '''
                    for i in $(seq 1 30); do
                        if curl -fsS -o /dev/null http://127.0.0.1:3000/; then
                            echo "Deployed $IMAGE:$TAG"
                            exit 0
                        fi
                        sleep 2
                    done
                    echo "New container did not become healthy; recent logs:"
                    $COMPOSE logs --tail=50 web
                    exit 1
                '''
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
        success {
            // Keep the 5 newest numbered images for rollback; remove older ones and build cache
            sh '''
                docker images "$IMAGE" --format '{{.Tag}}' | grep -E '^[0-9]+$' | sort -n | head -n -5 \
                    | xargs -r -I{} docker rmi "$IMAGE:{}" || true
                docker image prune -f || true
                docker builder prune -f --filter until=168h || true
            '''
        }
    }
}
