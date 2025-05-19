// electron/main.cjs
const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const Docker = require('dockerode');
const { spawn } = require('child_process');

const docker = new Docker({
  socketPath: process.platform === 'win32'
    ? '//./pipe/docker_engine'
    : '/var/run/docker.sock'
});

function createWindow() {
  const win = new BrowserWindow({
    width: 434,
    height: 801,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),  // 🔥 deve existir e apontar pro seu preload.js
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL('http://localhost:8080');
  win.webContents.openDevTools({ mode: 'detach' });
}

// ① Handler para pull da imagem
ipcMain.handle('docker:pull-image', async (_, imageTag) => {
  return new Promise((resolve, reject) => {
    docker.pull(imageTag, (err, stream) => {
      if (err) return reject(err);
      docker.modem.followProgress(stream, onFinished, onProgress);

      function onFinished(err) {
        if (err) reject(err);
        else resolve(true);
      }
      function onProgress(event) {
        // opcional: você pode enviar progresso ao renderer
        console.log(event.status, event.progress || '');
      }
    });
  });
});

// Handler para listar todos os containers (running e stopped)
ipcMain.handle('docker:list-containers', async () => {
  return await docker.listContainers({ all: true });
});


ipcMain.handle('docker:create-container', async (_, opts) => {
  return new Promise((resolve, reject) => {
    // Base do comando docker run
    const baseArgs = [
      'run', '-d',
      '--name', opts.name,
      '-m', opts.memLimit.toString(),
      '--cpus', opts.cpus.toString(),
    ];

    // Montagem de binds se existir
    const bindArgs = Array.isArray(opts.binds)
      ? opts.binds.flatMap(b => ['-v', b])
      : [];

    // Variáveis de ambiente
    const envArgs = Array.isArray(opts.envVars)
      ? opts.envVars.flatMap(v => ['-e', v])
      : [];

    // Comando interno que executa ambos os scripts
    const cmd = 'python automation.py & python HoneygainPot/automation_claimpot.py & tail -f /dev/null';

    const args = [
      ...baseArgs,
      ...bindArgs,
      ...envArgs,
      opts.imageTag,
      'sh', '-c', cmd
    ];

    // Executa o docker CLI
    const proc = spawn('docker', args);

    let containerId = '';
    proc.stdout.on('data', data => { containerId += data.toString(); });
    proc.stderr.on('data', data => { console.error('[docker run error]', data.toString()); });
    proc.on('error', reject);
    proc.on('close', code => {
      if (code === 0 && containerId) resolve(containerId.trim());
      else reject(new Error(`docker run exited with code ${code}`));
    });
  });
});

ipcMain.handle('start-container', async (event, id) => {
  const container = docker.getContainer(id);
  return await container.start();
});

ipcMain.handle('remove-container', async (event, id) => {
  const container = docker.getContainer(id);
  return await container.remove({ force: true });
});

// Handler para parar um container
ipcMain.handle('docker:stop-container', async (_, containerId) => {
  const c = docker.getContainer(containerId);
  await c.stop();
  return true;
});

ipcMain.handle('electron:get-app-path', () => {
  return app.getAppPath();
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
