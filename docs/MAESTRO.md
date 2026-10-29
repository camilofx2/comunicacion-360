# Comunicación 360 — Documento maestro

> Contexto completo del proyecto para seguir trabajando desde Claude Code o desde cualquier chat.
> Última actualización: 29 de octubre de 2026 · Autor y titular: **Juan Camilo Orozco Galindo** (camiloorozcofx@gmail.com · juan.orozco@epc.com.co).

---

## 1. Qué es

Plataforma interna para gestionar las solicitudes de diseño de una entidad: **solicitar → priorizar → asignar → diseñar → aprobar → entregar → archivar**, con un solo canal y trazabilidad completa.

- **Problema que resuelve:** hoy las solicitudes llegan por WhatsApp, correo, el pasillo o una llamada; no hay fila, ni fechas claras, ni registro de quién pidió qué y cuándo.
- **Plazo estándar:** 3 días hábiles (configurable por tipo de pieza). Lo que se pida antes es **prioridad** y requiere justificación y aprobación del supervisor.
- **Hasta 2 rondas de ajustes**, marcados sobre la imagen de la propuesta.
- **Clientes:** primero **EPC** (Empresas Públicas de Cundinamarca), con un piloto de 1 mes. Después **ELC** (Empresa de Licores de Cundinamarca), duplicando la base.
- **Derechos:** obra original de Juan Camilo, hecha por iniciativa propia. Ver `LICENSE`, que da a EPC y ELC una licencia de uso no exclusiva, temporal y revocable solo para el piloto. Pendiente: formalizarlo por escrito con jurídica (ver §11).

## 2. Equipo y roles (EPC)

| Persona | Rol en la plataforma | Nota |
|---|---|---|
| Mauricio Silva | Supervisor | Dirección de Comunicaciones |
| Juan Camilo Orozco (Juan Camilo) | Diseñador + desarrollador | Autor de la plataforma |
| Juan Camilo | Diseñador | — |
| Andrés Triana | Diseñador | — |
| Sofía | Diseñadora (videógrafa) | Recibe por sugerencia los videos y cubrimientos |
| Daniel | Solicitante interno | Comunicador social |
| Cualquier persona @epc.com.co | Solicitante | Entra sola con su correo |

**Piloto actual:** solo existe la cuenta de Juan Camilo (`juan.orozco@epc.com.co`) con los **tres roles** (supervisor, diseñador y solicitante); se cambia entre ellos desde el menú superior izquierdo. Al resto del equipo se le agrega en **Configuración → Equipo** con su correo real.

## 3. Estado actual (importante)

| Qué | Dónde | Estado |
|---|---|---|
| Página publicada | https://camilofx2.github.io/comunicacion-360/ (rama `main`) | **v9**. Su inicio de sesión con Microsoft **no sirve** en la EPC (ver §5). |
| Versión nueva | `~/Documents/PLATAFORMA 360 COMUNICACION/03_PLATAFORMA/v10_cuentas/` (**no está en GitHub**) | **v10**: cuentas propias (correo @epc + código al correo + contraseña de la app), datos compartidos y originales en Drive. Probada con un servidor simulado; **Apps Script v10 publicado el 29 oct** (falta la prueba real y subir la página). No se subió al repositorio público porque lleva la dirección del servicio de Google, y el script desplegado hoy (v8) todavía no exige sesión. |
| Demo local | `~/Documents/PLATAFORMA 360 COMUNICACION/03_PLATAFORMA/index.html` | **Ojo:** es la **v8 con datos de demostración** (clave `c360-demo-v4`, sin conexión configurada), no el piloto. El archivo `Comunicacion360_Piloto_EPC.html` que funcionó de punta a punta **ya no está en la carpeta**. |
| **Modo prueba local (v10)** | `03_PLATAFORMA/Probar_Comunicacion360.command` (doble clic) | Abre la v10 en `http://localhost:8795` con un servidor que imita el Apps Script v10: el código de acceso sale en pantalla, los correos quedan en una bandeja simulada y los archivos en `prueba_local/datos_prueba/`. No toca Gmail ni Drive ni el archivo original. Ver `prueba_local/README.md`. |
| Material del video para el gerente | `~/Documents/PLATAFORMA 360 COMUNICACION/04_VIDEO_GERENTE/` | **Listo:** `exportar/Comunicacion360_gerente_v2_musica.mp4` (1:44, música de Envato, voz limpia, efectos) y copia liviana de 25 MB. Detalle en `GUION_video_gerente.md`. |

**Verificado el 29 oct 2026 (tarde):**
- **Apps Script v10 publicado el 29 oct 2026, 9:55** (Claude lo hizo en el Chrome de Juan Camilo, con su sesión): misma implementación y misma URL (`AKfycbx6Jkil…`), **Versión 4** con la descripción «v10 · cuentas propias, datos compartidos y originales en Drive». Lo que había antes era la **Versión 3 del 24 oct** (anterior a v8: sin la acción `archivo`); su código quedó respaldado y verificado en `03_PLATAFORMA/integracion/respaldo_desplegado/Code_desplegado_antes_v10_2026-10-29.gs`. Para volver atrás: Implementar → Administrar implementaciones → lápiz → Versión 3.
- Verificado tras publicar: sin sesión el servicio responde «Tu sesión venció» (también a eventos viejos como `crear`, que antes creaban carpetas y correos sin control) y `auth_code` rechaza correos que no sean @epc.com.co. Google no pidió permisos nuevos.
- **v10 publicada en GitHub (`main`) el 29 oct 2026** para mostrarla a Sistemas y empezar el uso real: https://camilofx2.github.io/comunicacion-360/. El repositorio **sigue público** porque GitHub Pages en un repositorio privado exige plan de pago; la dirección del servicio queda visible, pero exige sesión y solo acepta @epc.com.co. Nota técnica para la reunión: `docs/SISTEMAS.md` del repositorio.
- **Registro mejorado (29 oct):** el nombre se sugiere desde el correo; el **área se elige de una lista** (sin texto libre); contraseña con botón ver/ocultar y aviso en vivo de largo y coincidencia; lo escrito se conserva si el código falla; mensajes de error en rojo (antes salían en verde). El campo se llama «Dirección a la que perteneces» y usa las **12 direcciones oficiales** de la EPC (lista entregada por Juan Camilo el 29 oct: Control Interno, Estructuración de Proyectos, Finanzas…, Gestión Contractual, Gestión Humana…, Obras, Planeación, Jurídica, Operativa…, Gerencia General, Subgerencia General, Subgerencia Técnica y Operativa); está en `AREAS_EPC` de `index.html` y también se edita en Configuración → Áreas. La lista oficial no incluye una dirección de Comunicaciones: el equipo de Comunicaciones tiene su área definida en Configuración → Equipo. También se corrigieron plurales («1 piezas», «1 activas», «1 días hábiles»).
- Datos y archivos siguen **temporalmente** en el Drive personal; se discutirá en la reunión con Sistemas cómo pasarlos a una base interna.
- Lo publicado en GitHub es la v9 (etiqueta «Piloto · v9», sin la dirección del servicio).
- La v10 pasó la prueba completa en modo local con los tres roles: registro con código, contraseña, solicitud con adjunto, asignación, propuesta, ajuste marcado sobre la imagen, aprobación, entrega con archivos originales, datos compartidos, descarga del original y rechazo de llamadas sin sesión o de correos fuera de @epc.com.co.
- **Dos detalles encontrados y corregidos el mismo día** en `v10_cuentas/index.html` (solo cambia la página; el `Code.gs` v10 no cambia):
  1. *Propuesta o entrega sin archivo:* con la integración activa, proponer y entregar exigen un archivo real (aviso + zona de adjuntos resaltada; la etiqueta dice «Obligatorio»). Si la propuesta aprobada no tiene original, la entrega pide el archivo final. Las imágenes de muestra de solicitudes antiguas se convierten a base64 para que no rompan la entrega.
  2. *Falso «Tu sesión venció» al salir:* al cerrar sesión primero se guarda lo pendiente con la sesión vigente y luego se cierra en el servidor; una respuesta vieja ya no puede cerrar ni avisar sobre una sesión que no está en uso.
  Probado en modo local (bloqueos, entrega con archivo, conversión aceptada por el servidor, salida sin aviso y cambio de último momento guardado) y revisado en 1440×900, 1024×768 y 390×844, claro y oscuro.
- Pendiente menor visto en la prueba: el inicio del diseñador dice «1 piezas en tus manos» (plural).
| Repositorio | github.com/camilofx2/comunicacion-360 (**público**) | Recomendado volverlo privado después del piloto. |

### Siguiente paso inmediato (bloqueado por la sesión de Google)
1. Abrir https://script.google.com con **camiloorozcofx@gmail.com** y entrar al proyecto **«Comunicación 360 · Drive y Gmail»**.
2. Reemplazar el código por `v10_cuentas/Code.gs` y guardar.
3. **Implementar → Administrar implementaciones → editar (lápiz) → Versión: Nueva versión → Implementar.** La URL no cambia. Ejecutar como **Yo**; acceso: **Cualquier usuario**.
4. Si Google pide permisos nuevos (Propiedades, Caché), aceptarlos.
5. Recién entonces copiar `v10_cuentas/index.html` y `Code.gs` al repositorio y publicar en `main`. **No publicar v10 antes**: el script anterior no sabe enviar códigos (el inicio de sesión fallaría) y deja el servicio abierto sin sesión. Mejor aún: volver privado el repositorio antes.
6. Probar: entrar con juan.orozco@epc.com.co → «Primera vez… enviarme un código» → revisar Outlook, incluido «Correo no deseado» → crear la contraseña → probar los tres roles.

## 4. Arquitectura

```
Navegador (index.html, un solo archivo)
   │  fetch POST (Content-Type text/plain, JSON + token de sesión)
   ▼
Google Apps Script «Comunicación 360 · Drive y Gmail» (cuenta camiloorozcofx@gmail.com)
   ├─ Cuentas: PropertiesService (acct:<correo>, ses:<token>), códigos en CacheService
   ├─ Datos: Drive › Comunicación 360/_sistema/datos.json (estado completo, fusión por solicitud)
   ├─ Archivos: Drive › Comunicación 360/AAAA-MM/<id> · <título>/01_adjuntos · 02_propuestas · 03_entrega
   └─ Correos: GmailApp (remitente: «Comunicación 360» <camiloorozcofx@gmail.com>)
```

- **Frontend:** `index.html`, un solo archivo en HTML, CSS y JS sin framework, de unos 1,4 MB. Lleva dentro las fuentes, los logos, la ilustración Lottie y las librerías. Se publica con GitHub Pages desde `main`.
- **Librerías incluidas:** `lottie-web 5.12.2` (ilustración del acceso) y `@azure/msal-browser 2.39.0` (modo Microsoft, hoy inactivo).
- **Estado:** el objeto `S` (`{v, preset, org, short, domain, cfg, users, reqs, mails, seq, session, savedAt}`) se guarda en `localStorage` con la clave `c360-piloto-v2`. En v10 también se sincroniza con el servidor: `datos_guardar` y `datos_leer` cada 40 s y al volver a la pestaña.
- **Originales:** se guardan en IndexedDB (`c360-archivos`) sin compresión; en el estado solo queda una miniatura (`thumb`, 520 px; las propuestas 1400 px). Límites: 20 MB por archivo y 30 MB por solicitud. Al crear, al proponer y al entregar se suben a Drive (`archivo`) y otras personas los bajan con `archivo_leer`.
- **Fusión de cambios:** cada solicitud lleva `updatedAt` (se marca en `log()`); gana la más reciente. Los IDs (`C360-0001`…) los asigna el servidor (`nuevo_id`) para que no se repitan.

### Acciones del Apps Script (v10)
| Acción | Requiere sesión | Qué hace |
|---|---|---|
| `doGet ?ping=1` | no | Prueba de conexión |
| `auth_code` | no | Envía un código de 6 dígitos (10 min) a un correo @epc.com.co. Máximo 5 por hora. |
| `auth_set` | no | Valida el código y crea o cambia la contraseña de la app (sal + SHA-256 iterado). Devuelve el token. |
| `auth_login` | no | Correo + contraseña de la app → token (30 días). Máximo 10 intentos en 15 min. |
| `auth_logout` | — | Borra el token |
| `datos_leer` / `datos_guardar` | sí | Lee o fusiona el estado compartido (con bloqueo) |
| `nuevo_id` | sí | Siguiente código de solicitud |
| `archivo` | sí | Sube un archivo original a la carpeta de la solicitud (subcarpeta `sub`) |
| `archivo_leer` | sí | Devuelve un archivo original en base64 |
| `crear` · `prioridad` · `devuelta` · `propuesta` · `entrega` | sí | Correos según la política (§6). `entrega` además escribe brief, historial y ajustes. |

**Datos de despliegue:** la URL del web app está en `index.html` (`INTEG.url`). Desde v10 ya no da acceso por sí sola, porque todo exige token. Carpeta raíz en Drive: «Comunicación 360».

## 5. Hallazgo clave: el correo de la EPC no es Microsoft 365

- El dominio `epc.com.co` está registrado en Microsoft Entra («Empresa Publicas de Cundinamarca»), pero **la cuenta de Juan Camilo no existe allá**: Microsoft responde «Este nombre de usuario puede ser incorrecto».
- El correo funciona en un **servidor propio**: el MX es `mail.epc.com.co` (IP 162.214.205.174, hosting externo) y el SPF es `ip4:162.214.205.174`. Outlook solo es el programa que lo lee; sistemas lo configuró y el funcionario **no conoce su contraseña**.
- **Por eso se descartó** el inicio de sesión con Microsoft (v9) y se adoptó la idea de Juan Camilo: **correo institucional + código al correo + contraseña propia de la app** (v10).
- **Para que los avisos salgan de un buzón @epc** en lugar del Gmail, hay que pedirle a sistemas un buzón de Comunicaciones con sus datos SMTP. El envío por SMTP necesitaría un servidor intermedio, porque Apps Script no envía por SMTP externo. Queda pendiente.

## 6. Política de correos

| Evento | Destinatario | Contenido |
|---|---|---|
| Crear | Solicitante y supervisores | Confirmación con código, fecha y posición en la fila / aviso de nueva solicitud con el texto de la pieza |
| Prioridad | Supervisores | Fecha pedida, fecha estándar y motivo |
| Devuelta | Solicitante | Qué información falta |
| Propuesta | Solicitante | Hay una propuesta para aprobar (rondas restantes) |
| Entrega | Solicitante, con copia a los supervisores | Archivo final adjunto si pesa menos de 10 MB, resumen e historial completo, más enlace a la plataforma |

Asignar, iniciar el diseño, ajustar y aprobar **no envían correo**: quedan en el historial y en la plataforma. El solicitante de la EPC no tiene cuenta de Google, así que **no se le comparten carpetas de Drive**: descarga los originales desde la plataforma.

## 7. Funciones de la interfaz (v8–v10)

- **Acceso:** logo EPC grande, ilustración Lottie animada (recoloreada a la paleta C360), interruptor de modo claro u oscuro junto a los derechos, © 2026 Juan Camilo Orozco Galindo.
- **Solicitante:** asistente de 5 pasos (qué necesitas · para qué · contenido · cuándo · revisar), con iconos duotono, borde azul al pasar el cursor y fondo azul al seleccionar. El panel «Cómo funciona» va en azul oscuro. Incluye «Texto que debe ir en la pieza · Obligatorio», logos aliados con su propia carga, adjuntos en calidad original con medidor de peso, y un resumen con imágenes antes y después de enviar.
- **Línea de tiempo interactiva:** 5 etapas con semáforo. Al tocar una etapa se ven los eventos, quién los hizo, cuándo y cuánto duró.
- **Supervisor:** tablero de carpetas (Por asignar, En curso, Prioridades, En riesgo, Histórico), asignación sugerida (menor carga; videógrafa para video y cubrimientos), prioridades y Balance.
- **Balance:** gráfica de líneas semanal, dona de estado, columnas por tipo, barras por área y carga por diseñador, con ayudas al pasar el cursor y exportación CSV. La paleta del semáforo está validada para daltonismo.
- **Buscador en vivo:** busca por título, código, área, persona y texto; se navega con las flechas y Enter.
- **Registro de correos:** solo lo ve el supervisor, como respaldo para auditoría.
- **Configuración (rol dev):** plazos por tipo, rondas, festivos, áreas y equipo (agregar o quitar personas, editar correos).

## 8. Identidad visual

| Elemento | Valor |
|---|---|
| Colores | Navy `#093169` · Azul `#0F50AC` · Señal `#146CE8` · Papel `#F6F8FB` |
| Semáforo (claro) | Recibida `#2E6FE0` · Asignada `#D8AA0C` · En diseño `#CC4320` · En aprobación `#0A9DB8` · Entregada `#2B8A3E` |
| Semáforo (oscuro) | `#4A8CE8` · `#B5900F` · `#DA4426` · `#1592AA` · `#4AA33A` |
| Tipografía | **Kurdis** (títulos) y **Grift** (interfaz), dentro del archivo. Falta verificar su licencia. |
| Símbolo | Cápsulas en hexágono (`MARK_D` en el código). Archivos en `01_IDENTIDAD`. |
| Prohibido | **Morado como color de estado** (lo pidió Juan Camilo). |

## 9. Reglas para trabajar en este proyecto

1. **Responder siempre en español.** Tono profesional, directo y creativo; usar viñetas y tablas.
2. **No dar la razón por complacer:** si una idea tiene fallas, decirlo con argumentos. No inventar datos y verificar lo técnico.
3. En textos, **diferenciar siempre** el copy del post (para redes) del texto que va dentro de la pieza.
4. **No publicar en `main`** cambios que dependan de un Apps Script aún no desplegado.
5. **Nunca escribir contraseñas.** Juan Camilo inicia sus sesiones (Google, Microsoft) él mismo.
6. Mantener `index.html` en un solo archivo autocontenido, sin dependencias externas en tiempo de ejecución.
7. Probar cada cambio con Playwright (escritorio 1440×900, tablet 1024×768 y móvil 390×844, en claro y oscuro) y revisar las capturas antes de entregar.
8. Mensajes de commit en español, con la línea de coautoría.

### Cómo probar en local
```bash
cd comunicacion-360
python3 -m http.server 8790        # luego abrir http://localhost:8790/
# Pruebas automáticas: Playwright con un servidor simulado del Apps Script
# (interceptar https://script.google.com/** y responder auth_*, datos_*, archivo*)
```

## 10. Pendientes, en orden

1. **Publicar el Apps Script v10** y luego subir v10 a `main` (§3).
2. Prueba real con la cuenta de Juan Camilo: código, contraseña, los tres roles y una solicitud completa.
3. **Reunión con sistemas de la EPC** (preguntas en §11).
4. Agregar al equipo real con sus correos en Configuración → Equipo y abrir el piloto a 2 o 3 áreas.
5. **Video para el gerente** (material en `04_VIDEO_GERENTE`): voz (recomendado: la de Juan Camilo, mejorada con Adobe Enhance Speech), montaje en After Effects y **mensaje para el gerente**.
6. Botón **«Mi informe del mes»** (PDF o Excel con lo que hizo cada diseñador) para las cuentas de cobro de los contratistas.
7. Mover el servicio a una **cuenta dedicada del área**, en lugar del Gmail personal.
8. Después del piloto: volver privado el repositorio, registrar el software ante la Dirección Nacional de Derecho de Autor y duplicar para ELC (pedir su manual de identidad).

## 11. Preguntas abiertas

**Para sistemas (EPC):**
- ¿El correo corre en un servidor propio (`mail.epc.com.co`)? ¿Pueden crear un buzón de Comunicaciones y darnos sus datos SMTP para los avisos automáticos?
- ¿El tenant de Microsoft de la EPC se usa para algo? (Hoy los funcionarios no tienen cuenta allá.)
- ¿Dónde se podría alojar la plataforma (servidor o subdominio, por ejemplo c360.epc.com.co)?
- ¿Requisitos de seguridad o de tratamiento de datos personales (Ley 1581)?
- ¿Cuáles son las 2 o 3 áreas que más piden, para abrir con ellas el piloto?

**Legales (para jurídica, no es asesoría legal):**
- Ley 1450 de 2011, art. 28 (modifica el art. 20 de la Ley 23 de 1982): se presume que los derechos patrimoniales de las obras hechas en cumplimiento de un contrato de prestación de servicios pasan al contratante, **salvo pacto en contrario**. Juan Camilo es contratista de la EPC: hay que dejar por escrito que la plataforma es una obra propia, hecha fuera del objeto de su contrato, y que la entidad recibe una licencia de uso.

## 12. Historial de versiones

| Versión | Fecha | Cambios |
|---|---|---|
| v1–v6 | oct 2026 | Exposición, prototipo, identidad v1, presets ELC y EPC, integración Google (Drive + Gmail), política de correos, Balance |
| v7 | 28 oct | Co-branding EPC, semáforo, modo oscuro, responsive, sugerencia de asignación, LICENSE |
| v8 | 28 oct | Archivo único sin servidor, originales sin pérdida, línea de tiempo, buscador, gráficas, asistente renovado, sin morado ni pantalla de carga |
| Piloto | 29 oct | Sin datos de demostración, todos los correos a la cuenta de prueba. Prueba real exitosa con Gmail y Drive. |
| v9 | 29 oct | Conexión con Microsoft 365. Descartada: la EPC no usa Microsoft 365 para el correo. |
| v10 | 29 oct | Cuentas propias con código al correo, datos compartidos entre equipos, originales en Drive, servicio protegido por sesión (carpeta `v10_cuentas` del Mac) |
