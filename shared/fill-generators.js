/* Pure, bounded sequence generation shared by Figma and MasterGo. */
function smartSeriesError(zh, en) {
  return new Error(typeof curLang !== 'undefined' && curLang === 'en' ? en : zh);
}

function smartSeriesNumber(value, fallback) {
  const result = value === undefined || value === null || value === '' ? fallback : Number(value);
  if (!Number.isFinite(result)) throw smartSeriesError('请填写有效的数字参数', 'Enter valid numeric parameters.');
  return result;
}

function validateSmartSeriesCount(count) {
  if (!Number.isSafeInteger(count) || count < 0 || count > 10000) {
    throw smartSeriesError('单次最多填充 10,000 个文本，请分批处理', 'Fill up to 10,000 text layers at a time. Split larger selections into batches.');
  }
}

function formatSmartNumber(value, settings) {
  const number = Number(value);
  if (!Number.isFinite(number) || Math.abs(number) > Number.MAX_SAFE_INTEGER) {
    throw smartSeriesError('数列超出安全数值范围，请减小起始值、公比或填充数量', 'The series exceeds the safe numeric range. Reduce the starting value, ratio or count.');
  }
  const decimals = Math.max(0, Math.min(8, Math.floor(smartSeriesNumber(settings.decimals, 0))));
  if (settings.thousands) return number.toLocaleString('en-US', { minimumFractionDigits:decimals, maximumFractionDigits:decimals });
  return decimals > 0 ? number.toFixed(decimals) : String(Math.round(number));
}

function generateSmartNumberSeries(count, settings) {
  validateSmartSeriesCount(count);
  const type = settings.sequenceType || 'arithmetic';
  const start = smartSeriesNumber(settings.start, 0);
  const step = smartSeriesNumber(settings.step, 1);
  const ratio = smartSeriesNumber(settings.ratio, 2);
  let a = start;
  let b = smartSeriesNumber(settings.second, start + step);
  const result = [];
  // 6k ± 1 candidates halve trial divisions without allocating a huge sieve.
  const isPrime = n => {
    if (n < 2) return false;
    if (n % 2 === 0) return n === 2;
    if (n % 3 === 0) return n === 3;
    for (let d = 5; d * d <= n; d += 6) if (n % d === 0 || n % (d + 2) === 0) return false;
    return true;
  };
  let prime = Math.max(2, Math.ceil(start));
  let factorial = 1;
  let factorialN = 0;
  for (let index = 0; index < count; index++) {
    let value;
    if (type === 'natural') value = start + index;
    else if (type === 'odd') value = (Math.floor(start) % 2 === 0 ? Math.floor(start) + 1 : Math.floor(start)) + index * 2;
    else if (type === 'even') value = (Math.floor(start) % 2 === 0 ? Math.floor(start) : Math.floor(start) + 1) + index * 2;
    else if (type === 'geometric') value = start * Math.pow(ratio, index);
    else if (type === 'fibonacci') { value = a; const next = a + b; a = b; b = next; }
    else if (type === 'prime') {
      if (prime > 10000000) throw smartSeriesError('质数序列上限为 10,000,000，请减小起始值或数量', 'Prime sequences are limited to 10,000,000. Reduce the start or count.');
      while (!isPrime(prime)) {
        prime += prime > 2 && prime % 2 ? 2 : 1;
        if (prime > 10000000) throw smartSeriesError('质数序列超出计算上限', 'Prime sequence exceeds the computation limit.');
      }
      value = prime++;
    } else if (type === 'square') value = Math.pow(start + index, 2);
    else if (type === 'triangular') { const n = start + index; value = n * (n + 1) / 2; }
    else if (type === 'factorial') {
      const n = start + index;
      if (!Number.isInteger(n) || n < 0 || n > 18) throw smartSeriesError('精确阶乘支持 0–18 的整数，请调整起始值或数量', 'Exact factorials support integers 0–18. Adjust the start or count.');
      while (factorialN < n) factorial *= ++factorialN;
      value = factorial;
    } else value = start + step * index;
    result.push(formatSmartNumber(value, settings));
  }
  return result;
}

function generateSmartTimeSeries(count, settings) {
  validateSmartSeriesCount(count);
  const match = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/.exec(String(settings.start || '00:00:00'));
  if (!match || +match[1] > 23 || +match[2] > 59 || +(match[3] || 0) > 59) throw smartSeriesError('起始时间请填写 00:00:00–23:59:59', 'Enter a start time from 00:00:00 to 23:59:59.');
  const start = +match[1] * 3600 + +match[2] * 60 + +(match[3] || 0);
  const step = smartSeriesNumber(settings.stepSeconds, 900);
  if (!Number.isSafeInteger(step)) throw smartSeriesError('时间步长须为整数秒', 'The time interval must be a whole number of seconds.');
  // Normalize the interval before multiplication to avoid overflow on large steps.
  return Array.from({ length:count }, (_, index) => {
    const total = ((start + index * (step % 86400)) % 86400 + 86400) % 86400;
    const h = String(Math.floor(total / 3600)).padStart(2, '0');
    const m = String(Math.floor(total % 3600 / 60)).padStart(2, '0');
    const s = String(total % 60).padStart(2, '0');
    const format = settings.format || 'HH:mm:ss';
    if (format === 'HH:mm') return `${h}:${m}`;
    if (format === 'mm:ss') return `${m}:${s}`;
    if (format === 'H:m:s') return `${Number(h)}:${Number(m)}:${Number(s)}`;
    if (format === 'cn_long') return `${h}时${m}分${s}秒`;
    return `${h}:${m}:${s}`;
  });
}
