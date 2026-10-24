# Integración real: Drive + Gmail con Google Apps Script

Sin servidor, sin costo. El script corre bajo la cuenta de Google que lo despliega (hoy un Gmail personal; en producción `comunicaciones@` de la empresa) y hace dos cosas por cada evento de la plataforma: ordena archivos en Drive y envía correos.

## Estructura que crea en Drive

```
Comunicación 360/
└── 2026-10/
    └── C360-0001 · Título de la solicitud/
        ├── brief.txt            ← lo que pidió el solicitante
        ├── historial.txt        ← cada cambio de estado con fecha y hora
        ├── 01_adjuntos/         ← referencias e insumos del solicitante
        ├── 02_propuestas/       ← v1_, v2_ … y ajustes_rondaN.txt con los puntos marcados
        └── 03_entrega/          ← archivo final
```

El solicitante recibe acceso de lectura a su carpeta. Los correos llevan el enlace; el archivo final va adjunto solo si pesa menos de 10 MB.

## Desplegar (5 minutos, una sola vez)

1. Entra a <https://script.google.com> con la cuenta remitente y crea un proyecto nuevo.
2. Borra el contenido de `Código.gs` y pega el de `Code.gs` de esta carpeta. Guarda.
3. **Implementar → Nueva implementación → Tipo: Aplicación web.**
   - Ejecutar como: **Yo**.
   - Quién tiene acceso: **Cualquier usuario** (la URL es secreta; solo la conoce la plataforma).
4. Autoriza los permisos de Drive y Gmail cuando lo pida.
5. Copia la URL que termina en `/exec`.
6. En la plataforma entra con un perfil **dev** → **Configuración → Integración con Google**, pega la URL, escribe el correo del gestor, activa la casilla y pulsa **Probar conexión**.

Cada vez que cambies `Code.gs`: **Implementar → Administrar implementaciones → editar → Nueva versión**. La URL no cambia.

## Límites de la cuenta gratuita de Google

- Gmail personal: 100 correos al día enviados por script (Workspace: 1 500).
- Tamaño de petición al script: ~50 MB; la plataforma reduce las imágenes a 1 200 px antes de enviarlas.
- El script tarda 2–6 s por evento; la plataforma muestra "Sincronizando…" mientras tanto.

## Producción en la empresa

Mismo script, desplegado desde `comunicaciones@empresa.co` (Google Workspace). Para Microsoft 365 el equivalente es un flujo de Power Automate con los conectores estándar de SharePoint y Outlook; la plataforma envía el mismo JSON.
