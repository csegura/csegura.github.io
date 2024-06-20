+++
title = 'Portera'
date = 2020-05-30T00:00:00+01:00
tags = ['nodejs', 'javascript', 'logging', 'web']
+++

# portera 🚀


> **portera**🚀 provides remote logs for you node apps with an awesome style :).

**portera** has two parts, a library that wrap your console object by default, redirecting the output to **portera** server, its receive your data and serve a web page where you can display an awesome output, just like that

![Sample Web](https://github.com/csegura/portera/raw/master/docs/portera_web_0-1-1.gif)

## Installation

[github](https://github.com/csegura/portera)

## Motivation

These days I spent more time at home by corona quarantine, time to practice and learn new things. I began to do a sample project in node for the company where I work, it was something that I had have in my mind time ago. The project its a middleware between our different management programs and third part applications, this middleware should contain all bussiness logic necesary by thrird part systems.

When I had this part finished, I was adding a GraphQL interface to learn about it. Then I had a lot of api queries and results from my program and I needed inspect then, to understand how queries were formed and verify the results.

Then I had another problem, it was that I had only my laptop and it have a little screen, between the code editor and browser I didn´t have enaugh screen to show everything. Then I thought that I could use my tablet as a remote log viewer, and here is the result !!!

