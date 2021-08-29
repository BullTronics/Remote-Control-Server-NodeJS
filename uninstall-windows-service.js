var Service = require('node-windows').Service;

var svc = new Service({
  name:'Remote Control Server',
  description: 'Remote Control Server || BullTronics',
  script: './index.js'
});

svc.on('uninstall', function(){
  console.log('Uninstall complete.');
  console.log('The service exists: ', svc.exists);
});

svc.uninstall();
