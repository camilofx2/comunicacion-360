/**
 * Comunicación 360 — integración con Google Drive y Gmail
 * ---------------------------------------------------------
 * Se despliega como "Aplicación web" en script.google.com con la cuenta
 * que será el remitente (hoy: tu Gmail; en producción: comunicaciones@).
 *
 * Qué hace por cada evento que manda la plataforma:
 *   crear       → carpeta  Comunicación 360 / AAAA-MM / C360-0001 · Título /
 *                   brief.txt, historial.txt, 01_adjuntos/, 02_propuestas/, 03_entrega/
 *                 sube los adjuntos y envía correo al solicitante (+ copia al gestor)
 *   asignar, prioridad*, devuelta, aprobada → anota historial y avisa por correo
 *   propuesta   → sube la imagen a 02_propuestas/ y avisa al solicitante
 *   ajustes     → anota los puntos marcados y avisa al diseñador
 *   entrega     → sube el archivo final a 03_entrega/, comparte la carpeta
 *                 con el solicitante y envía el correo de entrega con el enlace
 *
 * Los correos salen desde la cuenta que desplegó el script. Si el archivo final
 * pesa menos de 10 MB también va adjunto; si no, solo el enlace a Drive.
 */

const ROOT_NAME = 'Comunicación 360';
const ATTACH_LIMIT = 10 * 1024 * 1024; // 10 MB

function doGet(e) {
  const root = getOrCreateFolder_(DriveApp.getRootFolder(), ROOT_NAME);
  return json_({ ok: true, account: Session.getActiveUser().getEmail() || 'cuenta del script', root: root.getUrl() });
}

function doPost(e) {
  try {
    const p = JSON.parse(e.postData.contents);
    const r = p.request;
    const folder = requestFolder_(r);
    const files = [];
    let message = '';

    if (p.action === 'crear') {
      saveText_(folder, 'brief.txt', brief_(r, p.org));
      const adj = getOrCreateFolder_(folder, '01_adjuntos');
      (p.files || []).forEach(f => files.push(saveDataUrl_(adj, f)));
      appendHistory_(folder, 'Solicitud creada por ' + who_(r.requester));
      if (r.requester && r.requester.email) folder.addViewer(r.requester.email);
      sendMail_(p, r, r.requester, `Recibimos tu solicitud: ${r.title}`,
        `Registramos tu solicitud <b>${r.id}</b>.<br>Fecha requerida: <b>${fecha_(r.due)}</b>${r.priority ? ' (prioridad pendiente de aprobación)' : ''}.<br>Posición en la fila: ${r.queuePos} de ${r.queueLen}.`,
        folder);
      if (p.gestor) sendMail_(p, r, { email: p.gestor, name: 'Gestor' }, `Nueva solicitud ${r.priority ? '· PRIORIDAD ' : ''}· ${r.title}`,
        `${who_(r.requester)} envió una solicitud.<br>Fecha requerida: ${fecha_(r.due)}.${r.priority ? '<br>Justificación: ' + esc_(r.priority.reason) : ''}<br><br><pre style="white-space:pre-wrap;font-family:inherit">${esc_(r.pieceText)}</pre>`, folder);
      message = 'Carpeta creada en Drive y correos enviados';
    }

    if (p.action === 'asignar') {
      appendHistory_(folder, 'Asignada a ' + who_(r.assignee));
      sendMail_(p, r, r.requester, `Tu solicitud fue asignada`, `<b>${esc_(r.title)}</b> quedó asignada a ${who_(r.assignee)}.`, folder);
      if (r.assignee) sendMail_(p, r, r.assignee, `Nueva asignación: ${r.title}`, `Se te asignó <b>${esc_(r.title)}</b> (${esc_(r.type)}). Fecha de trabajo: ${fecha_(r.due)}.`, folder);
      message = 'Asignación registrada y notificada';
    }

    if (p.action === 'prioridad') {
      appendHistory_(folder, 'Pidió prioridad para ' + r.due + ': ' + (r.priority && r.priority.reason));
      if (p.gestor) sendMail_(p, r, { email: p.gestor, name: 'Gestor' }, `Solicitud de prioridad: ${r.title}`, `${who_(r.requester)} pide la pieza para <b>${fecha_(r.due)}</b> (estándar ${fecha_(r.minDue)}).<br>Motivo: ${esc_(r.priority.reason)}`, folder);
      message = 'Prioridad enviada al gestor';
    }
    if (p.action === 'prioridad_aprobada') { appendHistory_(folder, 'Prioridad aprobada'); sendMail_(p, r, r.requester, 'Prioridad aprobada', `Se aprobó la prioridad de <b>${esc_(r.title)}</b>. Fecha de entrega: ${fecha_(r.due)}.`, folder); message = 'Prioridad aprobada y notificada'; }
    if (p.action === 'prioridad_rechazada') { appendHistory_(folder, 'Prioridad no aprobada; fecha estándar ' + r.minDue); sendMail_(p, r, r.requester, 'Fecha de tu solicitud', `No fue posible priorizar <b>${esc_(r.title)}</b>. Fecha de entrega: ${fecha_(r.minDue)}.`, folder); message = 'Decisión notificada'; }

    if (p.action === 'devuelta') {
      appendHistory_(folder, 'Devuelta: ' + p.reason);
      sendMail_(p, r, r.requester, 'Falta información en tu solicitud', `Para avanzar con <b>${esc_(r.title)}</b> necesitamos: ${esc_(p.reason)}<br>Complétala desde la plataforma.`, folder);
      message = 'Devolución notificada';
    }

    if (p.action === 'propuesta') {
      const prop = getOrCreateFolder_(folder, '02_propuestas');
      const saved = (p.files || []).map(f => saveDataUrl_(prop, f, 'v' + ((r.rounds || 0) + 1) + '_'));
      files.push.apply(files, saved);
      appendHistory_(folder, 'Propuesta enviada para aprobación: ' + saved.map(s => s.name).join(', '));
      sendMail_(p, r, r.requester, 'Propuesta lista para tu aprobación', `La propuesta de <b>${esc_(r.title)}</b> está lista.<br>Entra a la plataforma, apruébala o marca sobre la imagen qué cambiar.`, folder, saved);
      message = 'Propuesta guardada en Drive y notificada';
    }

    if (p.action === 'ajustes') {
      const txt = (p.pins || []).map((x, i) => (i + 1) + '. ' + x.t).join('\n') + (p.note ? '\nNota: ' + p.note : '');
      appendHistory_(folder, 'Ajustes ronda ' + r.rounds + ':\n' + txt);
      saveText_(getOrCreateFolder_(folder, '02_propuestas'), 'ajustes_ronda' + r.rounds + '.txt', txt);
      if (r.assignee) sendMail_(p, r, r.assignee, `Ajustes solicitados · ronda ${r.rounds}`, `${who_(r.requester)} marcó ${(p.pins || []).length} ajuste(s) en <b>${esc_(r.title)}</b>:<br><pre style="white-space:pre-wrap;font-family:inherit">${esc_(txt)}</pre>`, folder);
      message = 'Ajustes registrados y notificados';
    }

    if (p.action === 'aprobada') {
      appendHistory_(folder, 'Pieza aprobada por ' + who_(r.requester));
      if (r.assignee) sendMail_(p, r, r.assignee, 'Pieza aprobada', `${who_(r.requester)} aprobó <b>${esc_(r.title)}</b>. Puedes hacer la entrega final.`, folder);
      message = 'Aprobación registrada';
    }

    if (p.action === 'entrega') {
      const ent = getOrCreateFolder_(folder, '03_entrega');
      const saved = (p.files || []).map(f => saveDataUrl_(ent, f));
      files.push.apply(files, saved);
      appendHistory_(folder, 'Entregada: ' + saved.map(s => s.name).join(', '));
      if (r.requester && r.requester.email) folder.addViewer(r.requester.email);
      sendMail_(p, r, r.requester, `Entrega final: ${r.title}`, `Tu pieza <b>${esc_(r.title)}</b> está lista.<br>La encuentras en tu carpeta de Drive (botón abajo)${saved.length ? ' y adjunta a este correo' : ''}.<br><br>Esta solicitud queda cerrada y archivada.`, folder, saved, true);
      if (p.gestor) sendMail_(p, r, { email: p.gestor, name: 'Gestor' }, `Entregada: ${r.title}`, `Pieza entregada a ${who_(r.requester)}.`, folder);
      message = 'Entrega guardada en Drive y enviada por correo';
    }

    return json_({ ok: true, message, folderUrl: folder.getUrl(), files: files.map(f => ({ name: f.name, url: f.url })) });
  } catch (err) {
    return json_({ ok: false, message: 'Error: ' + err.message });
  }
}

/* ---------- Drive ---------- */
function requestFolder_(r) {
  const root = getOrCreateFolder_(DriveApp.getRootFolder(), ROOT_NAME);
  const ym = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM');
  const month = getOrCreateFolder_(root, ym);
  return getOrCreateFolder_(month, r.id + ' · ' + r.title);
}
function getOrCreateFolder_(parent, name) {
  const it = parent.getFoldersByName(name);
  return it.hasNext() ? it.next() : parent.createFolder(name);
}
function saveText_(folder, name, text) {
  const it = folder.getFilesByName(name);
  if (it.hasNext()) { const f = it.next(); f.setContent(text); return f; }
  return folder.createFile(name, text, MimeType.PLAIN_TEXT);
}
function appendHistory_(folder, line) {
  const stamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm');
  const it = folder.getFilesByName('historial.txt');
  const prev = it.hasNext() ? it.next().getBlob().getDataAsString() : '';
  saveText_(folder, 'historial.txt', prev + stamp + ' — ' + line + '\n');
}
function saveDataUrl_(folder, f, prefix) {
  const data = String(f.data || '');
  const m = data.match(/^data:([^;]+);base64,(.*)$/);
  const mime = m ? m[1] : (f.mime || 'application/octet-stream');
  const bytes = Utilities.base64Decode(m ? m[2] : data);
  const name = (prefix || '') + f.name;
  const blob = Utilities.newBlob(bytes, mime, name);
  const file = folder.createFile(blob);
  return { name: name, url: file.getUrl(), id: file.getId(), size: bytes.length, mime: mime };
}
function brief_(r, org) {
  return [
    'COMUNICACIÓN 360 · BRIEF ' + r.id, org || '', '',
    'Solicitud: ' + r.title, 'Tipo: ' + r.type, 'Dónde se ve: ' + (r.formats || []).join(', '),
    'Objetivo: ' + r.objective, 'Público: ' + (r.audience || []).join(', '),
    'Solicitante: ' + who_(r.requester) + ' · ' + (r.requester && r.requester.area),
    'Fecha requerida: ' + r.due + ' · estándar: ' + r.minDue,
    r.priority ? 'PRIORIDAD: ' + r.priority.reason : '', '',
    'CONTEXTO', r.context || '', '',
    'TEXTO DENTRO DE LA PIEZA', r.pieceText || '', '',
    r.logos ? 'Logos: ' + r.logos : '', r.refLink ? 'Referencia: ' + r.refLink : ''
  ].join('\n');
}

/* ---------- Gmail ---------- */
function sendMail_(p, r, to, subject, html, folder, saved, attachFinal) {
  if (!to || !to.email) return;
  const sym = 'https://camilofx2.github.io/comunicacion-360/assets/simbolo.svg';
  const body = `
  <div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0B1A33">
    <div style="padding:20px 0 8px;border-bottom:1px solid #E4E9F1;display:flex;align-items:center">
      <img src="${sym}" width="22" height="24" alt="" style="vertical-align:middle;margin-right:10px"><span style="font-size:16px;color:#093169">Comunicaci&oacute;n <b>360</b></span>
    </div>
    <p style="font-size:12px;color:#8E9AB0;margin:14px 0 4px">${esc_(r.id)} &middot; ${esc_(r.status || '')}</p>
    <h2 style="font-size:20px;font-weight:500;color:#093169;margin:0 0 14px">${esc_(subject)}</h2>
    <p style="font-size:15px;line-height:1.55">Hola, ${esc_(first_(to.name))}:</p>
    <p style="font-size:15px;line-height:1.55">${html}</p>
    ${saved && saved.length ? '<p style="font-size:14px">' + saved.map(s => '<a href="' + s.url + '">' + esc_(s.name) + '</a>').join(' &middot; ') + '</p>' : ''}
    ${r.history ? '<details style="margin:14px 0"><summary style="font-size:13px;color:#56637A;cursor:pointer">Historial de la solicitud</summary><pre style="white-space:pre-wrap;font-family:inherit;font-size:12.5px;color:#56637A;line-height:1.5;margin:8px 0 0">' + esc_(r.history) + '</pre></details>' : ''}
    <p style="margin:22px 0"><a href="${folder.getUrl()}" style="background:#093169;color:#fff;text-decoration:none;padding:12px 18px;border-radius:10px;font-size:14px">Abrir carpeta en Drive</a></p>
    <p style="font-size:12.5px;color:#8E9AB0;line-height:1.5">Los ajustes se piden desde la plataforma, no respondiendo este correo. Este mensaje y la carpeta de Drive son el respaldo de la solicitud.</p>
  </div>`;
  const opts = { htmlBody: body, name: 'Comunicación 360' };
  if (p.gestor && to.email !== p.gestor) opts.cc = p.gestor;
  if (attachFinal && saved && saved.length) {
    const att = saved.filter(s => s.size < ATTACH_LIMIT).map(s => DriveApp.getFileById(s.id).getBlob());
    if (att.length) opts.attachments = att;
  }
  GmailApp.sendEmail(to.email, '[' + r.id + '] ' + subject, 'Abre este correo en un cliente con HTML. Carpeta: ' + folder.getUrl(), opts);
}

/* ---------- utils ---------- */
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function esc_(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
function who_(u) { return u ? (u.name + (u.email ? ' <' + u.email + '>' : '')) : '—'; }
function first_(n) { return String(n || '').split(' ')[0]; }
function fecha_(iso) { if (!iso) return ''; const [y, m, d] = iso.split('-').map(Number); return Utilities.formatDate(new Date(y, m - 1, d), Session.getScriptTimeZone(), "EEE d 'de' MMM"); }
