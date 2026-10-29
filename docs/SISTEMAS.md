# Comunicación 360 · Nota para el equipo de Sistemas (EPC)

Versión v10 · 29 oct 2026 · Autor: Juan Camilo Orozco Galindo (Dirección de Comunicaciones)

## 1. Para qué es esta nota

Comunicación 360 entra en **prueba real** con el equipo de Comunicaciones. Hoy funciona con servicios gratuitos de Google bajo una cuenta personal, **de forma temporal**. Queremos acordar con Sistemas dónde debe vivir de forma definitiva: datos, archivos, correo y dominio.

## 2. Cómo está armada hoy

```
Navegador (index.html, un solo archivo, publicado en GitHub Pages)
   │  HTTPS · POST JSON + token de sesión
   ▼
Google Apps Script (cuenta camiloorozcofx@gmail.com)
   ├─ Cuentas: correo @epc.com.co + código de 6 dígitos al correo + contraseña propia de la plataforma
   ├─ Datos: un archivo JSON en Drive (estado compartido, fusión por solicitud)
   ├─ Archivos: Drive › Comunicación 360/AAAA-MM/<código · título>/01_adjuntos · 02_propuestas · 03_entrega
   └─ Correos: Gmail (remitente «Comunicación 360»)
```

| Pieza | Hoy | Comentario |
|---|---|---|
| Página | GitHub Pages (repositorio público) | Archivo estático; se puede alojar en cualquier servidor web interno |
| Servicio | Google Apps Script personal | Sin costo; límite de ~100 correos al día por ser cuenta gratuita |
| Datos | JSON en Drive personal | Volumen pequeño (texto); sin base relacional |
| Archivos | Drive personal | Originales hasta 20 MB por archivo y 30 MB por solicitud |
| Correo | Gmail personal | El dominio @epc.com.co usa un servidor propio (`mail.epc.com.co`), no Microsoft 365 |

## 3. Seguridad (lo que ya tiene)

- Solo se registran correos **@epc.com.co**; el código vence en 10 minutos y se limitan los intentos (5 códigos por hora, 10 intentos de entrada cada 15 minutos).
- Contraseñas guardadas con **sal y hash SHA-256 iterado**; nadie puede leerlas.
- Toda operación de datos o archivos exige un **token de sesión** (30 días). Sin sesión, el servicio responde «Tu sesión venció».
- Las carpetas de Drive no se comparten con los solicitantes: descargan los originales desde la plataforma.
- Datos personales que se guardan: nombre, correo institucional, área y el contenido de las solicitudes.

**Riesgos conocidos del esquema temporal:** depende de una cuenta personal; la dirección del servicio es visible en el código público (está protegida por sesión, pero alguien podría pedir códigos a correos @epc.com.co hasta el límite por hora); los roles se administran en la propia plataforma.

## 4. Lo que pedimos a Sistemas

1. **Dónde alojarla:** un servidor o subdominio interno (por ejemplo `c360.epc.com.co`).
2. **Base de datos interna:** dónde guardar solicitudes, usuarios y archivos (PostgreSQL, SQL Server, un SharePoint o carpeta de red, lo que use la EPC). El modelo es sencillo: usuarios, solicitudes, historial, archivos y correos enviados.
3. **Buzón de Comunicaciones con SMTP** para que los avisos salgan de una cuenta @epc.com.co y no de un Gmail.
4. **Directorio de áreas y personas**, para que la lista de áreas y los roles salgan de una fuente oficial.
5. **Requisitos de seguridad y tratamiento de datos** (Ley 1581 de 2012) que debamos cumplir.

## 5. Plan sugerido

| Fase | Qué | Dónde |
|---|---|---|
| Ahora | Prueba real con Comunicaciones, ajustes de funcionamiento | Google (temporal) |
| Siguiente | Definir con Sistemas base de datos, correo y alojamiento | Reunión con Sistemas |
| Después | Migrar el servicio a la infraestructura de la EPC y abrir a 2 o 3 áreas | Infraestructura EPC |

La aplicación ya separa la interfaz (`index.html`) del servicio (`integracion/Code.gs`) con un contrato JSON sencillo (acciones `auth_*`, `datos_leer`, `datos_guardar`, `nuevo_id`, `archivo`, `archivo_leer`, `crear`, `prioridad`, `devuelta`, `propuesta`, `entrega`). Para migrar basta con reimplementar ese servicio sobre la plataforma que defina Sistemas; la interfaz no cambia.

Contacto: Juan Camilo Orozco Galindo · juan.orozco@epc.com.co
