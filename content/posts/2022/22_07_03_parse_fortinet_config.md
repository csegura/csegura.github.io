+++
title = 'Parse Fortinet Config'
date = 2022-07-03T00:00:00+01:00
tags = ['parser', 'fortinet', 'nodejs']
+++

Some times things that seems easy, tend to be more complicated than expected, and sometimes things that seems complicated, are actually easy. 

I love simplicity. Yeah !!

Sure that there is some law about how things tend to compexity, but I'm not going to talk about that. The thing is with the time, and security risks, netkork rules in this devices are getting more and more complex.

I have been working with Fortinet devices for a while, and I have to say that they are very good devices. They have a lot of features, and they are very secure. But, as I said before, the rules are getting more complex, and sometimes is difficult to understand what is happening in the device.

So, I decided to write a parser for the Fortinet configuration files, and draw the rules in a more human readable way.

If you read the config file, it seems a mess of commands with a lot of information. But studying the file, you can see that all is very simple, and the structure is very clear.

```js
config firewall policy
    edit 1
        set srcintf "port1"
        set dstintf "port2"
        set srcaddr "all"
        set dstaddr "all"
        set action accept
        set schedule "always"
        set service "ALL"
        set nat enable
        set logtraffic all
    next
    edit 2
        set srcintf "port1"
        set dstintf "port2"
        set srcaddr "all"
        set dstaddr "all"
        set action accept
        set schedule "always"
        set service "ALL"
        set nat enable
        set logtraffic all
    next
end
```
and can be converted into json

```json
{
    "firewall": {
        "policy": [
            {
                "id": 1,
                "srcintf": "port1",
                "dstintf": "port2",
                "srcaddr": "all",
                "dstaddr": "all",
                "action": "accept",
                "schedule": "always",
                "service": "ALL",
                "nat": "enable",
                "logtraffic": "all"
            },
            {
                "id": 2,
                "srcintf": "port1",
                "dstintf": "port2",
                "srcaddr": "all",
                "dstaddr": "all",
                "action": "accept",
                "schedule": "always",
                "service": "ALL",
                "nat": "enable",
                "logtraffic": "all"
            }
        ]
    }
}
```	    	

