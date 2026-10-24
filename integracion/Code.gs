/**
 * Comunicación 360 — integración con Google Drive y Gmail
 * ---------------------------------------------------------
 * Se despliega como "Aplicación web" en script.google.com con la cuenta
 * remitente (hoy: Gmail de Camilo; en producción: comunicaciones@empresa).
 * La plataforma le envía un JSON por evento. Política de correos:
 *
 *   crear      → aviso al gestor/supervisor (nueva solicitud) + confirmación corta al solicitante
 *   prioridad  → aviso al gestor
 *   devuelta   → aviso al solicitante (falta información)
 *   propuesta  → aviso al solicitante (hay una propuesta para aprobar en la plataforma)
 *   entrega    → crea la carpeta en Drive, sube brief, historial, adjuntos, propuestas y
 *                archivo final, comparte la carpeta con el solicitante y le envía UN correo
 *                con código, enlace a la carpeta e historial completo (cambios, prioridad)
 *
 * Todo lo demás (asignar, en diseño, ajustes, aprobada) no genera correo: queda en el
 * historial y se ve en la plataforma.
 */

const ROOT_NAME = 'Comunicación 360';
const ATTACH_LIMIT = 10 * 1024 * 1024; // 10 MB: por encima, solo enlace

function doGet(e) {
  const root = getOrCreateFolder_(DriveApp.getRootFolder(), ROOT_NAME);
  return json_({ ok: true, account: Session.getEffectiveUser().getEmail() || 'cuenta del script', root: root.getUrl() });
}

function doPost(e) {
  try {
    const p = JSON.parse(e.postData.contents);
    const r = p.request;
    let message = 'Registrado', folderUrl = r.driveUrl || null, files = [];

    if (p.action === 'crear') {
      sendMail_(p, r, r.requester, 'Recibimos tu solicitud: ' + r.title,
        'Registramos tu solicitud <b>' + esc_(r.id) + '</b>. Fecha requerida: <b>' + fecha_(r.due) + '</b>' + (r.priority ? ' (prioridad pendiente de aprobación)' : '') +
        '.<br>Posición en la fila: ' + r.queuePos + ' de ' + r.queueLen + '. Te avisaremos cuando haya una propuesta para aprobar y cuando esté entregada.', null, false);
      sendMail_(p, r, gestor_(p), 'Nueva solicitud ' + (r.priority ? '· PRIORIDAD ' : '') + '· ' + r.title,
        who_(r.requester) + ' (' + esc_(r.requester && r.requester.area) + ') envió una solicitud.<br>Tipo: ' + esc_(r.type) + ' · Fecha requerida: ' + fecha_(r.due) +
        (r.priority ? '<br>Justificación de prioridad: ' + esc_(r.priority.reason) : '') +
        '<br><br><b>Texto de la pieza</b><pre style="white-space:pre-wrap;font-family:inherit">' + esc_(r.pieceText) + '</pre>', null, false);
      message = 'Supervisor notificado';
    }

    if (p.action === 'prioridad') {
      sendMail_(p, r, gestor_(p), 'Solicitud de prioridad: ' + r.title,
        who_(r.requester) + ' pide la pieza para <b>' + fecha_(r.due) + '</b> (estándar ' + fecha_(r.minDue) + ').<br>Motivo: ' + esc_(r.priority && r.priority.reason), null, false);
      message = 'Prioridad enviada al supervisor';
    }

    if (p.action === 'devuelta') {
      sendMail_(p, r, r.requester, 'Falta información en tu solicitud',
        'Para avanzar con <b>' + esc_(r.title) + '</b> necesitamos: ' + esc_(p.reason) + '<br>Complétala desde la plataforma; el plazo cuenta desde que esté completa.', null, false);
      message = 'Solicitante notificado';
    }

    if (p.action === 'propuesta') {
      sendMail_(p, r, r.requester, 'Propuesta lista para tu aprobación',
        'La propuesta de <b>' + esc_(r.title) + '</b> está lista. Entra a la plataforma, apruébala o marca sobre la imagen qué cambiar (quedan ' + (p.roundsLeft != null ? p.roundsLeft : '') + ' ronda(s)).', null, false);
      message = 'Solicitante notificado';
    }

    if (p.action === 'entrega') {
      const folder = requestFolder_(r);
      folderUrl = folder.getUrl();
      saveText_(folder, 'brief.txt', brief_(r, p.org));
      saveText_(folder, 'historial.txt', r.history || '');
      const adj = getOrCreateFolder_(folder, '01_adjuntos');
      (p.attachments || []).forEach(function (f) { files.push(saveDataUrl_(adj, f)); });
      const prop = getOrCreateFolder_(folder, '02_propuestas');
      (p.proposals || []).forEach(function (f) { files.push(saveDataUrl_(prop, f)); });
      if (p.adjustmentsText) saveText_(prop, 'ajustes.txt', p.adjustmentsText);
      const ent = getOrCreateFolder_(folder, '03_entrega');
      const finals = (p.files || []).map(function (f) { return saveDataUrl_(ent, f); });
      files.push.apply(files, finals);
      if (r.requester && r.requester.email) { try { folder.addViewer(r.requester.email); } catch (err) {} }

      const resumen = [
        r.priority ? 'Prioridad: ' + (r.priority.status === 'aprobada' ? 'aprobada' : 'no aprobada') + ' — ' + esc_(r.priority.reason) : 'Sin prioridad',
        'Rondas de ajustes: ' + (r.rounds || 0),
        'Solicitada: ' + fecha_(r.created) + ' · Entregada: ' + fecha_(r.delivered || Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd'))
      ].join('<br>');
      sendMail_(p, r, r.requester, 'Entrega final: ' + r.title,
        'Tu pieza <b>' + esc_(r.title) + '</b> está lista. Todo el material (brief, versiones y archivo final) está en tu carpeta de Drive.' +
        '<br><br><b>Resumen</b><br>' + resumen +
        '<br><br>Para cualquier novedad o ajuste cita el código <b>' + esc_(r.id) + '</b> en la plataforma.',
        folder, true, finals);
      sendMail_(p, r, gestor_(p), 'Entregada: ' + r.title, 'Pieza entregada a ' + who_(r.requester) + '. Carpeta y archivos en Drive.', folder, false);
      message = 'Carpeta creada en Drive, archivo subido y correo de entrega enviado';
    }

    return json_({ ok: true, message: message, folderUrl: folderUrl, files: files.map(function (f) { return { name: f.name, url: f.url }; }) });
  } catch (err) {
    return json_({ ok: false, message: 'Error: ' + err.message });
  }
}

/* ---------- Drive ---------- */
function requestFolder_(r) {
  const root = getOrCreateFolder_(DriveApp.getRootFolder(), ROOT_NAME);
  const ym = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM');
  return getOrCreateFolder_(getOrCreateFolder_(root, ym), r.id + ' · ' + r.title);
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
function saveDataUrl_(folder, f) {
  const data = String(f.data || '');
  const m = data.match(/^data:([^;]+);base64,(.*)$/);
  const mime = m ? m[1] : (f.mime || 'application/octet-stream');
  const bytes = Utilities.base64Decode(m ? m[2] : data);
  const file = folder.createFile(Utilities.newBlob(bytes, mime, f.name));
  return { name: f.name, url: file.getUrl(), id: file.getId(), size: bytes.length };
}
function brief_(r, org) {
  return [
    'COMUNICACIÓN 360 · BRIEF ' + r.id, org || '', '',
    'Solicitud: ' + r.title, 'Tipo: ' + r.type, 'Dónde se ve: ' + (r.formats || []).join(', '),
    'Objetivo: ' + r.objective, 'Público: ' + (r.audience || []).join(', '),
    'Solicitante: ' + who_(r.requester) + ' · ' + (r.requester && r.requester.area),
    'Diseñador: ' + who_(r.assignee),
    'Fecha requerida: ' + r.due + ' · estándar: ' + r.minDue,
    r.priority ? 'PRIORIDAD (' + r.priority.status + '): ' + r.priority.reason : '', '',
    'CONTEXTO', r.context || '', '',
    'TEXTO DENTRO DE LA PIEZA', r.pieceText || '', '',
    r.logos ? 'Logos: ' + r.logos : '', r.refLink ? 'Referencia: ' + r.refLink : ''
  ].join('\n');
}

/* ---------- Gmail ---------- */
function gestor_(p) { return p.gestor ? { email: p.gestor, name: 'Supervisor' } : null; }
function sendMail_(p, r, to, subject, html, folder, withHistory, finals) {
  if (!to || !to.email) return;
  const sym = 'https://camilofx2.github.io/comunicacion-360/assets/simbolo.svg';
  const body =
    '<div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0B1A33">' +
    '<div style="padding:20px 0 10px;border-bottom:1px solid #E4E9F1"><img src="' + sym + '" width="22" height="24" alt="" style="vertical-align:middle;margin-right:10px"><span style="font-size:16px;color:#093169;vertical-align:middle">Comunicaci&oacute;n <b>360</b></span></div>' +
    '<p style="font-size:12px;color:#8E9AB0;margin:14px 0 4px">' + esc_(r.id) + ' &middot; ' + esc_(r.status || '') + (p.org ? ' &middot; ' + esc_(p.org) : '') + '</p>' +
    '<h2 style="font-size:20px;font-weight:500;color:#093169;margin:0 0 14px">' + esc_(subject) + '</h2>' +
    '<p style="font-size:15px;line-height:1.55">Hola, ' + esc_(first_(to.name)) + ':</p>' +
    '<p style="font-size:15px;line-height:1.55">' + html + '</p>' +
    (finals && finals.length ? '<p style="font-size:14px">Archivo final: ' + finals.map(function (s) { return '<a href="' + s.url + '">' + esc_(s.name) + '</a>'; }).join(' &middot; ') + '</p>' : '') +
    (folder ? '<p style="margin:22px 0"><a href="' + folder.getUrl() + '" style="background:#093169;color:#ffffff;text-decoration:none;padding:12px 18px;border-radius:10px;font-size:14px">Abrir carpeta en Drive</a></p>' : '') +
    (withHistory && r.history ? '<p style="font-size:13px;color:#56637A;margin:18px 0 6px"><b>Historial de la solicitud</b></p><pre style="white-space:pre-wrap;font-family:inherit;font-size:12.5px;color:#56637A;line-height:1.55;margin:0;padding:12px 14px;background:#F2F5F9;border-radius:10px">' + esc_(r.history) + '</pre>' : '') +
    '<p style="font-size:12.5px;color:#8E9AB0;line-height:1.5;margin-top:22px">Las novedades y ajustes se gestionan en la plataforma citando el c&oacute;digo ' + esc_(r.id) + ', no respondiendo este correo.</p>' +
    '</div>';
  const opts = { htmlBody: body, name: 'Comunicación 360' };
  if (finals && finals.length) {
    const att = finals.filter(function (s) { return s.size < ATTACH_LIMIT; }).map(function (s) { return DriveApp.getFileById(s.id).getBlob(); });
    if (att.length) opts.attachments = att;
  }
  GmailApp.sendEmail(to.email, '[' + r.id + '] ' + subject, 'Abre este correo en un cliente con HTML.' + (folder ? ' Carpeta: ' + folder.getUrl() : ''), opts);
}

/* ---------- utils ---------- */
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function esc_(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
function who_(u) { return u ? esc_(u.name) + (u.email ? ' &lt;' + esc_(u.email) + '&gt;' : '') : '—'; }
function first_(n) { return String(n || '').split(' ')[0]; }
function fecha_(iso) { if (!iso) return ''; const s = String(iso).slice(0, 10); const a = s.split('-').map(Number); if (a.length < 3 || isNaN(a[0])) return s; return Utilities.formatDate(new Date(a[0], a[1] - 1, a[2]), Session.getScriptTimeZone(), "EEE d 'de' MMM"); }
