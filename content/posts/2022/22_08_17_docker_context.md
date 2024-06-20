+++
title = 'Docker Context (work notes)'
date = 2022-08-17T05:17:17+01:00
draft = false
tags = ['docker', 'ssh']
+++

# Working on remote Docker Host using docker context 

## SSH keys

In order to use remote Docker host, as a prerequisite you need SSH enabled (required login using SSH keys).

### Generate or find your public SSH key

If the file does not exist, generate the SSH key-pair using following command

```sh
ssh-keygen -t rsa -b 4096
```

## Setting up SSH keys to remote machine

### Copying your public ssh key to machine

You can use password-based authentication to get into linux machine for the first time, and then use the following command:

```sh
echo your_public_ssh_key >> ~/.ssh/authorized_keys
ssh-copy-id -i ~/.ssh/id_rsa.pub root@agora
```

### Adding permissions 

```sh
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

## Docker Context setup

### Set a docker context 
with: 
```sh
docker context create agora --docker host=ssh://root@agora
```

### Switch to context: 

```sh
docker context use agora
```

### Enviroment var

```
DOCKER_HOST="ssh://root@agora

$ENV:DOCKER_HOST = 'ssh://root@192.168.1.200' (windows)
```