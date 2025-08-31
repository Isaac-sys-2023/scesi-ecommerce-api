<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Backend - Proyecto de Prueba con NestJS

Este es un backend de ejemplo desarrollado con [NestJS](https://nestjs.com), pensado para que los estudiantes puedan consumir datos de prueba desde sus proyectos frontend.  

## 🚀 Opciones para usar el backend

### 🔹 1. Usar backend en línea (recomendado para deploy del frontend)
Ya tienes un backend desplegado en **Render**, por lo que no necesitas correr nada localmente para probar tu frontend en producción.  
👉 URL pública:  
Por definir


### 🔹 2. Correr el backend en local
Si deseas correr este proyecto en tu máquina:

### ✅ Requisitos previos
Debes tener instalado:
- [Node.js](https://nodejs.org/) (versión 18+ recomendada)
- [npm](https://www.npmjs.com/)
- [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/?utm_source=chatgpt.com)
---

## ⚙️ Instalación

#### 1. Clona el repositorio e instala dependencias:

```bash
git clone https://github.com/Isaac-sys-2023/scesi-ecommerce-api.git
cd scesi-ecommerce-api
npm install
```
#### 2. Levanta la base de datos con Docker

En la raíz del proyecto ya está el archivo docker-compose.yml. Ejecuta:
```bash
docker-compose up -d
```

Esto iniciará:

- PostgreSQL en el puerto 5433
- Adminer (cliente web para DB) en http://localhost:8080

#### 3. Configurar variables de entorno

Copia el archivo .env.example y renómbralo como .env.
Ajusta las credenciales si es necesario, por defecto debería funcionar con:

```.env
NODE_ENV=production
PORT=3000

DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASS=postgres
DB_NAME=ecommerce

JWT_SECRET=super_secret_key_change_me
JWT_EXPIRES=7d
```

#### 4. Ejecuta los seeds para tener datos de prueba
```bash
npm run seed
```

#### 5. Ahora levanta tu backend localmente
```bash
npm run start:dev
```
- Con esto NestJS estará corriendo en http://localhost:3000
- Swagger estará disponible en http://localhost:3000/api

#### 6. Problemas comunes
- Si usas Docker Desktop, asegúrate de que la virtualización (WSL2) esté activada.
- **El puerto 5433 está en uso** → Edita el `docker-compose.yml` y cambia el puerto.
- **NestJS no levanta** → Revisa que tengas Node 18+ (`node -v`).
- **No conecta a la base de datos** → Asegúrate de que `docker-compose up -d` se ejecutó y que Postgres esté corriendo (`docker ps`).

## License Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
