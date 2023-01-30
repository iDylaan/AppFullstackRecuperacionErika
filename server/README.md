### Instalaciones requeridas desde consola ###

### Entrar a la carpeta del server ###
cd .\server\
### Entorno Virtual con Python 3 ###
pip install virtualenv
### Crear un Entorno Virtual ###
virtualenv venv
### Acceder al entorno virtual ###
.\venv\Scripts\activate
### instalar todas las dependencias ###
pip install -r .\requirements.txt

### Arrancar el servidor ###
python .\app.py 