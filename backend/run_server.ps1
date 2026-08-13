$ErrorActionPreference = "Stop"

$MavenDir = "apache-maven-3.9.6"
$MavenZip = "maven.zip"

if (-Not (Test-Path $MavenDir)) {
    Write-Host "Maven not found. Downloading Portable Maven..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip" -OutFile $MavenZip
    Write-Host "Extracting Maven..." -ForegroundColor Cyan
    Expand-Archive -Path $MavenZip -DestinationPath "." -Force
    Remove-Item $MavenZip -Force
}

Write-Host "Starting Spring Boot Backend..." -ForegroundColor Green
$env:JAVA_HOME = "C:\Program Files\Android\Android Studio\jbr"
& "$MavenDir\bin\mvn.cmd" spring-boot:run
