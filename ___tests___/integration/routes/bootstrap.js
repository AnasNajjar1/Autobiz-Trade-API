const { spawn, exec } = require('child_process');

let slsOfflineProcess;

module.exports = async () => {
  console.log('[Tests Bootstrap] Start');

  console.log('[Serveless] Start serverless offline with test stage');
  await startSlsOffline().catch((e) => {
    console.error(e);
    return;
  });
  global.__SERVERD__ = slsOfflineProcess;
};

function startSlsOffline() {
  slsOfflineProcess = slsOfflineProcess = spawn('serverless', [
    'offline',
    '--httpPort',
    4000,
    '--stage',
    'test',
  ]);

  return finishLoading();
}

const finishLoading = () =>
  new Promise((resolve, reject) => {
    slsOfflineProcess.stdout.on('data', (data) => {
      if (data.includes('[HTTP] server ready')) {
        console.log(data.toString().trim());
        console.log(
          `Serverless: Offline started with PID : ${slsOfflineProcess.pid}`,
        );
        resolve('ok');
      }

      if (data.includes('address already in use')) {
        reject(data.toString().trim());
      }
    });

    slsOfflineProcess.stderr.on('data', (errData) => {
      console.log(`Error starting Serverless Offline:\n${errData}`);
      reject(errData);
    });
  });
