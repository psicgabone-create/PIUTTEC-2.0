/* Script integrado en piuttec 2.0 para el uso de avisos de privacidad y proteccion de los datos personales de los Estudiantes
/* PIUTTEC 2.0 - Módulo de privacidad y protección de datos personales
 * Uso: agregar  <script src="privacidad.js"></script>  justo antes de </body>
 * (después del <script> principal). Completa los datos de PRIV_CONFIG.
 */
(function () {
  'use strict';

  // ====== 1. DATOS A COMPLETAR CON LA UNIDAD DE TRANSPARENCIA ======
  const PRIV_CONFIG = {
    responsable: 'Universidad Tecnológica de Tecámac (UTTEC)',
    domicilio: '[COMPLETAR: domicilio oficial completo, C.P., Tecámac, Estado de México]',
    correoUT: '[COMPLETAR: correo de la Unidad de Transparencia]',
    telefono: '[COMPLETAR: teléfono y extensión]',
    horario: '[COMPLETAR: horario de atención]',
    fundamento: '[COMPLETAR: ley general y ley estatal de protección de datos personales en posesión de sujetos obligados; decreto de creación de la UTTEC; reglamento de alumnos]',
    organoGarante: '[COMPLETAR: órgano garante estatal vigente]',
    conservacion: '[COMPLETAR: plazos según catálogo de disposición documental]',
    fechaActualizacion: '12 de noviembre de 2026',
    version: '1.0'
  };
  const CONSENT_KEY = 'PIUTTEC_PRIVACY_V1';
  const ESTADO_KEY = 'UNIPORTAL_PRO_STATE_V1'; // clave usada por la app principal

  // ====== 2. UTILIDADES ======
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const getConsent = () => { try { return JSON.parse(localStorage.getItem(CONSENT_KEY)); } catch (e) { return null; } };
  const setConsent = c => { try { localStorage.setItem(CONSENT_KEY, JSON.stringify(c)); } catch (e) {} };
  const toast = (m, t) => { if (typeof showToast === 'function') showToast(m, t || 'info'); };

  // ====== 3. SANEAR DATOS CAPTURADOS (evita inyección de HTML/scripts en innerHTML) ======
  // Reemplaza < y > en todo texto del estado. Es idempotente.
  function sanitizeDeep(o) {
    if (typeof o === 'string') return o.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (Array.isArray(o)) return o.map(sanitizeDeep);
    if (o && typeof o === 'object') { Object.keys(o).forEach(k => { o[k] = sanitizeDeep(o[k]); }); }
    return o;
  }
  try {
    if (typeof appState !== 'undefined') sanitizeDeep(appState);
    if (typeof saveState === 'function') {
      const originalSave = saveState;
      window.saveState = function () { sanitizeDeep(appState); return originalSave.apply(this, arguments); };
    }
  } catch (e) { console.warn('Sanitización no aplicada', e); }

  // ====== 4. TEXTOS DEL AVISO ======
  const C = PRIV_CONFIG;
  const avisoSimplificado = `
    <p><strong>${esc(C.responsable)}</strong> es responsable del tratamiento de sus datos personales.</p>
    <p class="mt-2"><strong>Finalidades necesarias:</strong> identificarle, mostrar y administrar sus materias, calificaciones y asistencias, gestionar sus archivos, atender solicitudes de salones y equipo, organizar su agenda y garantizar la seguridad de la plataforma.</p>
    <p class="mt-2"><strong>Finalidades adicionales (opcionales):</strong> avisos institucionales no obligatorios, encuestas y tutorías basadas en su refuerzo académico.</p>
    <p class="mt-2"><strong>Transferencias:</strong> no se transfieren sus datos, salvo a autoridades competentes cuando la ley lo exija.</p>
    <p class="mt-2">Puede ejercer sus derechos de Acceso, Rectificación, Cancelación y Oposición (ARCO) en la sección <em>Privacidad</em> o ante la Unidad de Transparencia.</p>`;

  const avisoIntegral = `
    <h3 class="font-bold text-sm mt-4">1. Responsable</h3>
    <p>${esc(C.responsable)}, con domicilio en ${esc(C.domicilio)}, es responsable del tratamiento de los datos personales que usted proporcione en PIUTTEC 2.0 y los protegerá conforme a la normativa aplicable.</p>
    <h3 class="font-bold text-sm mt-4">2. Datos personales que se recaban</h3>
    <ul class="list-disc pl-5 space-y-1">
      <li>Identificación y académicos: nombre, matrícula, carrera, cuatrimestre/semestre, materias, horarios, calificaciones y promedio.</li>
      <li>Asistencia: presente, retardo, falta y justificante, con fecha y materia.</li>
      <li>Recursos: solicitudes de salones, laboratorios y equipo (recurso, fecha, horario, motivo, estado).</li>
      <li>Archivos que usted sube: apuntes, tareas, prácticas y guías (nombre, tamaño, fecha).</li>
      <li>Agenda: tareas y fechas de entrega.</li>
      <li>Técnicos: dirección IP, navegador, dispositivo y preferencias de la interfaz.</li>
      <li>Docentes: nombre, correo institucional y cubículo, solo para contacto académico.</li>
    </ul>
    <h3 class="font-bold text-sm mt-4">3. Datos personales sensibles</h3>
    <p>La plataforma no solicita datos sensibles. Si adjunta un justificante médico u otro documento que los contenga, se tratarán solo con su consentimiento expreso y por escrito, limitados a lo indispensable para validar la inasistencia.</p>
    <h3 class="font-bold text-sm mt-4">4. Fundamento legal</h3>
    <p>${esc(C.fundamento)}</p>
    <h3 class="font-bold text-sm mt-4">5. Finalidades</h3>
    <p><strong>Necesarias:</strong> autenticarle; administrar su información académica; controlar su asistencia; gestionar sus archivos; atender solicitudes de salones y equipo; organizar su agenda; operar el simulador de refuerzo; garantizar la seguridad de la plataforma; y elaborar estadísticas disociadas.</p>
    <p class="mt-1"><strong>Adicionales (puede negarse sin afectar sus servicios):</strong> avisos y encuestas no obligatorias; tutorías basadas en resultados de refuerzo académico de forma identificada.</p>
    <h3 class="font-bold text-sm mt-4">6. Transferencias</h3>
    <p>No se transfieren sus datos, salvo a autoridades educativas o competentes cuando una ley lo exija o lo ordene una resolución fundada y motivada. La plataforma carga tipografías, íconos y estilos de servidores de terceros (Google Fonts, cdnjs, Tailwind), que pueden recibir su dirección IP pero no sus datos académicos.</p>
    <h3 class="font-bold text-sm mt-4">7. Almacenamiento local</h3>
    <p>La plataforma guarda en su navegador su configuración y el estado de su información. No usa cookies publicitarias ni de rastreo. Puede borrar estos datos en la sección Privacidad.</p>
    <h3 class="font-bold text-sm mt-4">8. Derechos ARCO y portabilidad</h3>
    <p>Puede acceder a sus datos, rectificarlos, cancelarlos u oponerse a su tratamiento, y solicitar su portabilidad. Presente su solicitud en la Unidad de Transparencia (${esc(C.domicilio)}; ${esc(C.horario)}), por correo a ${esc(C.correoUT)}, por teléfono al ${esc(C.telefono)}, o por la Plataforma Nacional de Transparencia. Si no obtiene respuesta o no le satisface, puede acudir a: ${esc(C.organoGarante)}.</p>
    <h3 class="font-bold text-sm mt-4">9. Revocación del consentimiento</h3>
    <p>Puede revocar su consentimiento para finalidades adicionales o datos sensibles en cualquier momento, sin efectos retroactivos.</p>
    <h3 class="font-bold text-sm mt-4">10. Medidas de seguridad</h3>
    <p>Se mantienen medidas administrativas, físicas y técnicas contra pérdida, acceso no autorizado y alteración. En caso de vulneración que afecte significativamente sus derechos, se le notificará sin dilación.</p>
    <h3 class="font-bold text-sm mt-4">11. Conservación</h3>
    <p>Sus datos se conservan mientras sea alumno activo y después durante: ${esc(C.conservacion)}.</p>
    <h3 class="font-bold text-sm mt-4">12. Cambios al aviso</h3>
    <p>Los cambios se publicarán en esta plataforma. Versión ${esc(C.version)}, última actualización: ${esc(C.fechaActualizacion)}.</p>`;

  // ====== 5. INYECTAR VISTA "PRIVACIDAD" ======
  const main = document.querySelector('main');
  const section = document.createElement('section');
  section.id = 'view-privacidad';
  section.className = 'tab-view hidden fade-in space-y-6';
  section.innerHTML = `
    <div class="max-w-3xl space-y-6">
      <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700">
        <h2 class="text-lg font-bold">Aviso de privacidad integral</h2>
        <div class="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">${avisoIntegral}</div>
      </div>
      <div class="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700 space-y-4">
        <div>
          <h2 class="text-lg font-bold">Mis datos y mis derechos</h2>
          <p class="text-xs text-slate-500 dark:text-slate-400" id="privConsentInfo"></p>
        </div>
        <label class="flex items-start gap-2 text-sm cursor-pointer">
          <input type="checkbox" id="privAdicionales" class="mt-1 w-4 h-4 accent-indigo-600">
          <span>Acepto el uso de mis datos para las finalidades adicionales (avisos no obligatorios, encuestas y tutorías).</span>
        </label>
        <div class="flex flex-wrap gap-2 text-xs">
          <button type="button" id="privExport" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold"><i class="fa-solid fa-download mr-1"></i>Exportar mis datos (acceso y portabilidad)</button>
          <button type="button" id="privDelete" class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold"><i class="fa-regular fa-trash-can mr-1"></i>Borrar mis datos de este dispositivo</button>
        </div>
        <hr class="border-slate-200 dark:border-slate-700">
        <form id="arcoForm" class="space-y-3 text-xs">
          <h3 class="font-bold text-sm">Solicitud de derechos ARCO</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div><label class="block font-semibold mb-1" for="arcoNombre">Nombre completo</label>
              <input id="arcoNombre" required class="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2"></div>
            <div><label class="block font-semibold mb-1" for="arcoContacto">Correo para recibir respuesta</label>
              <input id="arcoContacto" type="email" required class="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2"></div>
          </div>
          <div><label class="block font-semibold mb-1" for="arcoDerecho">Derecho que desea ejercer</label>
            <select id="arcoDerecho" class="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2">
              <option>Acceso</option><option>Rectificación</option><option>Cancelación</option><option>Oposición</option><option>Portabilidad</option>
            </select></div>
          <div><label class="block font-semibold mb-1" for="arcoDescripcion">Descripción clara de los datos y de lo que solicita</label>
            <textarea id="arcoDescripcion" rows="3" required class="w-full rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-3 py-2"></textarea></div>
          <p class="text-slate-500 dark:text-slate-400">Deberá anexar una identificación oficial al presentar la solicitud ante la Unidad de Transparencia.</p>
          <button type="submit" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold">Generar solicitud y enviar por correo</button>
        </form>
      </div>
    </div>`;
  main.appendChild(section);

  // ====== 6. ENTRADA EN MENÚ LATERAL Y ENLACE AL PIE ======
  const nav = document.getElementById('navLinks');
  const navBtn = document.createElement('button');
  navBtn.type = 'button';
  navBtn.dataset.tab = 'privacidad';
  navBtn.setAttribute('onclick', "switchTab('privacidad')");
  navBtn.className = 'nav-btn w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all';
  navBtn.innerHTML = '<i class="fa-solid fa-user-shield w-5 text-center" aria-hidden="true"></i><span>Privacidad y Datos</span>';
  nav.appendChild(navBtn);

  const footerLink = document.createElement('button');
  footerLink.type = 'button';
  footerLink.className = 'w-full text-center text-[11px] text-slate-500 dark:text-slate-400 hover:underline py-2';
  footerLink.textContent = 'Aviso de privacidad';
  footerLink.onclick = () => switchTab('privacidad');
  document.getElementById('sidebar').appendChild(footerLink);

  if (typeof tabTitles !== 'undefined') tabTitles.privacidad = 'Privacidad y Protección de Datos Personales';

  // ====== 7. MODAL DE AVISO SIMPLIFICADO (CONSENTIMIENTO) ======
  const modal = document.createElement('div');
  modal.id = 'modalPrivacidad';
  modal.className = 'fixed inset-0 z-[60] hidden bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'privModalTitle');
  modal.innerHTML = `
    <div class="bg-white dark:bg-slate-800 rounded-2xl max-w-lg w-full p-6 border border-slate-200 dark:border-slate-700 shadow-xl max-h-[90vh] overflow-y-auto">
      <h3 id="privModalTitle" class="font-bold text-base flex items-center gap-2"><i class="fa-solid fa-user-shield text-brand-600"></i> Aviso de privacidad simplificado</h3>
      <div class="text-xs text-slate-700 dark:text-slate-200 leading-relaxed mt-3">${avisoSimplificado}</div>
      <label class="flex items-start gap-2 text-xs mt-4 cursor-pointer">
        <input type="checkbox" id="privModalAdic" class="mt-0.5 w-4 h-4 accent-indigo-600">
        <span>Acepto además las finalidades adicionales (opcional).</span>
      </label>
      <div class="flex flex-wrap justify-end gap-2 pt-4 text-xs">
        <button type="button" id="privModalLeer" class="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 font-medium">Leer aviso integral</button>
        <button type="button" id="privModalOk" class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold">He leído el aviso y continuar</button>
      </div>
    </div>`;
  document.body.appendChild(modal);

  function refreshConsentInfo() {
    const c = getConsent();
    document.getElementById('privAdicionales').checked = !!(c && c.adicionales);
    document.getElementById('privConsentInfo').textContent = c
      ? `Aviso versión ${c.version} aceptado el ${new Date(c.fecha).toLocaleString('es-MX')}.`
      : 'Aún no ha aceptado el aviso de privacidad.';
  }

  document.getElementById('privModalOk').onclick = () => {
    setConsent({ version: C.version, fecha: new Date().toISOString(), adicionales: document.getElementById('privModalAdic').checked });
    modal.classList.add('hidden');
    refreshConsentInfo();
    toast('Aviso de privacidad registrado', 'success');
  };
  document.getElementById('privModalLeer').onclick = () => {
    modal.classList.add('hidden');
    switchTab('privacidad');
    // el usuario aún debe aceptar: se vuelve a mostrar al salir de la vista
    document.getElementById('privAceptarBtn')?.remove();
    const b = document.createElement('button');
    b.id = 'privAceptarBtn'; b.type = 'button';
    b.className = 'px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold';
    b.textContent = 'Ya lo leí: continuar';
    b.onclick = () => { b.remove(); modal.classList.remove('hidden'); };
    section.querySelector('h2').after(b);
  };

  // ====== 8. DERECHOS: EXPORTAR, BORRAR, REVOCAR, SOLICITUD ARCO ======
  document.getElementById('privAdicionales').onchange = e => {
    const c = getConsent() || { version: C.version, fecha: new Date().toISOString() };
    c.adicionales = e.target.checked;
    setConsent(c);
    toast(e.target.checked ? 'Finalidades adicionales aceptadas' : 'Consentimiento adicional revocado', 'info');
  };

  document.getElementById('privExport').onclick = () => {
    const data = { exportado: new Date().toISOString(), consentimiento: getConsent(), datos: appState };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'mis_datos_piuttec.json'; a.click();
    URL.revokeObjectURL(url);
    toast('Datos exportados', 'success');
  };

  document.getElementById('privDelete').onclick = () => {
    if (!confirm('Se borrarán todos los datos guardados en este dispositivo y deberá aceptar el aviso de nuevo. Esta acción no se puede deshacer. ¿Continuar?')) return;
    try { localStorage.removeItem(ESTADO_KEY); localStorage.removeItem(CONSENT_KEY); } catch (e) {}
    location.reload();
  };

  document.getElementById('arcoForm').onsubmit = e => {
    e.preventDefault();
    const cuerpo =
      `Solicitud de ejercicio de derechos ARCO\n\n` +
      `Nombre: ${document.getElementById('arcoNombre').value}\n` +
      `Correo de respuesta: ${document.getElementById('arcoContacto').value}\n` +
      `Derecho: ${document.getElementById('arcoDerecho').value}\n` +
      `Descripción: ${document.getElementById('arcoDescripcion').value}\n\n` +
      `Se anexa identificación oficial.\nFecha: ${new Date().toLocaleString('es-MX')}`;
    window.location.href = `mailto:${encodeURIComponent(C.correoUT)}?subject=${encodeURIComponent('Solicitud ARCO - PIUTTEC 2.0')}&body=${encodeURIComponent(cuerpo)}`;
    toast('Solicitud generada: adjunte su identificación oficial al enviarla', 'success');
  };

  // ====== 9. ARRANQUE ======
  refreshConsentInfo();
  const c = getConsent();
  if (!c || c.version !== C.version) modal.classList.remove('hidden');
})();
