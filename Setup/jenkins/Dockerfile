FROM jenkins/jenkins:2.516.3-jdk21

USER root

# Install system dependencies, Docker CLI, and Python
RUN apt-get update && apt-get install -y \
    lsb-release ca-certificates curl unzip gnupg software-properties-common \
    python3 python3-pip python3-venv build-essential \
    && install -m 0755 -d /etc/apt/keyrings \
    && curl -fsSL https://download.docker.com/linux/debian/gpg -o /etc/apt/keyrings/docker.asc \
    && chmod a+r /etc/apt/keyrings/docker.asc \
    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] \
    https://download.docker.com/linux/debian $(. /etc/os-release && echo \"$VERSION_CODENAME\") stable" \
    | tee /etc/apt/sources.list.d/docker.list > /dev/null \
    && apt-get update && apt-get install -y docker-ce-cli \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install SonarQube Scanner CLI
ENV SONAR_SCANNER_VERSION=7.2.0.5079
ENV SONAR_SCANNER_DIR=/opt/sonar-scanner

RUN curl -sL https://binaries.sonarsource.com/Distribution/sonar-scanner-cli/sonar-scanner-cli-${SONAR_SCANNER_VERSION}-linux-x64.zip -o sonar-scanner.zip && \
    unzip sonar-scanner.zip -d /opt && \
    mv /opt/sonar-scanner-${SONAR_SCANNER_VERSION}-linux-x64 ${SONAR_SCANNER_DIR} && \
    ln -s ${SONAR_SCANNER_DIR}/bin/sonar-scanner /usr/local/bin/sonar-scanner && \
    rm sonar-scanner.zip

# Install Node.js 20 (LTS) and npm
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get update && apt-get install -y nodejs && \
    node -v && npm -v

# Install Semgrep and NodeJsScan via pip
RUN pip3 install --break-system-packages semgrep nodejsscan

# Install Gitleaks
RUN apt-get install wget && wget https://github.com/gitleaks/gitleaks/releases/download/v8.27.2/gitleaks_8.27.2_linux_x64.tar.gz && tar xvf gitleaks_8.27.2_linux_x64.tar.gz && cp gitleaks /usr/local/bin/ && chmod a+x /usr/local/bin/gitleaks

# Install hadolint
RUN curl -sSL -o /usr/local/bin/hadolint \
      https://github.com/hadolint/hadolint/releases/latest/download/hadolint-Linux-x86_64 \
    && chmod +x /usr/local/bin/hadolint

# Install conftest
RUN curl -sSL -o conftest.tar.gz https://github.com/open-policy-agent/conftest/releases/download/v0.24.0/conftest_0.24.0_Linux_x86_64.tar.gz && \ 
    tar xvf conftest.tar.gz && \
    mv conftest /usr/local/bin/ && \
    chmod a+x /usr/local/bin/conftest

RUN curl -sSfL https://raw.githubusercontent.com/anchore/grype/main/install.sh | \
    sh -s -- -b /usr/local/bin

# Switch back to Jenkins user
USER jenkins

# Install Jenkins plugins
RUN jenkins-plugin-cli --plugins "blueocean docker-workflow json-path-api"
