# Remote Control Server


## Clone Source Code

Run `git clone https://github.com/BullTronics/Remote-Control-Server.git`

## Download Dependencies

Navigate to source code directory and Run `npm i`

## Start Remote-Control-Server

Run `npm start`

## Install Remote-Control-Server as Service [Optional]

**Windows:** `npm run install-windows-service`<br /><br />
*Make sure while installing, no other server is running on the same port*

## Uninstall Remote-Control-Server as Service [Optional]

**Windows:** `npm run uninstall-windows-service`

## Configure Remote-Control-Server

Navigate to `http://localhost:33986/`

## Configure & Connect Client

Download platform specific client <br />
*Make sure that server and client are on same network (Either same Wifi Network or same VPN Network)*<br /><br />
**Android:** `https://play.google.com/store/apps/details?id=com.bulltronics.rc.system`

## Further help

Remote-Control-Server depends on robotjs, Complete all OS specific prerequisite of robotjs `https://github.com/octalmage/robotjs` <br />
To access Remote-Control-Server from remote client, Use ZeroTier to create Virtual Network `https://zerotier.com/` <br /><br />
To get more help on the Remote-Control-Server, contact `admin@bulltronics.com`.
