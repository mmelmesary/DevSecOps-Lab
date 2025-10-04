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


