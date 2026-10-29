# Comunicación 360 · Piloto EPC (v10)

Plataforma interna para gestionar las solicitudes de diseño de la Dirección de Comunicaciones de la EPC (Empresas Públicas de Cundinamarca): **solicitar → priorizar → asignar → diseñar → aprobar → entregar → archivar**, con un solo canal y trazabilidad completa.

**Abrir:** https://camilofx2.github.io/comunicacion-360/

## Cómo se entra

1. Correo institucional **@epc.com.co**.
2. La primera vez: «Primera vez… enviarme un código». Llega un código de 6 dígitos al correo (revisar también «Correo no deseado»).
3. Con el código se crea una **contraseña solo para Comunicación 360** (no es la del correo), se escribe el nombre y se **elige el área** de una lista.
4. El rol (solicitante, diseñador o supervisor) lo define la lista del equipo en Configuración → Equipo. Quien no está en la lista entra como solicitante.

## Qué hace

| Rol | Puede |
|---|---|
| Solicitante | Pedir una pieza en 5 pasos (qué, para qué, contenido, cuándo, revisar), adjuntar archivos en calidad original, aprobar la propuesta o marcar ajustes sobre la imagen (hasta 2 rondas) |
| Supervisor | Ver el tablero (por asignar, en curso, prioridades, en riesgo, histórico), asignar con sugerencia por carga, aprobar prioridades, ver el Balance y el registro de correos |
| Diseñador | Iniciar, enviar propuestas y entregar el archivo final |

Plazo estándar de 3 días hábiles (configurable por tipo de pieza). Lo que se pide antes es prioridad y requiere aprobación del supervisor.

## Estado

**Piloto en uso real con el equipo de Comunicaciones.** Los datos y archivos se guardan **temporalmente** en el Drive personal del autor mientras se define con Sistemas una base de datos interna. Ver [`docs/SISTEMAS.md`](docs/SISTEMAS.md).

## Archivos

| Archivo | Qué es |
|---|---|
| `index.html` | La aplicación completa en un solo archivo (HTML, CSS y JS sin framework; fuentes, logos e ilustración incluidos) |
| `integracion/Code.gs` | Servicio en Google Apps Script: cuentas, datos compartidos, archivos en Drive y correos |
| `docs/SISTEMAS.md` | Nota técnica para el equipo de Sistemas de la EPC |
| `docs/MAESTRO.md` | Documento maestro del proyecto (estado, decisiones, pendientes) |
| `LICENSE` | Derechos y licencia de uso |

## Derechos

Obra original de **Juan Camilo Orozco Galindo**, hecha por iniciativa propia. La EPC recibe una licencia de uso no exclusiva, temporal y revocable para el piloto. Ver [`LICENSE`](LICENSE). © 2026.
