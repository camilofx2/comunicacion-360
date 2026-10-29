# Comunicación 360 — prototipo

Plataforma interna para gestionar solicitudes de diseño: solicitar → priorizar → asignar → diseñar → aprobar → entregar → archivar.

- `index.html`: prototipo completo, autocontenido. Se abre con doble clic o se publica en cualquier hosting estático (GitHub Pages).
- Datos ficticios guardados solo en el navegador (localStorage). Botón "Restablecer datos de la demo" en el menú de la empresa.
- Dos empresas de ejemplo: ELC (Google Workspace) y EPC (Microsoft 365). Se cambian en el login.
- Perfiles: solicitante, diseñador, supervisor. El perfil con etiqueta "dev" ve Configuración.

Identidad: ver `../01_IDENTIDAD`. Paleta Navy #093169 · Azul #0F50AC · Señal #146CE8 · Papel #F6F8FB. Tipografía Archivo (Google Fonts).

## Identidad v1 (24 oct 2026)
- Símbolo de cápsulas (`assets/simbolo.svg`), logotipo Kurdis (Regular + 360 SemiBold), interfaz en Grift.
- Fuentes autoalojadas en `assets/fonts/` (solo los pesos usados). Verificar licencia web de Kurdis y Grift antes de un despliegue público definitivo.
- Animación del lobby: `assets/lobby.gif`.

## Piloto (v7)

- Un enlace por empresa: `?org=epc` (Empresas Públicas de Cundinamarca) y `?org=elc` (Empresa de Licores de Cundinamarca). Sin parámetro abre EPC.
- Co-branding: logo de la empresa en el acceso y en la barra lateral; el símbolo y el nombre Comunicación 360 se mantienen.
- Modo claro / oscuro con interruptor (se guarda por navegador).
- Semáforo de etapas: Recibida azul · Asignada amarillo · En diseño naranja · En aprobación violeta · Entregada verde.
- Asignación con sugerencia: el tablero propone al diseñador con menos carga (videógrafa para video y cubrimientos).
- Derechos: ver `LICENSE`. © 2026 Juan Camilo Orozco Galindo.

### Limitación conocida del piloto
Las solicitudes viven en el navegador de cada persona (`localStorage`). Para que solicitante, supervisor y diseñadores vean lo mismo desde equipos distintos hace falta un almacenamiento compartido; el plan es una hoja de Google Sheets administrada por el mismo Apps Script (`db_load` / `db_save`), sin costo.
