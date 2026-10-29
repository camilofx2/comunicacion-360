# CLAUDE.md — Comunicación 360

Lee primero **`docs/MAESTRO.md`**: es el contexto completo (qué es, estado, arquitectura, pendientes y decisiones).

## Reglas
- **Responde siempre en español.** Sé directo, usa tablas y viñetas, y corrige con argumentos cuando una idea tenga fallas. No inventes datos.
- En textos de comunicación, diferencia el **copy del post** del **texto que va dentro de la pieza**.
- `index.html` es **un solo archivo autocontenido** (HTML, CSS y JS sin framework; fuentes, logos, Lottie y MSAL van dentro). No agregues dependencias externas en tiempo de ejecución.
- El backend es **Google Apps Script** (`integracion/Code.gs`), desplegado desde la cuenta camiloorozcofx@gmail.com. Cada cambio en `Code.gs` exige que Juan Camilo publique una **Nueva versión** de la implementación (la URL no cambia).
- El Apps Script desplegado es v10 (exige sesión) desde el 29 oct 2026; por eso la dirección ya puede estar en el repositorio público.
- **No publiques en `main`** (GitHub Pages) cambios que dependan de un Apps Script que todavía no esté desplegado.
- Nunca escribas contraseñas ni códigos de acceso: Juan Camilo inicia sus sesiones él mismo.
- Prohibido el **morado** como color de estado. Usa la paleta y el semáforo de `docs/MAESTRO.md` §8.
- Prueba cada cambio con Playwright (1440×900, 1024×768 y 390×844, en claro y oscuro), con un servidor simulado del Apps Script, y revisa las capturas.
- Commits en español.

## Comandos
```bash
python3 -m http.server 8790          # servir en local → http://localhost:8790/
node -e "const s=require('fs').readFileSync('index.html','utf8');const m=[...s.matchAll(/<script>([\s\S]*?)<\/script>/g)].pop();new Function(m[1]);console.log('ok')"   # revisar sintaxis del JS de la app
```

## Ramas
- `main` → publicada en https://camilofx2.github.io/comunicacion-360/ (**v10**, cuentas propias, desde el 29 oct 2026)
- `demo-lunes` → foto de la demo inicial
- Prueba local sin tocar Gmail ni Drive: `prueba_local/servidor_prueba.py` en la carpeta del Mac (`03_PLATAFORMA/`), que imita el Apps Script v10 en `http://localhost:8795`.
