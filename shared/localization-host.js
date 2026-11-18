/* Prepended to the compiled host script; source algorithms call this adapter. */
let pluginUiLanguage = 'zh';
function notifyInUiLanguage(message, options) {
  return __PLUGIN_HOST__.notify(PluginLocale.translate(message, pluginUiLanguage), options);
}
