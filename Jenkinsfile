pipeline {
    agent any

    environment {
        SONARQUBE = 'sonarqube'
    }

    stages {

        stage('SAST') {
            steps {
                sh 'semgrep --config ./semgrep-rules/last-user-is-root --config p/docker --config p/nodejsscan --config p/javascript --config p/owasp-top-ten --config p/secrets --json --output semgrep-result.json .'
            }
        }

        stage('Archive Results') {
            steps {
                 archiveArtifacts artifacts: 'semgrep-result.json', fingerprint: true

            }
        }


        stage('Sonarqube') {
            steps {
                withSonarQubeEnv("${env.SONARQUBE}") {
                    sh '''
                        sonar-scanner \
                          -Dsonar.host.url="$SONAR_HOST_URL" \
                          -Dsonar.login="$SONAR_AUTH_TOKEN"
                    '''
                }
            }
        }

        // stage('Quality Gate') {
        //   steps {
        //     timeout(time: 5, unit: 'MINUTES') {
        //     script {
        //             def qualityGate = waitForQualityGate()
        //             if (qualityGate.status != 'OK') {
        //                  echo "Quality Gate failed with status: ${qualityGate.status}. Skipping failure as per configuration."
        //               } else {
        //                  echo "Quality Gate passed."
        //              }
        //            }
        //        }
        //     }
        // }
        // stage('Secrets Check') {
        //    steps { 
        //        sh 'gitleaks detect --source . --report-format json --report-path gitleaks-report.json || true'
               
        //    }
        // }
        // stage('Archive Results') {
        //     steps {
        //          archiveArtifacts artifacts: 'gitleaks-report.json', fingerprint: true

        //     }
        // }


        // stage('Audit') {
        //     steps {
        //         sh 'npm audit --audit-level=high > audit-result.txt || true'
        //     }
        // }

        // stage('Archive Results') {
        //     steps {
        //          archiveArtifacts artifacts: 'audit-result.txt', fingerprint: true

        //     }
        // }
    }
}
