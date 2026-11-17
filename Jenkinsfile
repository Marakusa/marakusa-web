pipeline {
    agent any

    environment {
        IMAGE   = 'marakusa/marakusa-web'
        // BUILD_NUMBER is counted per branch, so only prod gets plain numeric tags (used for rollback
        // and cleanup). Other branches get a prefixed tag; Docker tags allow only [A-Za-z0-9_.-].
        TAG     = "${env.BRANCH_NAME == 'prod' ? env.BUILD_NUMBER : 'branch-' + env.BRANCH_NAME.replaceAll('[^A-Za-z0-9_.-]', '-') + '-' + env.BUILD_NUMBER}"
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
                // Only prod gets :latest (tagged in Push, after a healthy deploy), so a branch/PR build can never become what a
                // plain `docker compose up -d` (TAG unset -> latest) starts on this VPS
                sh 'docker build -t $IMAGE:$TAG .'
            }
        }

        stage('Deploy') {
            when { branch 'prod' }
            steps {
                // Jenkins runs on the VPS, so the image built above is already local.
                // If the new container doesn't answer within ~60s, roll back to the image that was
                // running before and fail the build.
                sh '''
                    healthy() {
                        for i in $(seq 1 30); do
                            curl -fsS -o /dev/null http://127.0.0.1:3000/ && return 0
                            sleep 2
                        done
                        return 1
                    }

                    # Image the currently running container uses, e.g. marakusa/marakusa-web:41 (empty on first deploy)
                    CID=$($COMPOSE ps -q web || true)
                    PREV_IMAGE=$([ -n "$CID" ] && docker inspect --format '{{.Config.Image}}' "$CID" || true)
                    echo "Currently running: ${PREV_IMAGE:-nothing}"

                    # Jenkins runs sh with -e; keep compose inside the if so a failed start still rolls back
                    if TAG="$TAG" $COMPOSE up -d --remove-orphans && healthy; then
                        echo "Deployed $IMAGE:$TAG"
                        exit 0
                    fi

                    echo "New container did not become healthy; recent logs:"
                    $COMPOSE logs --tail=50 web

                    if [ -n "$PREV_IMAGE" ]; then
                        echo "Rolling back to $PREV_IMAGE"
                        TAG="${PREV_IMAGE##*:}" $COMPOSE up -d --remove-orphans && healthy && echo "Rollback to $PREV_IMAGE is healthy" \
                            || echo "Rollback to $PREV_IMAGE is NOT healthy either; manual action needed"
                    else
                        echo "No previous container to roll back to"
                    fi
                    exit 1
                '''
            }
        }

        stage('Push') {
            // Only runs after a healthy deploy, so :latest (here and on Docker Hub) is always a known-good build
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
    }

    post {
        always {
            sh 'docker logout || true'
            // Branch/PR images only verify that the build works; don't keep them on the VPS
            sh '[ "$BRANCH_NAME" = prod ] || docker rmi "$IMAGE:$TAG" || true'
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
