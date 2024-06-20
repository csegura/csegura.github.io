+++
title = 'Docker Root (work notes)'
date = 2022-07-14T05:17:17+01:00
draft = false
tags = ['docker']
+++

# Procedure

To relocate the Docker root directory, complete the following steps as root or a user with “sudo all” authority:

Stop the Docker services:

```sh
sudo -i

systemctl stop docker
systemctl stop docker.socket
systemctl stop containerd
```

Create the necessary directory structure into which to move Docker root by running the following command. This directory structure must reside on a file system with at least 50 GB free disk space. Significantly more disk space might be required depending on your daily ingestion volumes and data retention policy.

```sh
mkdir -p /data
```

Move Docker root to the new directory structure:

```sh
sudo mv /var/lib/docker /data
```

Edit the file /etc/docker/daemon.json. If the file does not exist, create the file by running the following command:

```sh
sudo vim /etc/docker/daemon.json
```

Add the following information to this file:

```sh
{
  "data-root": "/data/docker"
}
```

After the /etc/docker/daemon.json file is saved and closed, restart the Docker services:

```sh
sudo systemctl start docker
```

After you run the command, all Docker services through dependency management will restart.
Validate the new Docker root location:

```sh
docker info -f '{{ .DockerRootDir}}'
```

# Setup

```sh
sudo apt install docker.io
```

To create the docker group and add your user:

Add your user to the docker group.
```sh
sudo usermod -aG docker ${USER}
```
You would need to loog out and log back in so that your group membership is re-evaluated or type the following command:
```sh
su -s ${USER}
```
Verify that you can run docker commands without sudo.