+++
title = 'Synology Docker ssh context error'
date = 2012-02-01T00:00:00+01:00
draft = false
tags = ['synology']
+++


## Enable homes
Modify sshd_config

```
Match User romheat 
    AllowTcpForwarding yes

PermitUserEnvironment yes
```

## Workarround ssh context error

```sh
■ docker ps
error during connect: Get "http://docker/v1.24/containers/json": 
command [ssh -l xxxx -- nas docker system dial-stdio] has exited with exit status 127, please make sure the URL is valid, 
and Docker 18.09 or later is installed on the remote host: stderr=sh: docker: command not found


user@sputnik | ~/tmp/abb 
■ ssh nas 'echo $PATH'
/usr/bin:/bin:/usr/sbin:/sbin

user@sputnik | ~/tmp/abb 
■ ssh nas

Synology strongly advises you not to run commands as the root user, who has
the highest privileges on the system. Doing so may cause major damages
to the system. Please note that if you choose to proceed, all consequences are
at your own risk.

user@CSSNAS:~$ ls
user@CSSNAS:~$ ls -la
total 0
drwxrwxrwx+ 1 user users  8 Sep 25 17:54 .
drwxrwxrwx+ 1 root    root  54 Sep 25 17:52 ..
drwxrwxrwx+ 1 user users 30 Sep 25 17:54 .ssh
user@CSSNAS:~$ ls .ssh
authorized_keys
user@CSSNAS:~$ echo $PATH
/sbin:/bin:/usr/sbin:/usr/bin:/usr/syno/sbin:/usr/syno/bin:/usr/local/sbin:/usr/local/bin
user@CSSNAS:~$ echo PATH=$PATH  >> ~/.ssh/environment
user@CSSNAS:~$ cat .ssh/environment 
PATH=/sbin:/bin:/usr/sbin:/usr/bin:/usr/syno/sbin:/usr/syno/bin:/usr/local/sbin:/usr/local/bin
```


```sh
user@CSSNAS:/etc$ sudo synogroup --add docker
Group Name: [docker]
Group Type: [AUTH_LOCAL]
Group ID:   [65536]
Group Members: 
user@CSSNAS:/etc$ sudo synogroup --member docker user,root
Group Name: [docker]
Group Type: [AUTH_LOCAL]
Group ID:   [65536]
Group Members: 
0:[user]
1:[root]
user@CSSNAS:/etc$ sudo synogroup --member docker root
Group Name: [docker]
Group Type: [AUTH_LOCAL]
Group ID:   [65536]
Group Members: 
0:[root]
user@CSSNAS:/etc$ sudo chown root:docker /var/run/docker.sock

sudo synopkg restart Docker

```