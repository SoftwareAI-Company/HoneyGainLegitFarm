// electron/main.cjs
const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const Docker = require('dockerode');
const { spawn } = require('child_process');
const { protocol } = require('electron');

const docker = new Docker({
  socketPath: process.platform === 'win32'
    ? '//./pipe/docker_engine'
    : '/var/run/docker.sock'
});

function createWindow() {
  const win = new BrowserWindow({
    width: 421,
    height: 725,
    frame: true,             // remove a barra padrão do sistema
    autoHideMenuBar: true,    
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (app.isPackaged) {
    // Em modo produção (exe)
    const indexPath = path.join(
      process.resourcesPath,
      'app.asar',       // ou 'app' se o builder gerar unpacked
      'dist',
      'index.html'
    );
    console.log('[main] loading index:', indexPath);
    win.loadURL(`file://${indexPath}`);
  } else {
    // Em modo desenvolvimento (npm run dev usa --file)
    const fileArgIndex = process.argv.indexOf('--file');
    if (fileArgIndex !== -1 && process.argv[fileArgIndex + 1]) {
      win.loadFile(path.resolve(process.cwd(), process.argv[fileArgIndex + 1]));
    } else {
      win.loadURL('http://localhost:8080');
    }
  }
win.webContents.once('did-fail-load', (_event, errorCode, errorDesc) => {
  console.error('[did-fail-load]', errorCode, errorDesc);
  win.webContents.openDevTools();
});
win.webContents.openDevTools(); // ainda abre sempre
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
    // argumentos de run: sem shell, sem cmd extra
    const args = [
      'run', '-d',
      '--name', opts.name,
      '--memory', opts.memLimit,
      '--cpus', opts.cpus.toString(),
      // envs
      ...(Array.isArray(opts.envVars)
        ? opts.envVars.flatMap(v => ['-e', v])
        : []),
      // só a imagem: o ENTRYPOINT/CMD dela já cuida do resto
      opts.imageTag
    ];

    console.log('[main] docker run args:', args.join(' '));
    const proc = spawn('docker', args);

    let containerId = '';
    proc.stdout.on('data', data => { containerId += data.toString(); });
    proc.stderr.on('data', data => {
      console.error('[docker run error]', data.toString());
    });
    proc.on('error', reject);
    proc.on('close', code => {
      if (code === 0 && containerId) {
        resolve(containerId.trim());
      } else {
        reject(new Error(`docker run exited with code ${code}`));
      }
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


app.whenReady().then(() => {
  protocol.registerFileProtocol('app', (request, callback) => {
    const url = request.url.replace('app:///', '');
    callback({ path: path.join(__dirname, '../dist', url) });
  });
  createWindow();
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
