/* Keep the copy prerequisite visible while the export steps are in use. The
   existing localized text nodes also update inside the native disclosure. */
(() => {
  const tips = document.querySelector('#pptPanel .ppt-tips');
  const title = tips.querySelector('b');
  const list = tips.querySelector('ul');
  const prerequisite = list.firstElementChild;
  const required = document.createElement('ul');
  required.className = 'ppt-prerequisite';
  required.append(prerequisite);
  const details = document.createElement('details');
  const summary = document.createElement('summary');
  summary.append(title);
  details.append(summary, list);
  tips.replaceChildren(required, details);
})();
