+++
title = 'xsrv-web: An X11 Server Whose Screen Is a Web Page'
date = 2026-10-03
tags = ['linux', 'x11', 'rust', 'webassembly', 'docker', 'xsrv-web']
image = "/images/xsrv_web/xfce.png"
description = "xsrv-web is an X11 server written in Rust. Its screen is a canvas in a browser tab, so Linux programs, window managers and a whole XFCE desktop run in any browser."
draft = false
+++

I have released **xsrv-web** 0.1.0. It is an X11 server written in Rust, with one difference from the X server of your desktop: its screen is a web page. A normal X server draws on a monitor. xsrv-web draws in a canvas of a browser. Linux programs that use X connect to it as to any X server, and you use them from a tab on any computer that has a browser.

![An XFCE desktop on the page, with the Applications menu open on the Settings entries.](/images/xsrv_web/xfce.png)

The source is on [GitHub](https://github.com/csegura/xsrv_web), under the GNU Affero General Public License version 3. Here is a demo of 75 seconds. A terminal starts `xeyes` and `xclock`, and everything runs on the page:

[![Demo video: a terminal, xeyes and xclock on the page. Click to watch it on YouTube.](/images/xsrv_web/demo-video.png)](https://youtu.be/7kO271UjClI)

## What it does

- **Shows programs in the browser.** Windows, menus, text, images and cursors appear in the tab, and the page sends back the keyboard, the mouse, the wheel and touch input (one finger is the left button, two fingers scroll).
- **Runs real programs:** xterm, GTK 3 programs, Chromium and Electron programs such as VS Code, window managers such as i3, and a whole XFCE desktop. Qt programs are not tested.
- **Shares the clipboard** in both directions: text, HTML and images, up to 4 MB of text and 16 MB of image.
- **Works over a slow link.** Only the pixels that changed are sent. A scroll or a window move is a small copy message, not new pixels.
- **Has a control panel in the page:** the keyboard layout (us, es, gb, de), a key that acts as Win or Cmd, buttons for keys that the browser keeps for itself (Ctrl+W, Alt+Tab, Alt+F4), macros, a screenshot button and full screen.
- **Serves several screens** from one process, up to eight, one for each user.
- **Is simple to run:** a Debian package with a systemd service, a tarball, or a Docker image.

There is no VNC server, no virtual frame buffer and no browser plug-in. The X server itself speaks to the page.

## How it works

```
X programs --(X11 protocol, Unix socket)--> xsrv-web --(WebSocket)--> the page in your browser
                                              ^                              |
                                              +-----(keys, mouse, clipboard)-+
```

1. A program draws with normal X requests. xsrv-web keeps the pixels of every window, like an X server does, and builds the screen from them.
2. When a burst of drawing settles (after 6 ms, and at most 16 ms), the server compares the new screen with the old one and sends only the changed rows, as small tiles. A tile of 1 KiB or more is compressed with LZ4, or with zstd if you ask for fewer bytes on a slow network. Where a region only moves, as in a scroll or a window drag, the server sends a copy message instead.
3. The page decodes the messages with a WebAssembly module and draws them on the canvas. The same WebSocket carries back what you type, click and copy.

If you do want video, there is an option that encodes the screen as H.264 with `ffmpeg`, and the page decodes it with WebCodecs.

## Inside the code

It is a workspace of three Rust crates, about 34,000 lines in total:

| Crate | What it holds |
| --- | --- |
| `wire` | The messages between the server and the page, shared by both sides (`no_std`). |
| `xsrv-server` | The X11 protocol, the framebuffer, the HTTP and WebSocket server, authentication and limits. |
| `xsrv-wasm` | The page side: it decodes the messages and draws on the canvas. |

Some decisions that I would like to explain:

- **One thread.** The whole server runs on a single-threaded Tokio runtime. The X11 protocol is serial for each client, so the shared state needs no locks. The work for each request is bounded instead, and a request that needs too much is cut by a work budget.
- **A backing store for every window.** Each window keeps its pixels, so the server can compose any part of the screen at any time without asking the programs to draw it again.
- **Copy messages wait for the end of a burst**, so that a scroll and its new pixels arrive in the same frame, and the page never shows half of a change.
- **RENDER at version 0.1.** It is the lowest version at which cairo uses RENDER for fills, copies and text. Without it, cairo lost drawing in i3bar.
- **No GLX and no XInputExtension.** A half-made extension makes a program take paths that then fail, so I left them out on purpose. That means no 3D (no GLX) and no XTEST either. RENDER has no trapezoids, transforms or gradients: the programs draw those themselves.

## Try it

On Debian 13 or Ubuntu 24.04 (x86_64), with the package from the release:

```
sudo apt install ./xsrv-web_0.1.0_amd64.deb
sudo systemctl enable --now xsrv-web
sudo xsrv-web token
```

The last command prints the address of the page, with a token. Open it, click the page to give it the keyboard, and start a program on the screen:

```
DISPLAY=:1 xterm &
```

To use it from another computer outside a trusted network, keep the server on `127.0.0.1` and open an SSH tunnel (`ssh -L 8080:127.0.0.1:8080 user@server`). For a desktop, set `XSRV_WM=0`, restart the service and start your window manager on the screen, for example `DISPLAY=:1 i3 &`. Without it, a small built-in window manager gives each window a title bar.

For Docker, the program is one binary and a folder of page files, so it fits in any image with glibc 2.39 or newer. The repository has a `Dockerfile` and a `compose.yaml` with one container for the server and one for a program.

## Security

The page can type and click in every window, and a program on the X socket can read the screen, so treat both as full control of the session. This is what the server does about it:

- **A token.** A loopback address needs none. Any other address needs `XSRV_TOKEN`, or the server refuses to start. The token travels once in the address, and then in a cookie (`HttpOnly`, `SameSite=Strict`).
- **Origin and Host checks** on the WebSocket, which stop DNS rebinding, and headers that stop another site from putting the page in a frame.
- **An X cookie** (MIT-MAGIC-COOKIE-1) for the programs, if you set one.
- **Limits** on the resources of each client, on the size of a request, on the output queue (a client that does not read is disconnected), and on the input from a page (3000 messages a second).
- **No `unsafe` code** except in one file, the one that handles shared memory. A bug in one request closes that client and not the server.
- **Fuzzing:** a seeded test with random requests, and a coverage-guided `cargo-fuzz` target. The longest run was 12 minutes with no crash. That is a first pass, not an audit.

The server speaks no TLS. For remote use, put a reverse proxy with TLS in front of it and keep the token on, because without TLS the token goes over the network in clear text.

I want to be honest about what is not done. No external person has audited it: two internal reviews found issues that I fixed before the release. The Docker image has been written but not built on my machine (there is no Docker there), so the Dockerfile in the README was checked by reading only. The security notes in the repository list the known gaps.

## Where to find it

The code, the releases (a tarball and a Debian package) and the documentation are in [github.com/csegura/xsrv_web](https://github.com/csegura/xsrv_web). The documentation has a guide for each part: installing, using an external window manager, keyboard and mouse, the clipboard, several sessions, Docker, security, the X11 extensions and the architecture. It is version 0.1.0, so expect rough edges, and tell me what breaks.
