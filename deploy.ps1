# NestJS GCP Cloud Run 배포 스크립트
param(
  [string]$Project = "nestjs-478211",
  [string]$Region  = "us-central1",
  [string]$Service = "nestjs-app",
  [string]$Repository = "nestjs-repo"
)

# 1) 태그 생성 (현재 시각 기반)
$TAG = Get-Date -Format "yyyyMMdd-HHmmss"

# 2) gcloud 경로 설정
$GCLOUD = "C:\Users\bomin\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"

# 3) 프로젝트 번호 가져오기
Write-Host "▶ Getting project number..."
$PN = & $GCLOUD projects describe $Project --format "value(projectNumber)"
$RUNTIME_SA = "$PN-compute@developer.gserviceaccount.com"
Write-Host "   Project Number: $PN"
Write-Host "   Runtime Service Account: $RUNTIME_SA"

# 4) Artifact Registry 리포지토리 확인 및 생성
Write-Host "▶ Checking Artifact Registry repository..."
try {
    & $GCLOUD artifacts repositories describe $Repository --location=$Region --format="value(name)" | Out-Null
    Write-Host "   Repository '$Repository' exists"
} catch {
    Write-Host "   Creating repository '$Repository'..."
    & $GCLOUD artifacts repositories create $Repository `
        --repository-format=docker `
        --location=$Region `
        --description="NestJS application repository"
    Write-Host "   Repository created"
}

# 5) Docker 인증 설정
Write-Host "▶ Configuring Docker authentication..."
& $GCLOUD auth configure-docker "$Region-docker.pkg.dev" | Out-Null

# 6) 도커 빌드 & 푸시
$IMAGE = "$Region-docker.pkg.dev/$Project/$Repository/${Service}:${TAG}"
$IMAGE_LATEST = "$Region-docker.pkg.dev/$Project/$Repository/${Service}:latest"

Write-Host "▶ Building Docker image (production target)..."
docker build --target production -t $IMAGE -t $IMAGE_LATEST .

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "▶ Pushing Docker image..."
docker push $IMAGE
docker push $IMAGE_LATEST

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Docker push failed!" -ForegroundColor Red
    exit 1
}

# 7) env.yaml을 Cloud Run 형식으로 변환
Write-Host "▶ Reading environment variables from env.yaml..."
$envVars = @{}

if (Test-Path "env.yaml") {
    $yamlContent = Get-Content "env.yaml" -Raw
    $yamlContent -split "`n" | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line -match '^([^:]+):\s*"?(.+?)"?\s*$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim().Trim('"')
            # Cloud Run 환경 변수에서 제외할 키들
            if ($key -notin @("PROJECT_ID", "REGION", "SERVICE_NAME", "REPOSITORY_NAME")) {
                $envVars[$key] = $value
            }
        }
    }
} else {
    Write-Host "⚠️  env.yaml file not found, using default values" -ForegroundColor Yellow
}

# 환경 변수 문자열 생성
$envVarsString = ($envVars.GetEnumerator() | ForEach-Object { "$($_.Key)=$($_.Value)" }) -join ","

# 8) Cloud Run 배포
Write-Host "▶ Deploying to Cloud Run..."
$deployArgs = @(
    "run", "deploy", $Service,
    "--image=$IMAGE",
    "--region=$Region",
    "--platform=managed",
    "--port=8080",
    "--service-account=$RUNTIME_SA",
    "--cpu=1",
    "--memory=512Mi",
    "--concurrency=80",
    "--min-instances=0",
    "--max-instances=3",
    "--timeout=300s",
    "--allow-unauthenticated"
)

# 환경 변수 설정
if ($envVarsString) {
    $deployArgs += "--set-env-vars=$envVarsString"
}

& $GCLOUD $deployArgs

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Cloud Run deployment failed!" -ForegroundColor Red
    exit 1
}

# 9) 배포된 서비스 URL 확인
Write-Host "▶ Getting service URL..."
$URL = & $GCLOUD run services describe $Service --region=$Region --format="value(status.url)"

Write-Host ""
Write-Host "✅ Deployment complete!" -ForegroundColor Green
Write-Host "🔗 Service URL: $URL" -ForegroundColor Cyan
Write-Host "📚 Swagger Docs: $URL/api/docs" -ForegroundColor Cyan
Write-Host "❤️  Health Check: $URL/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Image Tag: $TAG" -ForegroundColor Gray

