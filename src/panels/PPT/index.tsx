import { FunctionalComponent } from 'preact';
import { useState, useCallback, useEffect, useRef } from 'preact/hooks';
import { useLanguage } from '../../hooks';
import { PPT_STEPS, PPT_I18N } from './constants';
import type { PPTStep, PPTState, PPTSlide } from './types';
import { generatePPT, generateAssetsZip, createZipInstance } from './generator';
import './styles.css';

const getPPTText = (key: string, lang: 'zh' | 'en'): string => {
  return PPT_I18N[lang]?.[key as keyof typeof PPT_I18N['zh']] || key;
};

export const PPTPanel: FunctionalComponent = () => {
  const [lang] = useLanguage();
  const [stepIndex, setStepIndex] = useState<PPTStep>(1);
  const [state, setState] = useState<PPTState>('idle');
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [scale, setScale] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState('');
  
  const slidesCache = useRef<PPTSlide[]>([]);
  const incomingSlide = useRef<PPTSlide | null>(null);
  const zipInstance = useRef<any>(null);
  const uiUpdatePending = useRef(false);

  const updateUI = useCallback(() => {
    if (state === 'processing') {
      const currentStepKey = `ppt_step${stepIndex}_t`;
      const title = getPPTText(currentStepKey, lang);
      const msg = stepIndex === 4 
        ? getPPTText('ppt_loading_parse', lang)
        : getPPTText('ppt_loading_analyze', lang);
      setLoadingMsg(`${title}...\n${msg}`);
    } else {
      setLoadingMsg('');
    }
  }, [state, stepIndex, lang]);

  useEffect(() => {
    updateUI();
  }, [updateUI]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage;
      if (!msg) return;

      handlePluginMessage(msg);
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handlePluginMessage = useCallback((msg: any) => {
    try {
      if (msg.type === 'ppt-init-total') {
        setLoadingMsg(`准备处理共 ${msg.count} 个画板...`);
      }
      else if (msg.type === 'ppt-start-slide') {
        if (stepIndex === 4) {
          incomingSlide.current = { 
            width: msg.width, 
            height: msg.height, 
            elements: [] 
          };
          if (!uiUpdatePending.current) {
            uiUpdatePending.current = true;
            requestAnimationFrame(() => {
              setLoadingMsg(`正在解析第 ${msg.index + 1} 页...`);
              uiUpdatePending.current = false;
            });
          }
        }
      }
      else if (msg.type === 'ppt-element-batch') {
        if (incomingSlide.current && Array.isArray(msg.data)) {
          incomingSlide.current.elements.push(...msg.data);
        }
      }
      else if (msg.type === 'ppt-end-slide') {
        if (incomingSlide.current) {
          slidesCache.current.push(incomingSlide.current);
          incomingSlide.current = null;
        }
      }
      else if (msg.type === 'ppt-asset-chunk') {
        if (zipInstance.current) {
          zipInstance.current.file(msg.fileName, msg.data);
          if (!uiUpdatePending.current) {
            uiUpdatePending.current = true;
            requestAnimationFrame(() => {
              setLoadingMsg(`正在压缩: ${msg.fileName}`);
              uiUpdatePending.current = false;
            });
          }
        }
      }
      else if (msg.type === 'step-done' && msg.step === stepIndex) {
        if (stepIndex === 4) {
          setLoadingMsg('数据提取完成，生成 PPT...');
          setTimeout(() => {
            generatePPT(slidesCache.current, scale, zipInstance.current)
              .then(() => {
                setState('done');
                if (isAutoRunning) {
                  runNextStep();
                }
              })
              .catch(console.error);
          }, 50);
        } else if (stepIndex === 5) {
          setLoadingMsg('资源打包完成，准备下载...');
          generateAssetsZip(zipInstance.current, true);
          setState('done');
          if (isAutoRunning) {
            setIsAutoRunning(false);
          }
        } else {
          setState('done');
          if (isAutoRunning) {
            runNextStep();
          }
        }
        updateUI();
      }
      else if (msg.type === 'step-error') {
        setState('idle');
        setIsAutoRunning(false);
        alert('执行出错，请重试。');
        updateUI();
      }
    } catch (e) {
      console.error('PPT Error:', e);
      setIsAutoRunning(false);
      setState('idle');
      updateUI();
    }
  }, [stepIndex, scale, isAutoRunning, updateUI]);

  const runNextStep = useCallback(() => {
    if (stepIndex < 6) {
      setTimeout(() => {
        setStepIndex((prev) => (prev + 1) as PPTStep);
        setState('idle');
        setTimeout(() => runCurrentStep(), 1000);
      }, 800);
    } else {
      setIsAutoRunning(false);
    }
  }, [stepIndex]);

  const runCurrentStep = useCallback(() => {
    if (stepIndex === 6) {
      setIsAutoRunning(false);
      updateUI();
      return;
    }

    if (state === 'done') {
      setStepIndex((prev) => (prev + 1) as PPTStep);
      setState('idle');
      if (isAutoRunning) {
        setTimeout(() => runCurrentStep(), 1000);
      }
    } else {
      if (stepIndex === 4) {
        slidesCache.current = [];
        incomingSlide.current = null;
        zipInstance.current = createZipInstance();
      }

      setState('processing');
      updateUI();

      parent.postMessage({
        pluginMessage: { 
          type: `ppt-step-${stepIndex}`, 
          config: { scale } 
        }
      }, '*');
    }
  }, [stepIndex, state, scale, isAutoRunning, updateUI]);

  const startAutoRun = useCallback(() => {
    if (!confirm(getPPTText('ppt_confirm_auto', lang))) return;

    setStepIndex(1);
    setState('idle');
    slidesCache.current = [];
    setIsAutoRunning(true);

    setTimeout(() => runCurrentStep(), 100);
  }, [lang, runCurrentStep]);

  const reset = useCallback(() => {
    if (!confirm(getPPTText('ppt_confirm_reset', lang))) return;

    setStepIndex(1);
    setState('idle');
    slidesCache.current = [];
    setIsAutoRunning(false);
    updateUI();
  }, [lang, updateUI]);

  const getButtonText = () => {
    if (isAutoRunning) return '🤖 Processing...';
    if (stepIndex === 6) return getPPTText('ppt_btn_done', lang);
    if (state === 'done') return getPPTText('ppt_btn_next', lang);
    return getPPTText('ppt_btn_run', lang) + stepIndex;
  };

  const getStepStatus = (stepId: number) => {
    if (stepId < stepIndex || (stepId === stepIndex && state === 'done')) {
      return getPPTText('ppt_stat_done', lang);
    }
    return getPPTText('ppt_stat_wait', lang);
  };

  return (
    <div class="ppt-panel">
      <div class="ppt-dashboard">
        <div class="ppt-tips">
          <b>{getPPTText('ppt_tips_title', lang)}</b>
          <ul>
            <li>{getPPTText('ppt_tip_1', lang)}</li>
            <li>{getPPTText('ppt_tip_2', lang)}</li>
            <li>{getPPTText('ppt_tip_3', lang)}</li>
            <li>{getPPTText('ppt_tip_4', lang)}</li>
            <li>{getPPTText('ppt_tip_5', lang)}</li>
          </ul>
        </div>
        <button 
          class="btn-auto-run" 
          onClick={startAutoRun}
          disabled={isAutoRunning}
        >
          <span>{isAutoRunning ? '⏳ Running...' : getPPTText('ppt_btn_auto', lang)}</span>
        </button>
      </div>

      <div class="ppt-content-area">
        {PPT_STEPS.map((step) => {
          const isActive = step.id === stepIndex;
          const isCompleted = step.id < stepIndex || (step.id === stepIndex && state === 'done');
          
          return (
            <div 
              key={step.id}
              class={`ppt-step ${isActive ? 'active' : ''}`}
            >
              <div class="ppt-icon">{step.icon}</div>
              <div class="ppt-title">{getPPTText(step.titleKey, lang)}</div>
              <div class="ppt-desc">{getPPTText(step.descKey, lang)}</div>
              {'hasScale' in step && step.hasScale && (
                <label class="ppt-scale">
                  <input 
                    type="checkbox" 
                    checked={scale} 
                    onChange={(e: Event) => setScale((e.target as HTMLInputElement).checked)}
                  />
                  <span>{getPPTText('ppt_step4_scale', lang)}</span>
                </label>
              )}
              {!('isFinal' in step) && (
                <div class={`ppt-status ${isCompleted ? 'done' : ''}`}>
                  {getStepStatus(step.id)}
                </div>
              )}
              {'isFinal' in step && step.isFinal && state === 'done' && (
                <button class="ppt-download" onClick={() => generateAssetsZip(zipInstance.current, false)}>
                  <span>{getPPTText('ppt_btn_manual', lang)}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div class="ppt-progress-track">
        <div 
          class="ppt-progress-fill" 
          style={{ width: `${((stepIndex - 1) / 5) * 100}%` }}
        />
      </div>

      <div class="ppt-footer">
        <button 
          class="ppt-reset-btn" 
          onClick={reset}
          disabled={isAutoRunning}
        >
          {getPPTText('ppt_btn_reset', lang)}
        </button>
        <button 
          class="ppt-action-btn" 
          onClick={runCurrentStep}
          disabled={isAutoRunning || (stepIndex === 6)}
        >
          {getButtonText()}
        </button>
      </div>

      {state === 'processing' && (
        <div class="ppt-loading-overlay">
          <div class="ppt-loading-content">
            <div class="ppt-loading-spinner">⏳</div>
            <div class="ppt-loading-title">{getPPTText(`ppt_step${stepIndex}_t`, lang)}...</div>
            <div class="ppt-loading-msg">{loadingMsg}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PPTPanel;
