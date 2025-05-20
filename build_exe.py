import os
import subprocess
import time
from pathlib import Path
import signal
import psutil  # será usado para matar processos

# build_exe.py

def run(cmd, **kwargs):
    print(f"$ {cmd}")
    subprocess.run(cmd, shell=True, check=True, **kwargs)

def kill_electron_processes():
    """Mata processos electron.exe para liberar arquivos bloqueados."""
    for proc in psutil.process_iter(['name', 'pid']):
        if proc.info['name'] and proc.info['name'].lower().startswith('electron'):
            try:
                print(f"Killing {proc.info['name']} (PID={proc.info['pid']})")
                proc.kill()
            except Exception:
                pass

if __name__ == '__main__':
    root = Path(__file__).parent.resolve()
    os.chdir(root)

    # 0. Mata processos Electron que possam estar abertos
    try:
        kill_electron_processes()
        time.sleep(1)
    except ImportError:
        print("psutil não encontrado, pulei killing de processos. Instale com: pip install psutil")

    # 1. Limpa node_modules para evitar conflitos
    nm = root / 'node_modules'
    if nm.exists():
        print("Removendo node_modules para evitar arquivos bloqueados...")
        if os.name == 'nt':
            run(f'rmdir /S /Q "{nm}"')
        else:
            run(f'rm -rf "{nm}"')

    # 2. Instala dependências do front-end
    run('npm ci')

    # 3. Build Vite (produção)
    run('npm run build')

    # 4. Prepara pasta public
    public = root / 'public'
    dist = root / 'dist'
    if public.exists():
        if os.name == 'nt':
            run(f'rmdir /S /Q "{public}"')
        else:
            run(f'rm -rf "{public}"')
    run(f'mkdir "{public}"' if os.name=='nt' else f'mkdir -p "{public}"')

    if os.name == 'nt':
        run(f'xcopy "{dist}\\*" "{public}" /E /I /Y')
    else:
        run(f'cp -r "{dist}/*" "{public}"')

    # 5. Instala electron-builder localmente (sem salvar no package.json)
    run('npm install --no-save electron-builder@latest')

    # 6. Gera o executável Windows
    run('npx electron-builder --win --publish never')

    print('✅ Build concluído. Confira em dist/ o instalador .exe gerado.')
