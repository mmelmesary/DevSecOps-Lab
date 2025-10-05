## First: setup the lab Infrastructure


[1] In order to execute Docker commands inside Jenkins nodes, download and run the docker:dind Docker image using the following

```bash
docker run \
  --name jenkins-docker \
  --rm \
  --detach \
  --privileged \
  --network jenkins \
  --network-alias docker \
  --env DOCKER_TLS_CERTDIR=/certs \
  --volume jenkins-docker-certs:/certs/client \
  --volume jenkins-data:/var/jenkins_home \
  --publish 2376:2376 \
  docker:dind \
  --storage-driver overlay2
```
[2] Build a new docker image from the Dockerfile inside jenkins folder, and assign the image a meaningful name, such as "myjenkins-blueocean:2.516.3-1":

> this dockerfile contains the instaruture needed to install jenkins machine and other additional tools such: SonarQube Scanner CLI, Node.js 20, npm, Semgrep, NodeJsScan, Gitleaks, hadolint

```bash
cd Setup/jenkins
docker build -t myjenkins-blueocean:2.516.3-1 .
```


[3] Run your own myjenkins-blueocean:2.516.3-1 image as a container in Docker using the following docker run command:

```bash
docker run \
  --name jenkins-blueocean \
  --restart=on-failure \
  --detach \
  --network jenkins \
  --env DOCKER_HOST=tcp://docker:2376 \  # this will connect to the docker host in the bind container
  --env DOCKER_CERT_PATH=/certs/client \
  --env DOCKER_TLS_VERIFY=1 \
  --publish 8080:8080 \
  --publish 50000:50000 \
  --volume jenkins-data:/var/jenkins_home \
  --volume jenkins-docker-certs:/certs/client:ro \
  myjenkins-blueocean:2.516.3-1
```

___

# Second: Configuration

Automatic interruption of your pipeline in case the quality gate 

With the Jenkins extension, you can configure that your pipeline job fails in case the quality gate computed by SonarQube Server for your project fails. To do so, the extension makes webhook available: a webhook call must be configured in SonarQube Server to call back into Jenkins to allow the pipeline to continue or fail.  

**The figure below illustrates the process:**

1. A Jenkins Pipeline job is started.

2. The job triggers the analysis by the SonarScanner.

3. The SonarScanner sends the results to SonarQube Server.

4. SonarQube Server completes the analysis, computes the quality gate configured for the project, and checks if the project fails or passes the quality gate.

5. SonarQube Server sends the pass or failure result back to the Jenkins webhook exposed by the Jenkins extension.

6. The pipeline job continues (in case of a pass) or fails (otherwise)

![soanarqube-integartion](https://docs.sonarsource.com/~gitbook/image?url=https%3A%2F%2Fcontent.gitbook.com%2Fcontent%2F8MaL7qHHph0mwB0jcBjB%2Fblobs%2FT2wqUToHs5WyX9u1UkhK%2Fjenkins-integration.png&width=768&dpr=4&quality=100&sign=af561954&sv=2)

### Installing the Jenkins extension

> Jenkins extension version 2.11 or later is required.

**Proceed as follows:**

- From the Jenkins Dashboard, navigate to Manage Jenkins > Manage Plugins and install the SonarQube Scanner plugin.

- Back at the Jenkins Dashboard, navigate to Credentials > System from the left navigation.

- Click the Global credentials (unrestricted) link in the System table.

- Click Add credentials in the left navigation and add the following information:

  - Kind: Secret Text

  - Scope: Global

  - Secret: Generate a token at User > My Account > Security in SonarQube Server, and copy and paste it here.

- Click OK.

- From the Jenkins Dashboard, navigate to **Manage Jenkins** > **Configure System.**

- From the **SonarQube Servers** section, click Add SonarQube. Add the following information:

  - Name: Give a unique name to your SonarQube Server instance.

  - Server URL: Your SonarQube Server instance URL.

  - Credentials: Select the credentials created during step 4.

- Click Save


