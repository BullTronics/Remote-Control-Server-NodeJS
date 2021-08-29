var Service = require('node-windows').Service;

var svc = new Service({
  name:'Remote Control Server',
  description: 'Remote Control Server || BullTronics',
  script: './index.js'
});

svc.on('install', function(){
  svc.start();
});

svc.install();
