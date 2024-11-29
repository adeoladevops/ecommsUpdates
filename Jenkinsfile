pipeline {
    agent any
    environment {
        DEPLOY_USER = 'ubuntu'
        DEPLOY_HOST = '18.215.164.164'
        REPO_DIR = '/var/www/ecomms'
        NGINX_CONF = '/etc/nginx/sites-available/ecomms'
    }
    stages {
        stage('Checkout Code') {
            steps {
                echo 'Cloning the repository...'
                git branch: 'master', url: 'https://github.com/adeoladevops/ecomms.git'
                sh 'ls -l'
            }
        }
        stage('Build') {
            steps {
                echo 'Installing dependencies and building the application...'
                sh '''
                    npm install
                    npm install --save-dev jest
                    npm run build
                '''
            }
        }
        stage('Test') {
            steps {
                echo 'Checking for test.sample.js in the root directory...'
                script {
                    if (fileExists('test.sample.js')) {
                        echo 'Running tests...'
                        sh 'npm test'
                    } else {
                        echo 'No test.sample.js file found. Skipping Test stage.'
                    }
                }
            }
        }
        stage('Package') {
            steps {
                echo 'Packaging files for deployment...'
                sh '''
                    mkdir -p package
                    cp package.json package/
                    if [ -d build ]; then
                        cp -R build/ package/
                    else
                        echo "No build directory; copying app files"
                        cp -R *.js *.json public/ views/ package/
                    fi
                    ls -l package/
                '''
            }
        }
        stage('Deploy') {
            steps {
                echo 'Deploying application to EC2 instance...'
                sshagent(['e41a1d7c-d06c-4740-aa10-2b73944215ee']) {
                    sh '''
                        ssh $DEPLOY_USER@$DEPLOY_HOST "sudo mkdir -p ${REPO_DIR}"
                        rsync -avz package/ $DEPLOY_USER@$DEPLOY_HOST:${REPO_DIR}
                        ssh $DEPLOY_USER@$DEPLOY_HOST "ls -l ${REPO_DIR}"
                    '''
                }
            }
        }
        stage('Configure nginx') {
            steps {
                echo 'Configuring nginx...'
                sshagent(['e41a1d7c-d06c-4740-aa10-2b73944215ee']) {
                    sh '''
                        ssh $DEPLOY_USER@$DEPLOY_HOST "sudo tee $NGINX_CONF > /dev/null << 'EOF'
server {
    listen 80;
    server_name $DEPLOY_HOST;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \\$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \\$host;
        proxy_cache_bypass \\$http_upgrade;
    }
}
EOF
                        "

                        # Enable the nginx configuration
                        ssh $DEPLOY_USER@$DEPLOY_HOST "sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/ecomms"

                        # Test nginx configuration
                        ssh $DEPLOY_USER@$DEPLOY_HOST "sudo nginx -t"

                        # Reload nginx to apply changes
                        ssh $DEPLOY_USER@$DEPLOY_HOST "sudo systemctl reload nginx"
                    '''
                }
            }
        }
    }
    post {
        always {
            echo 'Pipeline completed.'
        }
        success {
            echo 'Pipeline executed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check logs for more details.'
        }
    }
}
