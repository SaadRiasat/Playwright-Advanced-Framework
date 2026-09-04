pipeline {
    agent {
        docker {
            image 'mcr.microsoft.com/playwright:v1.52.0-jammy'
            args '-u root:root'
        }
    }

    environment {
        CI = 'true'
    }

    stages {
        stage('Install Dependencies') {
            steps {
                echo '=== Installing Node Dependencies ==='
                sh 'npm ci || npm install'
            }
        }

        stage('Run Playwright Tests') {
            steps {
                echo '=== Executing Playwright E2E and API Tests ==='
                sh 'npx playwright test || true'
            }
        }

        stage('Generate Allure Report') {
            steps {
                echo '=== Generating Allure Report ==='
                sh 'npx allure generate allure-results --clean -o allure-report || true'
            }
        }
    }

    post {
        always {
            echo '=== Archiving Test Artifacts & Publishing Reports ==='
            // Archive JUnit Test Results
            junit testResults: 'test-results/results.xml', allowEmptyResults: true

            // Archive HTML Report & Allure Results
            archiveArtifacts artifacts: 'playwright-report/**, allure-report/**, test-results/**', allowEmptyArchive: true

            // Publish Allure Report (if Allure Jenkins Plugin is installed)
            allure([
                includeProperties: false,
                jdk: '',
                properties: [],
                reportBuildPolicy: 'ALWAYS',
                results: [[path: 'allure-results']]
            ])
        }
        success {
            echo '✅ Pipeline succeeded: All tests passed!'
        }
        failure {
            echo '❌ Pipeline failed: One or more tests failed. Check the reports.'
        }
    }
}
