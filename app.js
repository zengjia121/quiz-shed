/* =========================================================
   刷题小屋 — 应用主逻辑
   ========================================================= */
(function () {
  'use strict';

  const IMPORT = window.QuizImport;
  const STORAGE_KEY = 'quiz-shed:v1';
  const APP_VERSION = 1;
  const PAGE_SIZE = 20;

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));

  const ICONS = {
    home: '<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9 21v-6h6v6"/>',
    zap: '<path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z"/>',
    library: '<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',
    rotate: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    chart: '<path d="M3 3v18h18"/><path d="M7 16v-5"/><path d="M12 16V8"/><path d="M17 16v-3"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.12.37.35.7.66.94.3.24.68.37 1.07.37H21v4h-.09A1.7 1.7 0 0 0 19.4 15Z"/>',
    settings2: '<path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 12V3"/><path d="M1 14h6"/><path d="M9 8h6"/><path d="M17 16h6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    upload: '<path d="M12 16V4"/><path d="m7 9 5-5 5 5"/><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/>',
    download: '<path d="M12 4v12"/><path d="m7 11 5 5 5-5"/><path d="M4 20h16"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    play: '<path d="m7 4 13 8-13 8V4Z"/>',
    arrowRight: '<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5"/><path d="m11 18-6-6 6-6"/>',
    arrowUpRight: '<path d="M7 17 17 7"/><path d="M7 7h10v10"/>',
    chevronRight: '<path d="m9 18 6-6-6-6"/>',
    chevronLeft: '<path d="m15 18-6-6 6-6"/>',
    chevronDown: '<path d="m6 9 6 6 6-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    timer: '<path d="M10 2h4"/><path d="M12 14v-4"/><circle cx="12" cy="14" r="8"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    flame: '<path d="M12 22c4.4 0 8-3.6 8-8 0-3-1.5-5.5-3.5-7.5-.4 2-1.5 3.5-3 4.5.2-3-1-5.8-3-7.5.2 4-4.5 6.5-4.5 10.5 0 4.4 2.6 8 6 8Z"/>',
    shuffle: '<path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="m15 15 6 6"/><path d="M4 4l5 5"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>',
    starFill: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" fill="currentColor"/>',
    edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
    trash: '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="m19 6-1 14H6L5 6"/><path d="M10 11v5M14 11v5"/>',
    eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>',
    xCircle: '<circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/>',
    trophy: '<path d="M8 21h8"/><path d="M12 17v4"/><path d="M7 4h10v6a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"/>',
    book: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
    fileText: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h8"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v7c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12v7c0 1.7 4 3 9 3s9-1.3 9-3v-7"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>',
    info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>',
    folder: '<path d="M3 7a2 2 0 0 1 2-2h5l2 2h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
    sparkles: '<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z"/><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/>',
    undo: '<path d="M3 7v6h6"/><path d="M3 13a9 9 0 1 0 3-7.7L3 8"/>',
    sliders: '<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3"/><path d="M1 14h6M9 8h6M17 16h6"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    more: '<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    refresh: '<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 12a9 9 0 0 1 15.5-6.2L21 8"/><path d="M3 21v-5h5M21 3v5h-5"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>',
    keyboard: '<rect x="2" y="6" width="20" height="12" rx="2"/><path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M7 14h10"/>'
  };

  function icon(name, cls = '') {
    const path = ICONS[name] || ICONS.info;
    return `<svg class="icon${cls ? ` ${cls}` : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
  }

  function hydrateIcons(root = document) {
    $$('[data-icon]', root).forEach((el) => {
      if (el.dataset.iconReady === '1') return;
      const name = el.getAttribute('data-icon');
      el.innerHTML = icon(name);
      el.dataset.iconReady = '1';
    });
  }

  function esc(value) {
    return String(value == null ? '' : value).replace(/[&<>"']/g, (ch) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
  }

  function escapeAttr(value) { return esc(value); }

  function uid() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    return `q-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }

  function shuffle(list) {
    const arr = list.slice();
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function pct(value) { return `${Math.round((Number(value) || 0) * 100)}%`; }

  function normalizeStem(stem) {
    return String(stem || '')
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[，。！？；：、,.!?;:（）()【】\[\]“”"']/g, '');
  }

  function formatDate(ts, style = 'short') {
    if (!ts) return '—';
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return '—';
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    if (style === 'full') return `${y}年${m}月${day}日`;
    return `${m}月${day}日`;
  }

  function formatDateTime(ts) {
    if (!ts) return '—';
    const d = new Date(ts);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${formatDate(ts)} ${hh}:${mm}`;
  }

  function relativeTime(ts) {
    if (!ts) return '还没做过';
    const diff = Date.now() - ts;
    if (diff < 60 * 1000) return '刚刚';
    if (diff < 60 * 60 * 1000) return `${Math.floor(diff / 60000)} 分钟前`;
    if (diff < 24 * 60 * 60 * 1000) return `${Math.floor(diff / 3600000)} 小时前`;
    if (diff < 48 * 60 * 60 * 1000) return '昨天';
    if (diff < 7 * 24 * 60 * 60 * 1000) return `${Math.floor(diff / 86400000)} 天前`;
    return formatDate(ts);
  }

  function dateKey(ts = Date.now()) {
    const d = new Date(ts);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  function formatDuration(ms) {
    const total = Math.max(0, Math.round(ms / 1000));
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function formatClock(seconds) {
    const total = Math.max(0, seconds);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (h) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function formatBytes(bytes) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }

  function fileSafeName(value) {
    return String(value || '题库').replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, ' ').trim().slice(0, 50) || '题库';
  }

  /* ---------------- 数据结构 ---------------- */

  const TYPE_META = {
    single: { label: '单选', cls: '' },
    multiple: { label: '多选', cls: 'multi' },
    judge: { label: '判断', cls: 'judge' },
    fill: { label: '填空', cls: 'fill' }
  };

  const DIFFICULTY_LABEL = { 1: '简单', 2: '中等', 3: '困难' };

  function blankState() {
    return {
      version: APP_VERSION,
      banks: [],
      questions: [],
      history: [],
      activeBankId: 'all',
      settings: {
        theme: 'auto',
        perSession: 20,
        dailyGoal: 20,
        examCount: 20,
        examMinutes: 20
      },
      createdAt: Date.now()
    };
  }

  function sanitizeQuestion(q) {
    if (!q || typeof q !== 'object') return null;
    const stem = String(q.stem || '').trim();
    if (!stem) return null;
    const type = TYPE_META[q.type] ? q.type : '';
    if (!type) return null;
    const options = Array.isArray(q.options)
      ? q.options.filter((o) => o && o.text).map((o) => ({ key: String(o.key || '').toUpperCase(), text: String(o.text) })).filter((o) => o.key)
      : [];
    let answer = Array.isArray(q.answer) ? q.answer.map(String).filter(Boolean) : [String(q.answer || '')].filter(Boolean);
    if (!answer.length) return null;
    if (type === 'single' || type === 'multiple' || type === 'judge') {
      answer = answer.map((a) => a.toUpperCase());
    }
    const stats = q.stats && typeof q.stats === 'object' ? q.stats : {};
    return {
      id: q.id || uid(),
      bankId: q.bankId || '',
      type,
      stem,
      options: type === 'judge' && !options.length ? [{ key: 'T', text: '正确' }, { key: 'F', text: '错误' }] : options,
      answer,
      explanation: String(q.explanation || ''),
      tags: Array.isArray(q.tags) ? q.tags.map(String).filter(Boolean).slice(0, 8) : [],
      difficulty: clamp(Number(q.difficulty) || 2, 1, 3),
      favorite: !!q.favorite,
      createdAt: Number(q.createdAt) || Date.now(),
      stats: {
        seen: Number(stats.seen) || 0,
        correct: Number(stats.correct) || 0,
        wrong: Number(stats.wrong) || 0,
        lastCorrect: typeof stats.lastCorrect === 'boolean' ? stats.lastCorrect : null,
        lastAt: Number(stats.lastAt) || null
      }
    };
  }

  function loadState() {
    const base = blankState();
    let raw = null;
    try { raw = localStorage.getItem(STORAGE_KEY); } catch (err) { raw = null; }
    if (!raw) return base;
    try {
      const data = JSON.parse(raw);
      if (!data || typeof data !== 'object') return base;
      const s = { ...base, ...data };
      s.settings = { ...base.settings, ...(data.settings && typeof data.settings === 'object' ? data.settings : {}) };
      s.settings.theme = ['auto', 'light', 'dark'].includes(s.settings.theme) ? s.settings.theme : 'auto';
      s.settings.perSession = [10, 20, 30, 50, 0].includes(Number(s.settings.perSession)) ? Number(s.settings.perSession) : 20;
      s.settings.dailyGoal = clamp(Number(s.settings.dailyGoal) || 20, 1, 500);
      s.settings.examCount = clamp(Number(s.settings.examCount) || 20, 1, 500);
      s.settings.examMinutes = clamp(Number(s.settings.examMinutes) || 20, 1, 300);
      s.banks = Array.isArray(data.banks)
        ? data.banks.filter((b) => b && b.id && b.name).map((b) => ({ id: String(b.id), name: String(b.name), createdAt: Number(b.createdAt) || Date.now() }))
        : [];
      s.questions = Array.isArray(data.questions) ? data.questions.map(sanitizeQuestion).filter(Boolean) : [];
      s.history = Array.isArray(data.history)
        ? data.history.filter((h) => h && h.qid).slice(0, 3000).map((h) => ({
          id: h.id || uid(),
          qid: String(h.qid),
          ts: Number(h.ts) || Date.now(),
          date: h.date || dateKey(Number(h.ts) || Date.now()),
          correct: !!h.correct,
          mode: String(h.mode || 'practice')
        }))
        : [];

      if (s.questions.length && !s.banks.length) {
        s.banks.push({ id: uid(), name: '未分类题库', createdAt: Date.now() });
      }
      const bankIds = new Set(s.banks.map((b) => b.id));
      const missing = new Set();
      s.questions.forEach((q) => { if (!q.bankId || !bankIds.has(q.bankId)) missing.add(q.bankId || 'missing'); });
      if (missing.size) {
        const fallback = s.banks[0] || { id: uid(), name: '未分类题库', createdAt: Date.now() };
        if (!s.banks.length) s.banks.push(fallback);
        s.questions.forEach((q) => { if (!q.bankId || !bankIds.has(q.bankId)) q.bankId = fallback.id; });
      }
      if (s.activeBankId !== 'all' && !s.banks.some((b) => b.id === s.activeBankId)) s.activeBankId = 'all';
      s.version = APP_VERSION;
      return s;
    } catch (err) {
      console.warn('题库数据读取失败', err);
      return base;
    }
  }

  let state = loadState();
  let route = 'home';
  let storageBroken = false;
  let activeModalOnClose = null;
  let confirmResolver = null;
  let promptResolver = null;

  const ui = {
    bankQuery: '',
    bankType: 'all',
    bankPage: 1
  };

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      if (!storageBroken) {
        storageBroken = true;
        toast('浏览器本地存储不可用，当前修改可能在关闭页面后丢失', 'error', { duration: 6500 });
      }
      console.warn('保存失败', err);
    }
  }

  function getBank(id) { return state.banks.find((b) => b.id === id) || null; }

  function bankName(id) {
    if (id === 'all') return '全部题库';
    const bank = getBank(id);
    return bank ? bank.name : '未分类';
  }

  function activeQuestions() {
    if (state.activeBankId === 'all') return state.questions.slice();
    return state.questions.filter((q) => q.bankId === state.activeBankId);
  }

  function getQuestion(id) { return state.questions.find((q) => q.id === id) || null; }

  function isWrong(q) { return q.stats.lastCorrect === false; }

  function isMastered(q) { return q.stats.lastCorrect === true && q.stats.correct >= 2; }

  function typeBadge(q) {
    const meta = TYPE_META[q.type] || TYPE_META.single;
    return `<span class="q-type ${meta.cls}">${meta.label}</span>`;
  }

  function optionText(q, key) {
    const opt = (q.options || []).find((o) => o.key === key);
    return opt ? opt.text : key;
  }

  function answerText(q) {
    if (q.type === 'fill') return (q.answer || []).join(' / ');
    if (q.type === 'judge') return (q.answer || []).map((key) => (key === 'T' ? '正确' : '错误')).join('；');
    return (q.answer || []).map((key) => `${key}. ${optionText(q, key)}`).join('；');
  }

  function answerShort(q) {
    if (q.type === 'fill') return (q.answer || []).join(' / ');
    if (q.type === 'judge') return (q.answer || []).map((key) => (key === 'T' ? '正确' : '错误')).join('；');
    return (q.answer || []).join('、');
  }

  function makeQuestion(raw, bankId, offset = 0) {
    let clean = raw;
    try {
      clean = IMPORT.normalizeRaw(raw, 0);
    } catch (err) {
      console.warn('题目规范化失败，按原样保存', err);
    }
    return {
      id: uid(),
      bankId,
      type: clean.type,
      stem: clean.stem,
      options: clean.options || [],
      answer: clean.answer || [],
      explanation: clean.explanation || '',
      tags: clean.tags || [],
      difficulty: clean.difficulty || 2,
      favorite: false,
      createdAt: Date.now() + offset,
      stats: { seen: 0, correct: 0, wrong: 0, lastCorrect: null, lastAt: null }
    };
  }

  function createBank(name) {
    const clean = String(name || '').trim().slice(0, 40) || '未命名题库';
    const bank = { id: uid(), name: clean, createdAt: Date.now() };
    state.banks.push(bank);
    return bank;
  }

  /* ---------------- 统计 ---------------- */

  function computeStats(list = state.questions) {
    let seen = 0;
    let correct = 0;
    let mastered = 0;
    let wrong = 0;
    let favorite = 0;
    list.forEach((q) => {
      seen += q.stats.seen;
      correct += q.stats.correct;
      if (isMastered(q)) mastered += 1;
      if (isWrong(q)) wrong += 1;
      if (q.favorite) favorite += 1;
    });
    return {
      total: list.length,
      seen,
      correct,
      wrong,
      favorite,
      mastered,
      accuracy: seen ? correct / seen : 0
    };
  }

  function todayAttempts(list = state.questions) {
    const ids = new Set(list.map((q) => q.id));
    const key = dateKey();
    return state.history.filter((h) => h.date === key && ids.has(h.qid)).length;
  }

  function studyStreak() {
    const days = new Set(state.history.map((h) => h.date || dateKey(h.ts)));
    if (!days.size) return 0;
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    if (!days.has(dateKey(d))) d.setDate(d.getDate() - 1);
    let count = 0;
    while (days.has(dateKey(d))) {
      count += 1;
      d.setDate(d.getDate() - 1);
    }
    return count;
  }

  function daySeries(days, list = state.questions) {
    const ids = new Set(list.map((q) => q.id));
    const byDate = new Map();
    state.history.forEach((h) => {
      if (!ids.has(h.qid)) return;
      byDate.set(h.date, (byDate.get(h.date) || 0) + 1);
    });
    const result = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = days - 1; i >= 0; i -= 1) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = dateKey(d);
      result.push({
        key,
        label: days <= 7 ? `周${'日一二三四五六'[d.getDay()]}` : `${d.getMonth() + 1}/${d.getDate()}`,
        count: byDate.get(key) || 0,
        isToday: i === 0
      });
    }
    return result;
  }

  function typeStats(list = state.questions) {
    return Object.keys(TYPE_META).map((type) => {
      const qs = list.filter((q) => q.type === type);
      let seen = 0;
      let correct = 0;
      qs.forEach((q) => { seen += q.stats.seen; correct += q.stats.correct; });
      return { type, label: TYPE_META[type].label, total: qs.length, seen, correct, accuracy: seen ? correct / seen : 0 };
    });
  }

  function bankStatsFor(bank) {
    const qs = state.questions.filter((q) => q.bankId === bank.id);
    return { ...computeStats(qs), bank };
  }

  function recordAttempt(q, correct, mode) {
    const now = Date.now();
    q.stats.seen += 1;
    q.stats.correct += correct ? 1 : 0;
    q.stats.wrong += correct ? 0 : 1;
    q.stats.lastCorrect = correct;
    q.stats.lastAt = now;
    state.history.unshift({
      id: uid(),
      qid: q.id,
      ts: now,
      date: dateKey(now),
      correct,
      mode: mode || 'practice'
    });
    if (state.history.length > 3000) state.history.length = 3000;
    save();
  }

  /* ---------------- 主题 ---------------- */

  function applyTheme() {
    const theme = state.settings.theme || 'auto';
    document.documentElement.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      const dark = theme === 'dark' || (theme === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
      meta.setAttribute('content', dark ? '#141916' : '#f6f2e9');
    }
  }

  function themeIcon() {
    const theme = state.settings.theme;
    return theme === 'dark' ? 'moon' : theme === 'light' ? 'sun' : 'monitor';
  }

  function themeLabel() {
    const theme = state.settings.theme;
    return theme === 'dark' ? '深色' : theme === 'light' ? '浅色' : '跟随系统';
  }

  function cycleTheme() {
    const order = ['auto', 'light', 'dark'];
    const next = order[(order.indexOf(state.settings.theme) + 1) % order.length];
    state.settings.theme = next;
    applyTheme();
    save();
    render();
    if (next !== 'auto') toast(`外观：${themeLabel()}`, 'success', { duration: 1600 });
  }

  /* ---------------- Toast ---------------- */

  function toast(message, type = '', options = {}) {
    const root = $('#toastRoot');
    if (!root) return;
    const el = document.createElement('div');
    el.className = `toast ${type || ''}`.trim();
    const iconName = type === 'error' ? 'xCircle' : type === 'warn' ? 'alert' : 'checkCircle';
    el.innerHTML = `${icon(iconName)}<span>${esc(message)}</span>`;
    if (options.action && typeof options.onAction === 'function') {
      const btn = document.createElement('button');
      btn.className = 'toast-action';
      btn.textContent = options.action;
      btn.addEventListener('click', () => {
        options.onAction();
        el.remove();
      });
      el.appendChild(btn);
    }
    root.appendChild(el);
    while (root.children.length > 3) root.firstChild.remove();
    const timer = setTimeout(() => el.remove(), options.duration || 3200);
    el.addEventListener('mouseenter', () => clearTimeout(timer), { once: true });
  }

  /* ---------------- 弹窗基础 ---------------- */

  function openModal(options = {}) {
    const {
      title = '',
      subtitle = '',
      body = '',
      footer = '',
      size = '',
      onMount = null,
      onClose = null,
      showClose = true
    } = options;

    closeModal(true);
    const root = $('#modalRoot');
    root.innerHTML = `
      <div class="modal-backdrop" id="modalBackdrop">
        <div class="modal ${size ? `modal-${size}` : ''}" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
          <div class="modal-head">
            <div>
              <h2 id="modalTitle">${esc(title)}</h2>
              ${subtitle ? `<p>${subtitle}</p>` : ''}
            </div>
            ${showClose ? `<button class="modal-close" data-action="close-modal" aria-label="关闭">${icon('x')}</button>` : ''}
          </div>
          <div class="modal-body">${body}</div>
          ${footer ? `<div class="modal-foot">${footer}</div>` : ''}
        </div>
      </div>`;
    document.body.classList.add('modal-open');
    activeModalOnClose = onClose;
    hydrateIcons(root);

    const backdrop = $('#modalBackdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeModal();
      });
    }

    requestAnimationFrame(() => {
      const target = root.querySelector('[autofocus]') ||
        root.querySelector('.modal-body input:not([type="hidden"]), .modal-body textarea, .modal-body select, .modal-foot .btn-primary, .modal-close');
      if (target) target.focus({ preventScroll: true });
    });

    if (typeof onMount === 'function') onMount(root);
  }

  function closeModal(force = false) {
    const root = $('#modalRoot');
    if (!root || !root.firstChild) {
      activeModalOnClose = null;
      return;
    }
    const callback = activeModalOnClose;
    activeModalOnClose = null;
    root.innerHTML = '';
    document.body.classList.remove('modal-open');
    if (!force && typeof callback === 'function') callback();
  }

  function confirmDialog(options = {}) {
    const {
      title = '确认操作',
      message = '',
      confirmText = '确定',
      cancelText = '取消',
      danger = false
    } = options;
    return new Promise((resolve) => {
      let settled = false;
      const done = (value) => {
        if (settled) return;
        settled = true;
        confirmResolver = null;
        resolve(value);
      };
      confirmResolver = done;
      openModal({
        title,
        size: 'sm',
        body: `<p class="confirm-copy">${message}</p>`,
        footer: `
          <button class="btn" data-action="confirm-no">${esc(cancelText)}</button>
          <button class="btn ${danger ? 'btn-danger' : 'btn-primary'}" data-action="confirm-yes">${esc(confirmText)}</button>`,
        onClose: () => done(false)
      });
    });
  }

  function resolveConfirm(value) {
    const fn = confirmResolver;
    confirmResolver = null;
    if (fn) fn(value);
    closeModal(true);
  }

  function promptDialog(options = {}) {
    const {
      title = '输入名称',
      label = '名称',
      value = '',
      placeholder = '',
      confirmText = '确定'
    } = options;
    return new Promise((resolve) => {
      let settled = false;
      const done = (val) => {
        if (settled) return;
        settled = true;
        promptResolver = null;
        resolve(val);
      };
      promptResolver = done;
      openModal({
        title,
        size: 'sm',
        body: `
          <form id="promptForm">
            <div class="field">
              <label for="promptInput">${esc(label)}</label>
              <input class="input" id="promptInput" maxlength="40" value="${escapeAttr(value)}" placeholder="${escapeAttr(placeholder)}" autofocus>
            </div>
          </form>`,
        footer: `
          <button class="btn" data-action="confirm-no">取消</button>
          <button class="btn btn-primary" data-action="prompt-submit">${esc(confirmText)}</button>`,
        onMount: (root) => {
          const form = $('#promptForm', root);
          form.addEventListener('submit', (e) => {
            e.preventDefault();
            const val = $('#promptInput', root).value.trim();
            if (!val) { toast('名称不能为空', 'warn'); return; }
            const fn = promptResolver;
            promptResolver = null;
            if (fn) fn(val);
            closeModal(true);
          });
        },
        onClose: () => done(null)
      });
    });
  }

  /* ---------------- 渲染：侧栏与图表 ---------------- */

  function chartHTML(series, big = false) {
    const max = Math.max(1, ...series.map((item) => item.count));
    return `<div class="${big ? 'big-chart' : 'chart'}">
      ${series.map((item) => `
        <div class="chart-col ${item.isToday ? 'today' : ''} ${item.count ? 'has-data' : ''}" title="${esc(item.key)}：${item.count} 题">
          <div class="chart-track"><div class="chart-bar" style="height:${item.count ? Math.max(4, Math.round((item.count / max) * 100)) : 0}%"></div></div>
          <span class="chart-label">${esc(item.label)}</span>
        </div>`).join('')}
    </div>`;
  }

  function ringSVG(percent, size = 148, cls = '') {
    const stroke = 10;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const offset = c * (1 - clamp(percent, 0, 100) / 100);
    return `<svg viewBox="0 0 ${size} ${size}" class="${cls}" aria-hidden="true">
      <circle class="ring-bg" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="0"></circle>
      <circle class="ring-fg" cx="${size / 2}" cy="${size / 2}" r="${r}" stroke-dasharray="${c}" stroke-dashoffset="${offset}"></circle>
    </svg>`;
  }

  function renderSidebar() {
    const navMap = { home: 0, practice: 1, bank: 2, wrong: 3, stats: 4 };
    $$('.nav-item').forEach((el) => {
      el.classList.toggle('active', el.dataset.route === route);
    });
    const qCount = $('#navQuestionCount');
    const wCount = $('#navWrongCount');
    if (qCount) qCount.textContent = state.questions.length;
    if (wCount) wCount.textContent = state.questions.filter(isWrong).length;

    const bankList = $('#bankList');
    if (!bankList) return;
    const allActive = state.activeBankId === 'all';
    const items = [];
    items.push(`<button class="bank-item bank-all ${allActive ? 'active' : ''}" data-action="select-bank" data-bank="all">
      <span class="bank-dot"></span><span class="bank-item-name">全部题库</span><span class="bank-item-count">${state.questions.length}</span>
    </button>`);
    if (!state.banks.length) {
      items.push('<div class="bank-empty-note">还没有题库。导入一份自己的题目，或先载入示例试试。</div>');
    } else {
      state.banks.slice().sort((a, b) => a.createdAt - b.createdAt).forEach((bank) => {
        const count = state.questions.filter((q) => q.bankId === bank.id).length;
        items.push(`<button class="bank-item ${state.activeBankId === bank.id ? 'active' : ''}" data-action="select-bank" data-bank="${escapeAttr(bank.id)}" title="${escapeAttr(bank.name)}">
          <span class="bank-dot"></span><span class="bank-item-name">${esc(bank.name)}</span><span class="bank-item-count">${count}</span>
        </button>`);
      });
    }
    bankList.innerHTML = items.join('');

    const themeBtn = $('#themeBtn');
    if (themeBtn) {
      themeBtn.innerHTML = `<span data-icon="${themeIcon()}"></span> ${themeLabel()}`;
      themeBtn.setAttribute('title', `当前：${themeLabel()}，点击切换`);
      hydrateIcons(themeBtn);
    }
  }

  function pageTitle() {
    const map = { home: '概览', practice: '开始练习', bank: '题库', wrong: '错题本', stats: '学习统计' };
    return map[route] || '概览';
  }

  function setPageTitle() {
    const title = $('#pageTitle');
    if (title) title.textContent = pageTitle();
    document.title = `${pageTitle()} · 刷题小屋`;
  }

  /* ---------------- 渲染：首页 ---------------- */

  function renderWelcome() {
    return `
      <section class="hero">
        <div class="hero-copy">
          <div class="hero-date">YOUR OWN QUESTION BANK</div>
          <h1>把题库搬进来，<br><em>开始刷题。</em></h1>
          <p class="hero-sub">粘贴 Excel 内容、上传 CSV / JSON，或直接写几段题目。导入之后，按顺序刷、随机刷、只刷错题，数据都留在本机。</p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" data-action="open-import">${icon('upload')} 导入我的题库</button>
            <button class="btn btn-lg" data-action="load-sample">${icon('sparkles')} 先看看示例</button>
          </div>
          <div class="hero-note">支持 JSON · CSV · TSV · 结构化纯文本，导入前会先预览。</div>
        </div>
        <div class="hero-ring-wrap">
          <div class="hero-ring" style="--p: 0%">
            <div class="hero-ring-inner">
              <strong>0</strong>
              <span>今日已练 / 题</span>
            </div>
          </div>
        </div>
      </section>
      <div class="section-head">
        <div><h2>三种方式，够用就好</h2><p>不用注册，不用联网，不上传你的题目。</p></div>
      </div>
      <div class="bank-cards">
        <div class="bank-card">
          <div class="bank-card-top"><span class="bank-card-name">从 Excel 直接粘贴</span><span class="tag tag-green">最常用</span></div>
          <p style="color:var(--muted);font-size:11px;line-height:1.75;margin:0">表头写「题目、选项A、选项B、答案、解析」，复制整块粘贴即可。也支持 CSV 和 TSV 文件。</p>
        </div>
        <div class="bank-card">
          <div class="bank-card-top"><span class="bank-card-name">导入 JSON</span><span class="tag tag-blue">最灵活</span></div>
          <p style="color:var(--muted);font-size:11px;line-height:1.75;margin:0">适合从其他刷题软件迁移，或让 AI 按固定字段生成整份题库。</p>
        </div>
        <div class="bank-card">
          <div class="bank-card-top"><span class="bank-card-name">写纯文本</span><span class="tag tag-gold">最轻量</span></div>
          <p style="color:var(--muted);font-size:11px;line-height:1.75;margin:0">一行题干、几行选项、一行「答案：A」，没有格式负担，导入时自动识别。</p>
        </div>
      </div>
      <div class="section-head">
        <div><h2>导入之后</h2><p>练习、错题、统计会自动连起来。</p></div>
      </div>
      <div class="bank-cards">
        <div class="bank-card"><div class="bank-card-top"><span class="bank-card-name">练习模式</span><span class="tag">顺序 / 随机 / 模拟考</span></div><p style="color:var(--muted);font-size:11px;line-height:1.75;margin:0">单选点击即判，多选和填空提交后判分，答完立刻看解析。</p></div>
        <div class="bank-card"><div class="bank-card-top"><span class="bank-card-name">错题本</span><span class="tag tag-coral">自动收集</span></div><p style="color:var(--muted);font-size:11px;line-height:1.75;margin:0">答错自动进入错题本，重做正确后自动移出，也可以手动标记掌握。</p></div>
        <div class="bank-card"><div class="bank-card-top"><span class="bank-card-name">学习统计</span><span class="tag tag-blue">看得见</span></div><p style="color:var(--muted);font-size:11px;line-height:1.75;margin:0">每日练习量、正确率、题型分布和题库进度，帮你知道下一步刷哪里。</p></div>
      </div>`;
  }

  function renderHome() {
    if (!state.questions.length) return renderWelcome();

    const scope = activeQuestions();
    const stats = computeStats(scope);
    const today = todayAttempts(scope);
    const goal = state.settings.dailyGoal;
    const goalPct = clamp(Math.round((today / goal) * 100), 0, 100);
    const streak = studyStreak();
    const wrong = scope.filter(isWrong);
    const series = daySeries(7, scope);
    const banks = state.banks.slice().sort((a, b) => a.createdAt - b.createdAt);
    const hour = new Date().getHours();
    const greet = hour < 6 ? '夜深了' : hour < 11 ? '早上好' : hour < 14 ? '中午好' : hour < 18 ? '下午好' : '晚上好';
    const scopeText = state.activeBankId === 'all' ? '全部题库' : bankName(state.activeBankId);

    if (!scope.length) {
      return `
        <div class="page-head"><div><h1>${esc(bankName(state.activeBankId))}</h1><p>这个题库还是空的。</p></div></div>
        <div class="empty">
          <div class="empty-art">${icon('folder')}</div>
          <h3>这里还没有题目</h3>
          <p>可以往这个题库导入题目，或切换到「全部题库」看看其他内容。</p>
          <div class="empty-actions">
            <button class="btn btn-primary" data-action="open-import">${icon('upload')} 导入题目</button>
            <button class="btn" data-action="select-bank" data-bank="all">查看全部题库</button>
          </div>
        </div>`;
    }

    const modeRows = [
      { mode: 'sequence', tone: 'green', icon: 'list', title: '顺序练习', desc: '按导入顺序，一轮一轮过', count: scope.length },
      { mode: 'random', tone: 'blue', icon: 'shuffle', title: '随机练习', desc: '打乱顺序，检验真实掌握度', count: scope.length },
      { mode: 'wrong', tone: 'coral', icon: 'rotate', title: '错题重练', desc: '只刷最近答错的题', count: wrong.length },
      { mode: 'favorite', tone: 'gold', icon: 'star', title: '收藏练习', desc: '复习你标记过的重点题', count: stats.favorite }
    ];

    const bankCards = banks.slice(0, 3).map((bank) => {
      const bs = bankStatsFor(bank);
      const p = bs.total ? Math.round((bs.mastered / bs.total) * 100) : 0;
      return `<button class="bank-card" data-action="open-bank-practice" data-bank="${escapeAttr(bank.id)}">
        <div class="bank-card-top"><span class="bank-card-name">${esc(bank.name)}</span><span class="bank-card-count">${bs.total} 题</span></div>
        <div class="bank-card-meta"><span>已掌握</span><strong>${p}%</strong></div>
        <div class="progress"><span style="width:${p}%"></span></div>
        <div class="bank-card-foot"><span>正确率 ${pct(bs.accuracy)} · 练习 ${bs.seen} 次</span><span class="arrow">${icon('arrowUpRight')}</span></div>
      </button>`;
    }).join('');

    const wrongPreview = wrong.slice(0, 3).map((q) => `
      <button class="wrong-preview-item" data-action="preview-question" data-id="${escapeAttr(q.id)}">
        <span class="wrong-bullet">${q.stats.wrong}</span>
        <span class="wrong-preview-stem">${esc(q.stem)}</span>
      </button>`).join('');

    return `
      <section class="hero">
        <div class="hero-copy">
          <div class="hero-date">${greet} · ${formatDate(Date.now(), 'full')} · ${esc(scopeText)}</div>
          <h1>今天，<em>刷几道？</em></h1>
          <p class="hero-sub">题库里已有 ${stats.total} 道题，错题本里还有 ${wrong.length} 道等你回头。一次不用太久，先把眼前这一道做对。</p>
          <div class="hero-actions">
            <button class="btn btn-primary btn-lg" data-action="start-mode" data-mode="sequence">${icon('play')} 开始刷题</button>
            <button class="btn btn-lg" data-action="open-import">${icon('upload')} 继续导入</button>
          </div>
          <div class="hero-note">按 1–8 快速作答 · 练习记录自动保存在本机</div>
        </div>
        <div class="hero-ring-wrap">
          <div class="hero-ring" style="--p:${goalPct}%">
            <div class="hero-ring-inner">
              <strong>${today}</strong>
              <span>今日已练 / 目标 ${goal}</span>
            </div>
            ${streak ? `<span class="hero-ring-badge">${icon('flame')} 连续 ${streak} 天</span>` : ''}
          </div>
        </div>
      </section>

      <div class="stat-grid">
        <div class="stat-card">
          <span class="stat-icon green">${icon('library')}</span>
          <div class="stat-body"><div class="stat-value">${stats.total}<small>道</small></div><div class="stat-label">${esc(scopeText)}</div></div>
        </div>
        <div class="stat-card">
          <span class="stat-icon coral">${icon('flame')}</span>
          <div class="stat-body"><div class="stat-value">${today}<small>道</small></div><div class="stat-label">今日已练习</div></div>
        </div>
        <div class="stat-card">
          <span class="stat-icon gold">${icon('target')}</span>
          <div class="stat-body"><div class="stat-value">${pct(stats.accuracy)}</div><div class="stat-label">累计正确率 · ${stats.seen} 次作答</div></div>
        </div>
        <div class="stat-card">
          <span class="stat-icon blue">${icon('calendar')}</span>
          <div class="stat-body"><div class="stat-value">${streak}<small>天</small></div><div class="stat-label">连续学习</div></div>
        </div>
      </div>

      <div class="dashboard-grid">
        <section class="card panel">
          <div class="panel-head"><div><h2>练习方式</h2><p>选一个舒服的节奏开始</p></div><button class="text-btn" data-action="nav" data-route="practice">全部模式 ${icon('arrowRight')}</button></div>
          <div class="mode-list">
            ${modeRows.map((row) => `<button class="mode-row" data-tone="${row.tone}" data-action="start-mode" data-mode="${row.mode}">
              <span class="mode-icon">${icon(row.icon)}</span>
              <span class="mode-info"><strong>${row.title}</strong><span>${row.desc}</span></span>
              <span class="mode-meta">${row.count} 题 ${icon('chevronRight')}</span>
            </button>`).join('')}
          </div>
        </section>
        <div class="side-stack">
          <section class="card panel">
            <div class="panel-head"><div><h2>最近 7 天</h2><p>每天做一点，比一次做很多更稳</p></div><span class="pill">${series.reduce((n, x) => n + x.count, 0)} 题</span></div>
            ${chartHTML(series)}
            <div class="chart-total"><strong>${series.reduce((n, x) => n + x.count, 0)}</strong> 道题 · 本周练习量</div>
          </section>
          <section class="card panel">
            <div class="panel-head"><div><h2>错题提醒</h2><p>还有 ${wrong.length} 道没弄懂</p></div><button class="text-btn" data-action="nav" data-route="wrong">错题本</button></div>
            <div class="wrong-preview">
              ${wrongPreview || `<div class="wrong-empty">目前没有错题，保持住。</div>`}
            </div>
          </section>
        </div>
      </div>

      <div class="section-head">
        <div><h2>题库</h2><p>${banks.length} 个题库 · ${state.questions.length} 道题</p></div>
        <div class="head-actions">
          <button class="btn btn-sm" data-action="open-bank-manager">${icon('sliders')} 管理</button>
          <button class="btn btn-sm btn-primary" data-action="open-import">${icon('plus')} 导入</button>
        </div>
      </div>
      <div class="bank-cards">
        ${bankCards || `<div class="empty" style="grid-column:1/-1;padding:36px"><h3>还没有题库</h3><p>导入一份题目，开始你的第一轮练习。</p><div class="empty-actions"><button class="btn btn-primary" data-action="open-import">导入题目</button></div></div>`}
        ${banks.length > 3 ? `<button class="bank-card" data-action="nav" data-route="bank" style="align-items:center;justify-content:center;color:var(--muted)"><span>查看全部 ${banks.length} 个题库</span><span class="arrow">${icon('arrowRight')}</span></button>` : ''}
      </div>`;
  }

  /* ---------------- 渲染：练习页 ---------------- */

  function bankSelectOptions(selected, includeAll = true) {
    const opts = [];
    if (includeAll) opts.push(`<option value="all" ${selected === 'all' ? 'selected' : ''}>全部题库</option>`);
    state.banks.slice().sort((a, b) => a.createdAt - b.createdAt).forEach((bank) => {
      opts.push(`<option value="${escapeAttr(bank.id)}" ${selected === bank.id ? 'selected' : ''}>${esc(bank.name)}</option>`);
    });
    return opts.join('');
  }

  function renderPractice() {
    const scope = activeQuestions();
    const stats = computeStats(scope);
    const wrong = scope.filter(isWrong).length;
    const scopeText = state.activeBankId === 'all' ? '全部题库' : bankName(state.activeBankId);
    const cards = [
      { mode: 'sequence', tone: 'green', icon: 'list', title: '顺序练习', desc: '按导入顺序从头过一遍，适合第一次系统学习。', count: scope.length, meta: '一轮全覆盖' },
      { mode: 'random', tone: 'blue', icon: 'shuffle', title: '随机练习', desc: '打乱题目顺序，减少位置记忆，检验真实掌握度。', count: scope.length, meta: '乱序抽题' },
      { mode: 'wrong', tone: 'coral', icon: 'rotate', title: '错题重练', desc: '只练最近一次答错的题，做对后自动移出错题本。', count: wrong, meta: '针对薄弱点' },
      { mode: 'favorite', tone: 'gold', icon: 'star', title: '收藏练习', desc: '把标星的题目集中复习，适合考前快速回顾。', count: stats.favorite, meta: '只看收藏' }
    ];

    return `
      <div class="page-head">
        <div><h1>开始练习</h1><p>当前题库：${esc(scopeText)} · ${scope.length} 道题 · 累计正确率 ${pct(stats.accuracy)}</p></div>
        <div class="page-head-actions">
          <button class="btn" data-action="open-import">${icon('upload')} 导入题目</button>
        </div>
      </div>
      <div class="practice-toolbar">
        <div class="practice-toolbar-left">
          <span class="field-label">题库</span>
          <select class="select-inline" id="practiceBankSelect" data-bank-select aria-label="选择题库">${bankSelectOptions(state.activeBankId)}</select>
        </div>
        <div class="practice-toolbar-right">
          <label for="perSessionSelect">每次题量</label>
          <select id="perSessionSelect" data-setting="perSession" aria-label="每次题量">
            ${[10, 20, 30, 50, 0].map((n) => `<option value="${n}" ${Number(state.settings.perSession) === n ? 'selected' : ''}>${n === 0 ? '全部' : `${n} 题`}</option>`).join('')}
          </select>
        </div>
      </div>
      ${scope.length ? `
      <div class="practice-grid">
        ${cards.map((card) => `
          <button class="practice-card" data-tone="${card.tone}" data-action="start-mode" data-mode="${card.mode}" ${card.count ? '' : 'data-empty="1"'}>
            <div class="practice-card-top">
              <span class="practice-badge">${icon(card.icon)}</span>
              <span class="practice-count">${card.count} 题 · ${card.meta}</span>
            </div>
            <h3>${card.title}</h3>
            <p>${card.desc}</p>
            <span class="start-line">${card.count ? '开始练习' : '暂无题目'} ${icon('arrowRight')}</span>
          </button>`).join('')}
      </div>
      <div class="exam-banner">
        <span class="exam-banner-icon">${icon('timer')}</span>
        <div class="exam-banner-body">
          <h3>模拟考试</h3>
          <p>限时、随机抽题、交卷后统一看答案，适合考前自测。当前题库可抽 ${scope.length} 题。</p>
        </div>
        <button class="btn" data-action="open-exam">${icon('play')} 配置考试</button>
      </div>
      ` : `
      <div class="empty">
        <div class="empty-art">${icon('folder')}</div>
        <h3>当前题库还没有题目</h3>
        <p>先导入题目，或者切换到其他题库。导入后这里会显示可用的练习模式。</p>
        <div class="empty-actions">
          <button class="btn btn-primary" data-action="open-import">${icon('upload')} 导入题目</button>
          <button class="btn" data-action="select-bank" data-bank="all">切换到全部题库</button>
        </div>
      </div>`}
    `;
  }

  /* ---------------- 渲染：题库列表 ---------------- */

  function questionRowHTML(q, options = {}) {
    const index = options.index != null ? String(options.index).padStart(2, '0') : '';
    const reveal = options.reveal;
    const wrong = options.wrong;
    const diff = DIFFICULTY_LABEL[q.difficulty] || '中等';
    const tagHtml = (q.tags || []).slice(0, 2).map((t) => `<span class="tag">${esc(t)}</span>`).join('');
    const bankTag = state.activeBankId === 'all' ? `<span class="q-bank">${esc(bankName(q.bankId))}</span>` : '';
    const last = q.stats.lastCorrect === true
      ? '<span class="ok">上次答对</span>'
      : q.stats.lastCorrect === false
        ? '<span class="bad">上次答错</span>'
        : '<span>还没做过</span>';
    return `
      <div class="q-row ${wrong ? 'wrong-item' : ''}" data-id="${escapeAttr(q.id)}">
        ${index ? `<div class="q-index">${index}</div>` : ''}
        <div class="q-main">
          <div class="q-meta">
            ${typeBadge(q)}
            <span class="tag">${diff}</span>
            ${bankTag}
            ${tagHtml}
          </div>
          <div class="q-stem">${esc(q.stem)}</div>
          <div class="q-sub">
            ${last}
            <span>练习 ${q.stats.seen} 次</span>
            ${reveal ? `<span class="q-answer">正确答案：<b>${esc(answerShort(q))}</b></span>` : ''}
            <span>${relativeTime(q.stats.lastAt)}</span>
          </div>
        </div>
        <div class="q-actions">
          <button class="icon-btn" data-action="preview-question" data-id="${escapeAttr(q.id)}" title="查看题目详情" aria-label="查看题目详情">${icon('eye')}</button>
          <button class="icon-btn ${q.favorite ? 'is-fav' : ''}" data-action="toggle-favorite" data-id="${escapeAttr(q.id)}" title="${q.favorite ? '取消收藏' : '收藏'}" aria-label="${q.favorite ? '取消收藏' : '收藏'}">${icon(q.favorite ? 'starFill' : 'star')}</button>
          <button class="icon-btn" data-action="edit-question" data-id="${escapeAttr(q.id)}" title="编辑" aria-label="编辑">${icon('edit')}</button>
          <button class="icon-btn" data-action="delete-question" data-id="${escapeAttr(q.id)}" title="删除" aria-label="删除">${icon('trash')}</button>
        </div>
      </div>`;
  }

  function paginationHTML(total, page, action) {
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (pages <= 1) return '';
    const cur = clamp(page, 1, pages);
    const buttons = [];
    buttons.push(`<button class="page-btn" data-action="${action}" data-page="${cur - 1}" ${cur <= 1 ? 'disabled' : ''} aria-label="上一页">${icon('chevronLeft')}</button>`);
    const start = Math.max(1, Math.min(cur - 2, pages - 4));
    const end = Math.min(pages, start + 4);
    for (let p = start; p <= end; p += 1) {
      buttons.push(`<button class="page-btn ${p === cur ? 'active' : ''}" data-action="${action}" data-page="${p}">${p}</button>`);
    }
    buttons.push(`<button class="page-btn" data-action="${action}" data-page="${cur + 1}" ${cur >= pages ? 'disabled' : ''} aria-label="下一页">${icon('chevronRight')}</button>`);
    return `<div class="pagination">${buttons.join('')}<span class="page-info">第 ${cur} / ${pages} 页</span></div>`;
  }

  function filteredBankQuestions() {
    let list = activeQuestions().slice();
    if (ui.bankType !== 'all') list = list.filter((q) => q.type === ui.bankType);
    const query = ui.bankQuery.trim().toLowerCase();
    if (query) {
      list = list.filter((q) => {
        const haystack = [
          q.stem,
          q.explanation,
          (q.tags || []).join(' '),
          (q.options || []).map((o) => `${o.key} ${o.text}`).join(' ')
        ].join(' ').toLowerCase();
        return haystack.includes(query);
      });
    }
    list.sort((a, b) => b.createdAt - a.createdAt);
    return list;
  }

  function bankResultsHTML() {
    const list = filteredBankQuestions();
    const scopeText = state.activeBankId === 'all' ? '全部题库' : bankName(state.activeBankId);
    if (!list.length) {
      const noAny = activeQuestions().length === 0;
      return `<div class="empty" style="padding:46px 20px">
        <div class="empty-art">${icon(noAny ? 'folder' : 'search')}</div>
        <h3>${noAny ? '这个题库还是空的' : '没有找到匹配的题目'}</h3>
        <p>${noAny ? '导入题目之后，可以在这里搜索、筛选和编辑。' : '换个关键词，或把题型筛选切回「全部」试试。'}</p>
        <div class="empty-actions">
          <button class="btn btn-primary" data-action="open-import">${icon('upload')} 导入题目</button>
          ${!noAny ? '<button class="btn" data-action="reset-bank-filter">清除筛选</button>' : '<button class="btn" data-action="new-question">手动新增一道</button>'}
        </div>
      </div>`;
    }
    const pages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
    const page = clamp(ui.bankPage, 1, pages);
    ui.bankPage = page;
    const start = (page - 1) * PAGE_SIZE;
    const rows = list.slice(start, start + PAGE_SIZE).map((q, i) => questionRowHTML(q, {
      index: start + i + 1,
      reveal: true
    })).join('');
    return `
      <div class="list-summary"><span>${scopeText} · ${list.length} 道题${list.length !== activeQuestions().length ? `（筛选前 ${activeQuestions().length} 道）` : ''}</span><span>第 ${start + 1}–${Math.min(start + PAGE_SIZE, list.length)} 道</span></div>
      <div class="q-list">${rows}</div>
      ${paginationHTML(list.length, page, 'bank-page')}`;
  }

  function renderBank() {
    return `
      <div class="page-head">
        <div><h1>题库</h1><p>${state.questions.length} 道题 · ${state.banks.length} 个题库 · 数据保存在这台电脑的浏览器里</p></div>
        <div class="page-head-actions">
          <button class="btn" data-action="open-bank-manager">${icon('sliders')} 管理题库</button>
          <button class="btn" data-action="new-question">${icon('edit')} 新增题目</button>
          <button class="btn btn-primary" data-action="open-import">${icon('plus')} 导入题目</button>
        </div>
      </div>
      <div class="bank-toolbar">
        <select class="select-inline" data-bank-select aria-label="选择题库">${bankSelectOptions(state.activeBankId)}</select>
        <label class="search-box">
          <span>${icon('search')}</span>
          <input id="bankSearchInput" type="search" placeholder="搜题干、选项、解析或标签…" value="${escapeAttr(ui.bankQuery)}" autocomplete="off">
        </label>
        <select class="filter-select" id="bankTypeFilter" aria-label="按题型筛选">
          <option value="all" ${ui.bankType === 'all' ? 'selected' : ''}>全部题型</option>
          <option value="single" ${ui.bankType === 'single' ? 'selected' : ''}>单选</option>
          <option value="multiple" ${ui.bankType === 'multiple' ? 'selected' : ''}>多选</option>
          <option value="judge" ${ui.bankType === 'judge' ? 'selected' : ''}>判断</option>
          <option value="fill" ${ui.bankType === 'fill' ? 'selected' : ''}>填空</option>
        </select>
        <span class="toolbar-spacer"></span>
        <button class="btn btn-sm" data-action="open-export">${icon('download')} 导出</button>
      </div>
      <div id="bankResults">${bankResultsHTML()}</div>`;
  }

  /* ---------------- 渲染：错题本 ---------------- */

  function renderWrong() {
    const scope = activeQuestions();
    const wrong = scope.filter(isWrong).sort((a, b) => (b.stats.lastAt || 0) - (a.stats.lastAt || 0));
    const scopeText = state.activeBankId === 'all' ? '全部题库' : bankName(state.activeBankId);
    if (!wrong.length) {
      return `
        <div class="page-head"><div><h1>错题本</h1><p>${esc(scopeText)} · 自动收集答错的题</p></div></div>
        <div class="empty">
          <div class="empty-art">${icon('checkCircle')}</div>
          <h3>这里现在很干净</h3>
          <p>练习中答错的题会自动出现在这里。重做正确后，它会自动移出；你也可以手动标记为已掌握。</p>
          <div class="empty-actions">
            <button class="btn btn-primary" data-action="start-mode" data-mode="sequence">${icon('play')} 去练习</button>
            <button class="btn" data-action="open-import">导入题目</button>
          </div>
        </div>`;
    }
    return `
      <div class="page-head">
        <div><h1>错题本</h1><p>${esc(scopeText)} · ${wrong.length} 道待巩固 · 答对一次后自动移出</p></div>
        <div class="page-head-actions">
          <button class="btn btn-primary" data-action="start-mode" data-mode="wrong">${icon('rotate')} 全部重练</button>
        </div>
      </div>
      <div class="wrong-hero">
        <span class="wrong-hero-icon">${icon('alert')}</span>
        <div class="wrong-hero-body"><h2>错题不是敌人，是地图</h2><p>先看一遍正确答案，再重做一遍。重做答对后，这些题会自动移出错题本。</p></div>
        <button class="btn btn-sm" data-action="open-import">换一批题</button>
      </div>
      <div class="q-list">
        ${wrong.map((q, i) => questionRowHTML(q, { index: i + 1, wrong: true, reveal: true })).join('')}
      </div>`;
  }

  /* ---------------- 渲染：统计 ---------------- */

  function metricRowHTML(label, meta, value, percent) {
    return `<div class="metric-row">
      <div class="metric-head"><span>${esc(label)} <small>${esc(meta)}</small></span><b>${esc(value)}</b></div>
      <div class="progress"><span style="width:${clamp(percent, 0, 100)}%"></span></div>
    </div>`;
  }

  function renderStats() {
    if (!state.questions.length) {
      return `
        <div class="page-head"><div><h1>学习统计</h1><p>练习数据会自动汇总到这里</p></div></div>
        <div class="empty">
          <div class="empty-art">${icon('chart')}</div>
          <h3>还没有可统计的数据</h3>
          <p>导入题目并完成一轮练习后，这里会显示正确率、题型分布和每个题库的掌握进度。</p>
          <div class="empty-actions"><button class="btn btn-primary" data-action="open-import">${icon('upload')} 导入题目</button></div>
        </div>`;
    }

    const stats = computeStats();
    const series = daySeries(14);
    const types = typeStats();
    const total14 = series.reduce((n, x) => n + x.count, 0);
    const banks = state.banks.map((bank) => bankStatsFor(bank)).sort((a, b) => b.total - a.total);
    const topWrong = state.questions.filter(isWrong).sort((a, b) => b.stats.wrong - a.stats.wrong).slice(0, 5);
    const accuracy = Math.round(stats.accuracy * 100);

    return `
      <div class="page-head">
        <div><h1>学习统计</h1><p>全部题库 · ${stats.total} 道题 · 累计作答 ${stats.seen} 次</p></div>
        <div class="page-head-actions"><button class="btn" data-action="open-export">${icon('download')} 导出数据</button></div>
      </div>
      <div class="stats-top">
        <section class="card big-chart-card">
          <div class="panel-head"><div><h2>最近 14 天</h2><p>每天完成的题目数量</p></div><span class="pill">${total14} 题</span></div>
          ${chartHTML(series, true)}
          <div class="chart-total"><strong>${total14}</strong> 道题 · 平均每天 ${(total14 / 14).toFixed(1)} 道</div>
        </section>
        <section class="card ring-card">
          <div class="score-ring">
            ${ringSVG(accuracy)}
            <div class="score-ring-text"><strong>${accuracy}%</strong><span>累计正确率</span></div>
          </div>
          <p>${stats.correct} 次答对，${stats.seen - stats.correct} 次答错</p>
          <div class="ring-mini">
            <span><b>${stats.mastered}</b> 已掌握</span>
            <span><b>${stats.wrong}</b> 待巩固</span>
            <span><b>${stats.favorite}</b> 收藏</span>
          </div>
        </section>
      </div>
      <div class="stats-grid">
        <section class="card panel">
          <div class="panel-head"><div><h2>题型正确率</h2><p>不同题型的作答表现</p></div></div>
          <div class="metric-list">
            ${types.map((t) => metricRowHTML(t.label, `${t.total} 道 · ${t.seen} 次`, t.seen ? pct(t.accuracy) : '—', t.seen ? t.accuracy * 100 : 0)).join('')}
          </div>
        </section>
        <section class="card panel">
          <div class="panel-head"><div><h2>题库进度</h2><p>已掌握题目占该题库的比例</p></div></div>
          <div class="metric-list">
            ${banks.map((bs) => {
              const p = bs.total ? (bs.mastered / bs.total) * 100 : 0;
              return `<button class="metric-row metric-button" data-action="select-bank-and-practice" data-bank="${escapeAttr(bs.bank.id)}">
                <div class="metric-head"><span>${esc(bs.bank.name)} <small>${bs.total} 道 · ${bs.seen} 次练习</small></span><b>${Math.round(p)}%</b></div>
                <div class="progress"><span style="width:${p}%"></span></div>
              </button>`;
            }).join('') || '<div class="wrong-empty">还没有题库</div>'}
          </div>
        </section>
        <section class="card panel">
          <div class="panel-head"><div><h2>最需要复习</h2><p>按累计答错次数排序</p></div><button class="text-btn" data-action="nav" data-route="wrong">错题本</button></div>
          <div class="wrong-preview">
            ${topWrong.map((q) => `<button class="wrong-preview-item" data-action="preview-question" data-id="${escapeAttr(q.id)}">
              <span class="wrong-bullet">${q.stats.wrong}</span>
              <span class="wrong-preview-stem">${esc(q.stem)}</span>
            </button>`).join('') || '<div class="wrong-empty">目前没有错题，保持住。</div>'}
          </div>
        </section>
        <section class="card panel">
          <div class="panel-head"><div><h2>学习概览</h2><p>一些小数字</p></div></div>
          <div class="overview-grid">
            <div class="overview-item"><strong>${stats.total}</strong><span>题库总题数</span></div>
            <div class="overview-item"><strong>${todayAttempts()}</strong><span>今日练习</span></div>
            <div class="overview-item"><strong>${studyStreak()}</strong><span>连续学习天数</span></div>
            <div class="overview-item"><strong>${stats.mastered}</strong><span>已掌握题目</span></div>
          </div>
        </section>
      </div>`;
  }

  /* ---------------- 路由与刷新 ---------------- */

  function render() {
    renderSidebar();
    setPageTitle();
    const view = $('#view');
    if (!view) return;
    if (route === 'home') view.innerHTML = renderHome();
    else if (route === 'practice') view.innerHTML = renderPractice();
    else if (route === 'bank') view.innerHTML = renderBank();
    else if (route === 'wrong') view.innerHTML = renderWrong();
    else if (route === 'stats') view.innerHTML = renderStats();
    else view.innerHTML = renderHome();
    hydrateIcons(view);
  }

  function navigate(next) {
    if (!['home', 'practice', 'bank', 'wrong', 'stats'].includes(next)) next = 'home';
    route = next;
    window.scrollTo({ top: 0, behavior: 'auto' });
    render();
  }

  function refreshBankResults() {
    const box = $('#bankResults');
    if (!box) return;
    const scroll = window.scrollY;
    box.innerHTML = bankResultsHTML();
    hydrateIcons(box);
    window.scrollTo({ top: scroll, behavior: 'auto' });
  }

  function selectBank(id) {
    if (id !== 'all' && !getBank(id)) id = 'all';
    state.activeBankId = id;
    ui.bankPage = 1;
    ui.bankQuery = '';
    ui.bankType = 'all';
    save();
    render();
  }

  /* ---------------- 通用操作 ---------------- */

  function loadSample() {
    let bank = state.banks.find((b) => b.name === '示例题库');
    if (!bank) {
      bank = createBank('示例题库');
    }
    const existing = new Set(state.questions.filter((q) => q.bankId === bank.id).map((q) => normalizeStem(q.stem)));
    let added = 0;
    IMPORT.sample.forEach((raw, index) => {
      if (existing.has(normalizeStem(raw.stem))) return;
      const q = makeQuestion(raw, bank.id, index);
      state.questions.push(q);
      existing.add(normalizeStem(raw.stem));
      added += 1;
    });
    if (!added) {
      toast('示例题库已经导入过了', 'warn');
      state.activeBankId = bank.id;
      save();
      navigate('practice');
      return;
    }
    state.activeBankId = bank.id;
    save();
    navigate('practice');
    toast(`已导入 ${added} 道示例题，直接开始试试`, 'success');
  }

  function toggleFavorite(id) {
    const q = getQuestion(id);
    if (!q) return;
    q.favorite = !q.favorite;
    save();
    render();
    toast(q.favorite ? '已收藏' : '已取消收藏', 'success', { duration: 1500 });
  }

  async function deleteQuestion(id) {
    const q = getQuestion(id);
    if (!q) return;
    const ok = await confirmDialog({
      title: '删除这道题？',
      message: `「${esc(q.stem.slice(0, 48))}${q.stem.length > 48 ? '…' : ''}」会从题库中移除，相关练习记录也会一起清理。`,
      confirmText: '删除',
      danger: true
    });
    if (!ok) return;
    const index = state.questions.findIndex((item) => item.id === id);
    const removedHistory = state.history.filter((h) => h.qid === id);
    state.questions.splice(index, 1);
    state.history = state.history.filter((h) => h.qid !== id);
    save();
    render();
    toast('题目已删除', 'success', {
      action: '撤销',
      onAction: () => {
        state.questions.splice(index, 0, q);
        state.history = removedHistory.concat(state.history);
        save();
        render();
      }
    });
  }

  function markMastered(id) {
    const q = getQuestion(id);
    if (!q) return;
    q.stats.lastCorrect = true;
    q.stats.correct = Math.max(2, q.stats.correct);
    q.stats.lastAt = Date.now();
    save();
    render();
    toast('已标记为掌握，之后做错会自动回到错题本', 'success');
  }

  function openPreview(id) {
    const q = getQuestion(id);
    if (!q) return;
    const options = (q.options || []).map((opt) => {
      const correct = (q.answer || []).includes(opt.key);
      return `<div class="preview-option ${correct ? 'correct' : ''}">
        <span class="option-key">${esc(opt.key)}</span>
        <span class="option-text">${esc(opt.text)}</span>
        ${correct ? `<span class="option-mark">${icon('check')}</span>` : ''}
      </div>`;
    }).join('');
    openModal({
      title: '题目详情',
      subtitle: `${bankName(q.bankId)} · ${TYPE_META[q.type].label} · ${DIFFICULTY_LABEL[q.difficulty] || '中等'}`,
      size: 'lg',
      body: `
        <div class="preview-detail">
          <div class="q-meta">${typeBadge(q)} ${(q.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>
          <h3 class="preview-stem">${esc(q.stem)}</h3>
          ${options ? `<div class="preview-options">${options}</div>` : ''}
          <div class="answer-reveal">正确答案：<b>${esc(answerText(q))}</b></div>
          ${q.explanation ? `<div class="preview-explanation"><span class="label">解析</span>${esc(q.explanation)}</div>` : ''}
          <div class="preview-meta">练习 ${q.stats.seen} 次 · 答对 ${q.stats.correct} 次 · 最近 ${relativeTime(q.stats.lastAt)}</div>
        </div>`,
      footer: `
        <button class="btn" data-action="close-modal">关闭</button>
        <button class="btn" data-action="edit-question" data-id="${escapeAttr(q.id)}">${icon('edit')} 编辑</button>
        <button class="btn btn-primary" data-action="practice-question" data-id="${escapeAttr(q.id)}">${icon('play')} 练这道题</button>`
    });
  }

  /* ---------------- 导入 ---------------- */

  let importCtx = { text: '', filename: '', parsed: null };
  let importTimer = null;

  const IMPORT_EXAMPLE = `1. 下列哪一项是 HTTP 的默认端口？
A. 21
B. 80
C. 443
D. 8080
答案：B
解析：HTTP 默认使用 80 端口，HTTPS 默认使用 443。

2. 以下哪些属于前端三大基础技术？
A. HTML
B. CSS
C. JavaScript
D. Python
答案：A,B,C

3. 判断题：localStorage 的数据在浏览器关闭后一定会被清空。
答案：错误
解析：localStorage 是持久化存储，除非主动清除，否则会一直保留。

4. 填空：JavaScript 中声明块级作用域变量使用 ____ 关键字。
答案：let`;

  function openImportModal(presetBankId) {
    importCtx = { text: '', filename: '', parsed: null };
    const preset = presetBankId || (state.activeBankId !== 'all' ? state.activeBankId : '');
    const defaultName = state.banks.length ? `我的题库 ${state.banks.length + 1}` : '我的题库';
    const targetOptions = [
      `<option value="new" ${!preset ? 'selected' : ''}>＋ 新建题库</option>`,
      ...state.banks.slice().sort((a, b) => a.createdAt - b.createdAt).map((b) => `<option value="${escapeAttr(b.id)}" ${preset === b.id ? 'selected' : ''}>${esc(b.name)}</option>`)
    ].join('');

    openModal({
      size: 'lg',
      title: '导入题目',
      subtitle: '支持 JSON、CSV / TSV（可以直接从 Excel 粘贴）和结构化纯文本。导入前会先预览，不会直接写进题库。',
      body: `
        <form id="importForm" data-form="import">
          <div class="import-target">
            <div class="field">
              <label for="importBankMode">导入到</label>
              <select class="select" id="importBankMode">${targetOptions}</select>
            </div>
            <div class="field" id="importNewBankField" ${preset ? 'style="display:none"' : ''}>
              <label for="importBankName">新题库名称</label>
              <input class="input" id="importBankName" maxlength="40" value="${escapeAttr(defaultName)}" placeholder="例如：计算机网络">
            </div>
          </div>

          <label class="dropzone" id="importDropzone" for="importFile">
            <span class="dropzone-icon">${icon('upload')}</span>
            <strong>点击选择文件，或把文件拖进来</strong>
            <span>.json / .csv / .tsv / .txt，最大 8 MB</span>
            <span class="file-chip" id="importFileChip" hidden></span>
          </label>
          <input class="file-hidden" id="importFile" type="file" accept=".json,.csv,.tsv,.txt,application/json,text/plain,text/csv">

          <div class="field" style="margin-top:14px">
            <label for="importText">或者直接粘贴内容</label>
            <textarea class="textarea import-textarea" id="importText" spellcheck="false" placeholder="把 Excel 里的题目区域直接复制粘贴到这里，或粘贴 JSON / 纯文本…"></textarea>
            <span class="hint">没有固定格式要求：有表头就按表头识别，没有表头会按「题目、选项、答案、解析」的顺序猜测。</span>
          </div>

          <div id="importPreview" class="import-preview">
            <div class="preview-head"><span class="preview-title">导入预览</span><span class="preview-count">等待内容</span></div>
            <div class="wrong-empty" style="padding:18px 0">粘贴或选择文件后，这里会显示识别结果。</div>
          </div>

          <details class="import-help">
            <summary>看看支持的格式示例</summary>
            <pre>题目,选项A,选项B,选项C,选项D,答案,解析
HTTP 默认端口是？,21,80,443,8080,B,HTTP 使用 80，HTTPS 使用 443
以下哪些是前端基础技术？,HTML,CSS,JavaScript,Python,A|B|C,HTML/CSS/JS 是前端三大件

也支持：
1. 题干
A. 选项一
B. 选项二
答案：A
解析：……

{"题目":"题干","选项":["A. …","B. …"],"答案":"A","解析":"…"}</pre>
          </details>

          <div style="margin-top:12px;display:flex;gap:14px;flex-wrap:wrap">
            <label class="checkline"><input type="checkbox" id="importDedupe" checked> 跳过同一题库里的重复题目</label>
            <button class="text-btn" type="button" data-action="fill-import-example">填入一段示例</button>
          </div>
        </form>`,
      footer: `
        <span class="foot-note">数据只会保存在当前浏览器</span>
        <button class="btn" data-action="close-modal">取消</button>
        <button class="btn btn-primary" id="importSubmit" type="submit" form="importForm" disabled>导入题目</button>`,
      onMount: (root) => {
        const textarea = $('#importText', root);
        const fileInput = $('#importFile', root);
        const dropzone = $('#importDropzone', root);
        const mode = $('#importBankMode', root);
        const newField = $('#importNewBankField', root);

        const updateMode = () => {
          if (!newField) return;
          newField.style.display = mode.value === 'new' ? '' : 'none';
        };
        mode.addEventListener('change', updateMode);
        updateMode();

        textarea.addEventListener('input', () => {
          clearTimeout(importTimer);
          importCtx.text = textarea.value;
          importTimer = setTimeout(() => refreshImportPreview(), 220);
        });

        fileInput.addEventListener('change', () => {
          const file = fileInput.files && fileInput.files[0];
          if (file) readImportFile(file);
        });

        ['dragenter', 'dragover'].forEach((eventName) => {
          dropzone.addEventListener(eventName, (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
        });
        ['dragleave', 'drop'].forEach((eventName) => {
          dropzone.addEventListener(eventName, (e) => { e.preventDefault(); dropzone.classList.remove('dragover'); });
        });
        dropzone.addEventListener('drop', (e) => {
          const file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
          if (file) readImportFile(file);
        });
      }
    });
  }

  async function readImportFile(file) {
    if (file.size > 8 * 1024 * 1024) {
      toast('文件超过 8 MB，建议拆分后再导入', 'error');
      return;
    }
    try {
      const buffer = await file.arrayBuffer();
      let text = '';
      try {
        text = new TextDecoder('utf-8', { fatal: true }).decode(buffer);
      } catch (err) {
        text = new TextDecoder('gbk').decode(buffer);
      }
      const textarea = $('#importText');
      if (!textarea) return;
      textarea.value = text;
      importCtx.text = text;
      importCtx.filename = file.name;
      const chip = $('#importFileChip');
      if (chip) { chip.textContent = file.name; chip.hidden = false; }
      refreshImportPreview();
      toast(`已读取 ${file.name}`, 'success', { duration: 1800 });
    } catch (err) {
      console.error(err);
      toast('文件读取失败，请确认格式或换一个文件', 'error');
    }
  }

  function refreshImportPreview() {
    const textarea = $('#importText');
    const preview = $('#importPreview');
    const submit = $('#importSubmit');
    if (!textarea || !preview) return;
    const text = textarea.value;
    importCtx.text = text;
    if (!text.trim()) {
      importCtx.parsed = null;
      preview.innerHTML = `<div class="preview-head"><span class="preview-title">导入预览</span><span class="preview-count">等待内容</span></div>
        <div class="wrong-empty" style="padding:18px 0">粘贴或选择文件后，这里会显示识别结果。</div>`;
      if (submit) { submit.disabled = true; submit.textContent = '导入题目'; }
      return;
    }
    const parsed = IMPORT.parse(text, importCtx.filename || '');
    importCtx.parsed = parsed;
    const count = parsed.questions.length;
    if (submit) {
      submit.disabled = count === 0;
      submit.textContent = count ? `导入 ${count} 道题` : '没有可导入的题目';
    }
    const previewItems = parsed.questions.slice(0, 4).map((q, i) => `<div class="preview-item">
      <span class="num">${i + 1}</span>
      <span class="stem"><span class="q-type ${TYPE_META[q.type] ? TYPE_META[q.type].cls : ''}" style="margin-right:5px">${TYPE_META[q.type] ? TYPE_META[q.type].label : '?'}</span>${esc(q.stem)}</span>
    </div>`).join('');
    const errors = parsed.errors && parsed.errors.length
      ? `<div class="preview-errors">${parsed.errors.slice(0, 5).map((e) => esc(e.message || e)).join('<br>')}${parsed.errors.length > 5 ? `<br>…另有 ${parsed.errors.length - 5} 条提示` : ''}</div>`
      : '';
    preview.innerHTML = `
      <div class="preview-head">
        <span class="preview-title">导入预览</span>
        <span class="preview-count">${parsed.format ? `${esc(parsed.format)} · ` : ''}${count ? `识别到 ${count} 道题` : '没有识别到题目'}</span>
      </div>
      ${previewItems ? `<div class="preview-list">${previewItems}${count > 4 ? `<div class="preview-item"><span class="num">…</span><span class="stem">还有 ${count - 4} 道题</span></div>` : ''}</div>` : '<div class="preview-errors">没有识别到题目，请检查格式，或展开下方示例对照一下。</div>'}
      ${errors}`;
  }

  function performImport() {
    const parsed = importCtx.parsed;
    if (!parsed || !parsed.questions.length) {
      toast('还没有可导入的题目', 'warn');
      return;
    }
    const mode = $('#importBankMode');
    const nameInput = $('#importBankName');
    let bankId = mode ? mode.value : 'new';
    let newBank = null;
    if (bankId === 'new') {
      const name = nameInput ? nameInput.value.trim() : '';
      if (!name) {
        toast('给新题库起一个名字', 'warn');
        if (nameInput) nameInput.focus();
        return;
      }
      newBank = createBank(name);
      bankId = newBank.id;
    } else if (!getBank(bankId)) {
      toast('目标题库不存在，请重新选择', 'error');
      return;
    }

    const dedupe = $('#importDedupe') ? $('#importDedupe').checked : true;
    const existing = new Set(state.questions.filter((q) => q.bankId === bankId).map((q) => normalizeStem(q.stem)));
    const now = Date.now();
    let added = 0;
    let skipped = 0;
    parsed.questions.forEach((raw, index) => {
      const key = normalizeStem(raw.stem);
      if (dedupe && existing.has(key)) { skipped += 1; return; }
      const q = makeQuestion(raw, bankId, index);
      q.createdAt = now + index;
      state.questions.push(q);
      existing.add(key);
      added += 1;
    });

    if (!added) {
      if (newBank) {
        state.banks = state.banks.filter((b) => b.id !== newBank.id);
      }
      toast(skipped ? `这 ${skipped} 道题已经存在了，没有重复导入` : '没有可导入的题目', 'warn');
      return;
    }

    state.activeBankId = bankId;
    save();
    closeModal(true);
    navigate('bank');
    toast(`已导入 ${added} 道题${skipped ? `，跳过 ${skipped} 道重复题` : ''}`, 'success');
  }

  /* ---------------- 设置、题库管理与导出 ---------------- */

  function openSettings() {
    const size = new Blob([JSON.stringify(state)]).size;
    openModal({
      title: '设置',
      subtitle: '偏好与本地数据',
      body: `
        <div class="settings-block">
          <h3>外观</h3>
          <div class="theme-options">
            ${[
              { key: 'auto', label: '跟随系统', icon: 'monitor' },
              { key: 'light', label: '浅色', icon: 'sun' },
              { key: 'dark', label: '深色', icon: 'moon' }
            ].map((t) => `<button class="theme-choice ${state.settings.theme === t.key ? 'active' : ''}" data-action="set-theme" data-theme="${t.key}">
              <span data-icon="${t.icon}"></span>${t.label}
            </button>`).join('')}
          </div>
        </div>
        <div class="settings-block">
          <h3>练习</h3>
          <div class="settings-line" style="margin-bottom:10px">
            <div><strong style="font-size:11px">每日目标</strong><p>首页圆环和今日进度会按这个目标计算。</p></div>
            <input class="input" style="width:86px;text-align:center" type="number" min="1" max="500" value="${state.settings.dailyGoal}" data-setting="dailyGoal">
          </div>
          <div class="settings-line" style="margin-bottom:10px">
            <div><strong style="font-size:11px">默认每次题量</strong><p>顺序练习和随机练习每次的题目数量。</p></div>
            <select class="select" style="width:102px" data-setting="perSession">
              ${[10, 20, 30, 50, 0].map((n) => `<option value="${n}" ${Number(state.settings.perSession) === n ? 'selected' : ''}>${n === 0 ? '全部' : `${n} 题`}</option>`).join('')}
            </select>
          </div>
          <div class="settings-line">
            <div><strong style="font-size:11px">考试默认配置</strong><p>打开模拟考试时预填的题量和时长。</p></div>
            <div style="display:flex;gap:6px">
              <input class="input" style="width:70px;text-align:center" type="number" min="1" max="500" value="${state.settings.examCount}" data-setting="examCount" title="题目数量">
              <input class="input" style="width:70px;text-align:center" type="number" min="1" max="300" value="${state.settings.examMinutes}" data-setting="examMinutes" title="分钟">
            </div>
          </div>
        </div>
        <div class="settings-block">
          <h3>数据</h3>
          <div class="settings-line" style="margin-bottom:10px">
            <div><strong style="font-size:11px">本地数据体积</strong><p>题库、练习记录和设置都保存在 localStorage。</p></div>
            <span class="pill">${formatBytes(size)}</span>
          </div>
          <div class="settings-actions">
            <button class="btn btn-sm" data-action="export-backup">${icon('database')} 备份全部数据</button>
            <button class="btn btn-sm" data-action="restore-backup">${icon('refresh')} 从备份恢复</button>
            <button class="btn btn-sm" data-action="open-export">${icon('download')} 导出题库</button>
          </div>
          <input class="file-hidden" id="restoreInput" type="file" accept=".json,application/json">
        </div>
        <div class="settings-block">
          <div class="danger-zone">
            <div><strong>清空所有数据</strong><span>删除题库、练习记录和设置，不可恢复。</span></div>
            <button class="btn btn-sm btn-danger" data-action="clear-all">清空</button>
          </div>
        </div>`,
      footer: `<span class="foot-note">刷题小屋 · 本地优先</span><button class="btn btn-primary" data-action="close-modal">完成</button>`,
      onMount: (root) => {
        const restore = $('#restoreInput', root);
        restore.addEventListener('change', () => {
          const file = restore.files && restore.files[0];
          if (file) restoreBackup(file);
          restore.value = '';
        });
      }
    });
  }

  function setTheme(theme) {
    if (!['auto', 'light', 'dark'].includes(theme)) return;
    state.settings.theme = theme;
    applyTheme();
    save();
    render();
    $$('.theme-choice').forEach((el) => el.classList.toggle('active', el.dataset.theme === theme));
  }

  function openBankManager() {
    const rows = state.banks.slice().sort((a, b) => a.createdAt - b.createdAt).map((bank) => {
      const count = state.questions.filter((q) => q.bankId === bank.id).length;
      return `<div class="manager-row">
        <span class="stat-icon green" style="width:31px;height:31px;font-size:14px;flex:0 0 auto">${icon('folder')}</span>
        <div class="manager-row-main"><strong>${esc(bank.name)}</strong><span>${count} 道题 · 创建于 ${formatDate(bank.createdAt)}</span></div>
        <div class="manager-actions">
          <button class="icon-btn" data-action="rename-bank" data-bank="${escapeAttr(bank.id)}" title="重命名">${icon('edit')}</button>
          <button class="icon-btn" data-action="delete-bank" data-bank="${escapeAttr(bank.id)}" title="删除题库">${icon('trash')}</button>
        </div>
      </div>`;
    }).join('');
    openModal({
      title: '管理题库',
      subtitle: `${state.banks.length} 个题库 · ${state.questions.length} 道题`,
      body: `<div class="manager-list">${rows || '<div class="wrong-empty">还没有题库，先新建一个。</div>'}</div>
        <p class="hint" style="margin-top:12px;color:var(--faint);font-size:10px;line-height:1.7">删除题库会同时删除其中的题目和练习记录。重命名不会影响已有数据。</p>`,
      footer: `<button class="btn" data-action="close-modal">关闭</button><button class="btn btn-primary" data-action="create-bank">${icon('plus')} 新建题库</button>`
    });
  }

  async function createBankFlow() {
    const name = await promptDialog({ title: '新建题库', label: '题库名称', placeholder: '例如：计算机网络', confirmText: '创建' });
    if (!name) return;
    createBank(name);
    save();
    render();
    openBankManager();
    toast('题库已创建', 'success');
  }

  async function renameBankFlow(id) {
    const bank = getBank(id);
    if (!bank) return;
    const name = await promptDialog({ title: '重命名题库', label: '题库名称', value: bank.name, confirmText: '保存' });
    if (!name || name === bank.name) return;
    bank.name = name;
    save();
    render();
    openBankManager();
    toast('已重命名', 'success');
  }

  async function deleteBankFlow(id) {
    const bank = getBank(id);
    if (!bank) return;
    const ids = state.questions.filter((q) => q.bankId === id).map((q) => q.id);
    const ok = await confirmDialog({
      title: '删除整个题库？',
      message: `「${esc(bank.name)}」里的 ${ids.length} 道题和它们的练习记录会一起删除，无法恢复。`,
      confirmText: '删除题库',
      danger: true
    });
    if (!ok) return;
    state.banks = state.banks.filter((b) => b.id !== id);
    state.questions = state.questions.filter((q) => q.bankId !== id);
    const idSet = new Set(ids);
    state.history = state.history.filter((h) => !idSet.has(h.qid));
    if (state.activeBankId === id) state.activeBankId = 'all';
    save();
    render();
    openBankManager();
    toast('题库已删除', 'success');
  }

  function exportQuestionObject(q) {
    const optionObj = {};
    (q.options || []).forEach((opt) => { optionObj[opt.key] = opt.text; });
    let answer;
    if (q.type === 'fill') answer = (q.answer || []).join('|');
    else if (q.type === 'judge') answer = (q.answer || []).map((k) => (k === 'T' ? '正确' : '错误')).join(',');
    else answer = (q.answer || []).join(',');
    return {
      题目: q.stem,
      类型: TYPE_META[q.type].label,
      选项: optionObj,
      答案: answer,
      解析: q.explanation || '',
      标签: (q.tags || []).join(','),
      难度: DIFFICULTY_LABEL[q.difficulty] || '中等'
    };
  }

  function downloadFile(content, filename, mime) {
    const blob = new Blob([content], { type: `${mime};charset=utf-8` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }

  function csvCell(value) {
    const text = String(value == null ? '' : value);
    if (/[",\n\r]/.test(text)) return `"${text.replace(/"/g, '""')}"`;
    return text;
  }

  function exportQuestionsCSV(list) {
    const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const header = ['题目', '类型', ...keys.map((k) => `选项${k}`), '答案', '解析', '标签', '难度'];
    const lines = [header.map(csvCell).join(',')];
    list.forEach((q) => {
      const optionMap = {};
      (q.options || []).forEach((opt) => { optionMap[opt.key] = opt.text; });
      const answer = q.type === 'fill'
        ? (q.answer || []).join('|')
        : q.type === 'judge'
          ? (q.answer || []).map((k) => (k === 'T' ? '正确' : '错误')).join(',')
          : (q.answer || []).join(',');
      lines.push([
        q.stem,
        TYPE_META[q.type].label,
        ...keys.map((k) => optionMap[k] || ''),
        answer,
        q.explanation || '',
        (q.tags || []).join(','),
        DIFFICULTY_LABEL[q.difficulty] || '中等'
      ].map(csvCell).join(','));
    });
    return `\uFEFF${lines.join('\r\n')}`;
  }

  function doExport(kind) {
    const stamp = dateKey().replace(/-/g, '');
    if (kind === 'backup') {
      const payload = JSON.stringify({ app: 'quiz-shed', version: APP_VERSION, exportedAt: Date.now(), state }, null, 2);
      downloadFile(payload, `刷题小屋-备份-${stamp}.json`, 'application/json');
      toast('备份已下载', 'success');
      closeModal(true);
      return;
    }
    const list = activeQuestions();
    if (!list.length) {
      toast('当前题库没有可导出的题目', 'warn');
      return;
    }
    const scopeName = fileSafeName(state.activeBankId === 'all' ? '全部题库' : bankName(state.activeBankId));
    if (kind === 'json') {
      const payload = JSON.stringify(list.map(exportQuestionObject), null, 2);
      downloadFile(payload, `${scopeName}-${stamp}.json`, 'application/json');
    } else if (kind === 'csv') {
      downloadFile(exportQuestionsCSV(list), `${scopeName}-${stamp}.csv`, 'text/csv');
    }
    toast(`已导出 ${list.length} 道题`, 'success');
    closeModal(true);
  }

  function openExportModal() {
    const list = activeQuestions();
    const scopeName = state.activeBankId === 'all' ? '全部题库' : bankName(state.activeBankId);
    openModal({
      title: '导出数据',
      subtitle: `当前范围：${esc(scopeName)} · ${list.length} 道题`,
      body: `
        <div class="export-list">
          <div class="export-row">
            <div><strong>题库 JSON</strong><span>保留题型、选项、答案、解析和标签，适合再导入或迁移。</span></div>
            <button class="btn btn-sm" data-action="do-export" data-kind="json" ${list.length ? '' : 'disabled'}>导出</button>
          </div>
          <div class="export-row">
            <div><strong>题库 CSV</strong><span>可以用 Excel 打开；选项按 A–H 分列，答案和解析在右侧。</span></div>
            <button class="btn btn-sm" data-action="do-export" data-kind="csv" ${list.length ? '' : 'disabled'}>导出</button>
          </div>
          <div class="export-row">
            <div><strong>完整备份</strong><span>包含所有题库、练习记录和设置，可用于换电脑或恢复。</span></div>
            <button class="btn btn-sm" data-action="do-export" data-kind="backup">备份</button>
          </div>
        </div>`,
      footer: `<button class="btn" data-action="close-modal">关闭</button>`
    });
  }

  async function restoreBackup(file) {
    let data;
    try {
      const text = await file.text();
      data = JSON.parse(text);
    } catch (err) {
      toast('备份文件不是有效的 JSON', 'error');
      return;
    }
    const payload = data && data.state ? data.state : data;
    if (!payload || !Array.isArray(payload.questions) || !Array.isArray(payload.banks)) {
      toast('备份文件缺少题库或题目数据，无法恢复', 'error');
      return;
    }
    const ok = await confirmDialog({
      title: '从备份恢复？',
      message: `备份里包含 ${payload.banks.length} 个题库、${payload.questions.length} 道题。恢复会覆盖当前所有数据。`,
      confirmText: '覆盖恢复',
      danger: true
    });
    if (!ok) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      state = loadState();
      ui.bankPage = 1;
      ui.bankQuery = '';
      ui.bankType = 'all';
      applyTheme();
      closeModal(true);
      navigate('home');
      toast('备份已恢复', 'success');
    } catch (err) {
      console.error(err);
      toast('恢复失败：浏览器本地存储不可用', 'error');
    }
  }

  async function clearAllData() {
    const ok = await confirmDialog({
      title: '清空所有数据？',
      message: '所有题库、题目、练习记录和设置都会被删除。这个操作不可恢复，建议先备份。',
      confirmText: '全部清空',
      danger: true
    });
    if (!ok) return;
    try { localStorage.removeItem(STORAGE_KEY); } catch (err) { /* ignore */ }
    state = blankState();
    ui.bankPage = 1;
    ui.bankQuery = '';
    ui.bankType = 'all';
    applyTheme();
    closeModal(true);
    navigate('home');
    toast('数据已清空', 'success');
  }

  /* ---------------- 题目编辑器 ---------------- */

  function editorOptionRow(key, text) {
    return `<div class="option-edit-row" data-key="${key}">
      <span class="option-key-badge">${key}</span>
      <input class="input" value="${escapeAttr(text)}" placeholder="选项内容" autocomplete="off">
      <button class="icon-btn" type="button" data-remove-option title="删除此选项" aria-label="删除此选项">${icon('x')}</button>
    </div>`;
  }

  function openQuestionEditor(id, presetBankId) {
    let q = id ? getQuestion(id) : null;
    if (!state.banks.length) {
      createBank('我的题库');
      save();
    }
    const defaultBank = q ? q.bankId : (presetBankId || (state.activeBankId !== 'all' ? state.activeBankId : state.banks[0].id));
    const type = q ? q.type : 'single';
    let options = q && q.options && q.options.length
      ? q.options.map((o) => ({ ...o }))
      : [{ key: 'A', text: '' }, { key: 'B', text: '' }, { key: 'C', text: '' }, { key: 'D', text: '' }];
    if (type === 'judge') options = [{ key: 'T', text: '正确' }, { key: 'F', text: '错误' }];
    const choiceAnswer = q && ['single', 'multiple'].includes(q.type) ? q.answer.join(',') : '';
    const fillAnswer = q && q.type === 'fill' ? q.answer.join('|') : '';
    const judgeAnswer = q && q.type === 'judge' ? q.answer[0] : 'T';
    const isChoice = type === 'single' || type === 'multiple';

    openModal({
      size: 'lg',
      title: q ? '编辑题目' : '新增题目',
      subtitle: q ? `创建于 ${formatDate(q.createdAt)} · 练习 ${q.stats.seen} 次` : '手动补一道题，或者修正导入时的识别错误。',
      body: `
        <form id="editorForm" data-form="editor" data-editing="${escapeAttr(id || '')}">
          <div class="form-row">
            <div class="field">
              <label for="editorBank">所属题库</label>
              <select class="select" id="editorBank">
                ${state.banks.slice().sort((a, b) => a.createdAt - b.createdAt).map((b) => `<option value="${escapeAttr(b.id)}" ${b.id === defaultBank ? 'selected' : ''}>${esc(b.name)}</option>`).join('')}
              </select>
            </div>
            <div class="field">
              <label for="editorType">题型</label>
              <select class="select" id="editorType">
                <option value="single" ${type === 'single' ? 'selected' : ''}>单选题</option>
                <option value="multiple" ${type === 'multiple' ? 'selected' : ''}>多选题</option>
                <option value="judge" ${type === 'judge' ? 'selected' : ''}>判断题</option>
                <option value="fill" ${type === 'fill' ? 'selected' : ''}>填空题</option>
              </select>
            </div>
          </div>
          <div class="field">
            <label for="editorStem">题干</label>
            <textarea class="textarea" id="editorStem" placeholder="输入题目内容…" autofocus>${esc(q ? q.stem : '')}</textarea>
          </div>

          <div id="editorOptionBlock" style="${isChoice ? '' : 'display:none'}">
            <div class="editor-options-head">
              <span class="field-label">选项</span>
              <button class="text-btn" type="button" data-action="add-editor-option">${icon('plus')} 添加选项</button>
            </div>
            <div class="option-editor" id="editorOptions">
              ${options.map((o) => editorOptionRow(o.key, o.text)).join('')}
            </div>
          </div>

          <div class="field" id="editorChoiceAnswer" style="${isChoice ? '' : 'display:none'}">
            <label for="editorChoiceAnswerInput">正确答案</label>
            <input class="input" id="editorChoiceAnswerInput" value="${escapeAttr(choiceAnswer)}" placeholder="单选填 A，多选填 A,C" autocomplete="off">
            <span class="hint">用字母作答；多选题用逗号分隔，例如 A,C。</span>
          </div>

          <div class="field" id="editorJudgeBlock" style="${type === 'judge' ? '' : 'display:none'}">
            <label for="editorJudgeAnswer">正确答案</label>
            <select class="select" id="editorJudgeAnswer">
              <option value="T" ${judgeAnswer === 'T' ? 'selected' : ''}>正确</option>
              <option value="F" ${judgeAnswer === 'F' ? 'selected' : ''}>错误</option>
            </select>
          </div>

          <div class="field" id="editorFillBlock" style="${type === 'fill' ? '' : 'display:none'}">
            <label for="editorFillAnswer">参考答案</label>
            <input class="input" id="editorFillAnswer" value="${escapeAttr(fillAnswer)}" placeholder="多个可接受答案用 | 分隔，例如：H2O|水" autocomplete="off">
          </div>

          <div class="field">
            <label for="editorExplanation">解析（可选）</label>
            <textarea class="textarea" id="editorExplanation" placeholder="为什么是这个答案？写下来，复盘时更有用。">${esc(q ? q.explanation : '')}</textarea>
          </div>

          <div class="form-row">
            <div class="field">
              <label for="editorTags">标签（可选）</label>
              <input class="input" id="editorTags" value="${escapeAttr(q ? q.tags.join(',') : '')}" placeholder="例如：计算机网络,重点" autocomplete="off">
            </div>
            <div class="field">
              <label for="editorDifficulty">难度</label>
              <select class="select" id="editorDifficulty">
                <option value="1" ${q && q.difficulty === 1 ? 'selected' : ''}>简单</option>
                <option value="2" ${!q || q.difficulty === 2 ? 'selected' : ''}>中等</option>
                <option value="3" ${q && q.difficulty === 3 ? 'selected' : ''}>困难</option>
              </select>
            </div>
          </div>

          <div class="form-error" id="editorError"></div>
        </form>`,
      footer: `<button class="btn" data-action="close-modal">取消</button><button class="btn btn-primary" data-action="save-editor">${q ? '保存修改' : '添加题目'}</button>`,
      onMount: (root) => {
        const typeSelect = $('#editorType', root);
        const optionBlock = $('#editorOptionBlock', root);
        const choiceAnswer = $('#editorChoiceAnswer', root);
        const judgeBlock = $('#editorJudgeBlock', root);
        const fillBlock = $('#editorFillBlock', root);
        const optionList = $('#editorOptions', root);

        const sync = () => {
          const t = typeSelect.value;
          const choice = t === 'single' || t === 'multiple';
          optionBlock.style.display = choice ? '' : 'none';
          choiceAnswer.style.display = choice ? '' : 'none';
          judgeBlock.style.display = t === 'judge' ? '' : 'none';
          fillBlock.style.display = t === 'fill' ? '' : 'none';
        };
        typeSelect.addEventListener('change', sync);

        optionList.addEventListener('click', (e) => {
          const btn = e.target.closest('[data-remove-option]');
          if (!btn) return;
          const rows = $$('.option-edit-row', optionList);
          if (rows.length <= 2) { toast('选择题至少保留两个选项', 'warn'); return; }
          btn.closest('.option-edit-row').remove();
        });
      }
    });
  }

  function addEditorOption() {
    const list = $('#editorOptions');
    if (!list) return;
    const rows = $$('.option-edit-row', list);
    if (rows.length >= 8) { toast('最多支持 8 个选项', 'warn'); return; }
    const used = new Set(rows.map((row) => row.dataset.key));
    const key = 'ABCDEFGH'.split('').find((k) => !used.has(k));
    if (!key) return;
    list.insertAdjacentHTML('beforeend', editorOptionRow(key, ''));
    const input = list.lastElementChild.querySelector('input');
    if (input) input.focus();
  }

  function editorError(message) {
    const box = $('#editorError');
    if (!box) return;
    box.textContent = message || '';
    box.classList.toggle('show', !!message);
  }

  function saveEditor() {
    editorError('');
    const stem = $('#editorStem').value.trim();
    if (!stem) { editorError('题干不能为空'); $('#editorStem').focus(); return; }
    const type = $('#editorType').value;
    const bankId = $('#editorBank').value;
    if (!getBank(bankId)) { editorError('请选择题库'); return; }

    let raw;
    if (type === 'single' || type === 'multiple') {
      const options = $$('#editorOptions .option-edit-row').map((row) => ({
        key: row.dataset.key,
        text: row.querySelector('input').value.trim()
      })).filter((o) => o.text);
      if (options.length < 2) { editorError('选择题至少需要两个有内容的选项'); return; }
      const answer = $('#editorChoiceAnswerInput').value.trim();
      if (!answer) { editorError('请填写正确答案，例如 A 或 A,C'); return; }
      raw = { stem, type, options, answer };
    } else if (type === 'judge') {
      raw = { stem, type, answer: $('#editorJudgeAnswer').value };
    } else {
      const answer = $('#editorFillAnswer').value.trim();
      if (!answer) { editorError('请填写参考答案'); return; }
      raw = { stem, type, answer };
    }
    raw.explanation = $('#editorExplanation').value.trim();
    raw.tags = $('#editorTags').value.split(/[,，、]/).map((t) => t.trim()).filter(Boolean);
    raw.difficulty = Number($('#editorDifficulty').value) || 2;

    let normalized;
    try {
      normalized = IMPORT.normalizeRaw(raw);
    } catch (err) {
      editorError(err.message || '题目格式不正确');
      return;
    }

    const editingId = $('#editorForm').dataset.editing || '';
    const old = editingId ? getQuestion(editingId) : null;
    if (old) {
      old.stem = normalized.stem;
      old.type = normalized.type;
      old.options = normalized.options;
      old.answer = normalized.answer;
      old.explanation = normalized.explanation;
      old.tags = normalized.tags;
      old.difficulty = normalized.difficulty;
      old.bankId = bankId;
    } else {
      const q = makeQuestion(normalized, bankId);
      state.questions.push(q);
    }
    save();
    closeModal(true);
    render();
    toast(old ? '题目已更新' : '题目已添加', 'success');
  }

  /* ---------------- 事件绑定 ---------------- */

  function bindEvents() {
    document.addEventListener('click', (e) => {
      const el = e.target.closest('[data-action]');
      if (!el) return;
      const action = el.dataset.action;
      if (!action) return;
      if (el.tagName === 'BUTTON' || el.tagName === 'A') e.preventDefault();
      handleAction(action, el, e);
    });

    document.addEventListener('change', (e) => {
      const bankSelect = e.target.closest('[data-bank-select]');
      if (bankSelect) {
        selectBank(bankSelect.value);
        return;
      }
      const setting = e.target.closest('[data-setting]');
      if (setting) {
        const key = setting.dataset.setting;
        let value = Number(setting.value);
        if (key === 'perSession') {
          if (![0, 10, 20, 30, 50].includes(value)) value = 20;
        } else if (key === 'dailyGoal') {
          value = clamp(value || 20, 1, 500);
        } else if (key === 'examCount') {
          value = clamp(value || 20, 1, 500);
        } else if (key === 'examMinutes') {
          value = clamp(value || 20, 1, 300);
        }
        state.settings[key] = value;
        setting.value = value;
        save();
        render();
        return;
      }
      if (e.target.id === 'bankTypeFilter') {
        ui.bankType = e.target.value;
        ui.bankPage = 1;
        refreshBankResults();
        return;
      }
      if (e.target.id === 'editorType') {
        // 由编辑器的 onMount 处理
      }
    });

    document.addEventListener('input', (e) => {
      if (e.target.id === 'bankSearchInput') {
        ui.bankQuery = e.target.value;
        ui.bankPage = 1;
        refreshBankResults();
        return;
      }
      if (e.target.id === 'sessionFill' && session && !session.finished) {
        const q = sessionQueue()[session.index];
        const record = session.records[q.id];
        if (record) record.text = e.target.value;
      }
    });

    document.addEventListener('submit', (e) => {
      const form = e.target.closest('form[data-form]');
      if (!form) return;
      e.preventDefault();
      if (form.dataset.form === 'import') performImport();
      else if (form.dataset.form === 'editor') saveEditor();
      else if (form.dataset.form === 'exam') beginExam();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if ($('#modalRoot') && $('#modalRoot').firstChild) { closeModal(); return; }
        if (session) { exitSession(); return; }
      }
      if ($('#modalRoot') && $('#modalRoot').firstChild) return;
      if (!session) return;
      if (e.target.id === 'sessionFill' && e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submitCurrentAnswer();
        return;
      }
      if (e.target.closest('input, textarea, select, [contenteditable="true"]')) return;
      handleSessionKey(e);
    });

    window.addEventListener('beforeunload', (e) => {
      if (session && !session.finished) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
      return undefined;
    });
  }

  function handleAction(action, el) {
    switch (action) {
      case 'nav':
        navigate(el.dataset.route || 'home');
        break;
      case 'select-bank':
        selectBank(el.dataset.bank || 'all');
        break;
      case 'open-bank-practice':
        selectBank(el.dataset.bank || 'all');
        navigate('practice');
        break;
      case 'select-bank-and-practice':
        selectBank(el.dataset.bank || 'all');
        navigate('practice');
        break;
      case 'open-import':
        openImportModal(el.dataset.bank || '');
        break;
      case 'new-question':
        openQuestionEditor(null, state.activeBankId !== 'all' ? state.activeBankId : undefined);
        break;
      case 'load-sample':
        loadSample();
        break;
      case 'start-mode':
        startMode(el.dataset.mode || 'sequence');
        break;
      case 'open-exam':
        openExamModal();
        break;
      case 'begin-exam':
        beginExam();
        break;
      case 'open-settings':
        openSettings();
        break;
      case 'open-bank-manager':
        openBankManager();
        break;
      case 'open-export':
        openExportModal();
        break;
      case 'preview-question':
        openPreview(el.dataset.id);
        break;
      case 'toggle-favorite':
        toggleFavorite(el.dataset.id);
        break;
      case 'edit-question':
        openQuestionEditor(el.dataset.id);
        break;
      case 'save-editor':
        saveEditor();
        break;
      case 'delete-question':
        deleteQuestion(el.dataset.id);
        break;
      case 'mark-mastered':
        markMastered(el.dataset.id);
        break;
      case 'practice-question':
        closeModal(true);
        beginSession('review', { ids: [el.dataset.id], label: '单题练习' });
        break;
      case 'add-editor-option':
        addEditorOption();
        break;
      case 'bank-page':
        ui.bankPage = clamp(Number(el.dataset.page) || 1, 1, 9999);
        refreshBankResults();
        break;
      case 'reset-bank-filter':
        ui.bankQuery = '';
        ui.bankType = 'all';
        ui.bankPage = 1;
        render();
        break;
      case 'set-theme':
        setTheme(el.dataset.theme);
        break;
      case 'toggle-theme':
        cycleTheme();
        break;
      case 'create-bank':
        createBankFlow();
        break;
      case 'rename-bank':
        renameBankFlow(el.dataset.bank);
        break;
      case 'delete-bank':
        deleteBankFlow(el.dataset.bank);
        break;
      case 'export-backup':
        doExport('backup');
        break;
      case 'restore-backup': {
        const input = $('#restoreInput');
        if (input) input.click();
        break;
      }
      case 'clear-all':
        clearAllData();
        break;
      case 'do-export':
        doExport(el.dataset.kind);
        break;
      case 'fill-import-example': {
        const textarea = $('#importText');
        if (textarea) {
          textarea.value = IMPORT_EXAMPLE;
          importCtx.text = IMPORT_EXAMPLE;
          refreshImportPreview();
          textarea.focus();
        }
        break;
      }
      case 'close-modal':
        closeModal();
        break;
      case 'confirm-yes':
        resolveConfirm(true);
        break;
      case 'confirm-no':
        if (promptResolver) {
          const fn = promptResolver;
          promptResolver = null;
          fn(null);
          closeModal(true);
        } else {
          resolveConfirm(false);
        }
        break;
      case 'prompt-submit': {
        const input = $('#promptInput');
        if (!input) break;
        const value = input.value.trim();
        if (!value) { toast('名称不能为空', 'warn'); input.focus(); break; }
        const fn = promptResolver;
        promptResolver = null;
        if (fn) fn(value);
        closeModal(true);
        break;
      }
      case 'pick-option':
        pickOption(el.dataset.key);
        break;
      case 'submit-answer':
        submitCurrentAnswer();
        break;
      case 'next-question':
        nextQuestion();
        break;
      case 'prev-question':
        prevQuestion();
        break;
      case 'jump-question':
        jumpToQuestion(Number(el.dataset.index));
        break;
      case 'toggle-flag':
        toggleFlag();
        break;
      case 'finish-exam':
        finishExam(false);
        break;
      case 'exit-session':
        exitSession();
        break;
      case 'result-home':
        closeSession();
        break;
      case 'result-retry':
        retrySession();
        break;
      case 'result-wrong':
        retryWrong();
        break;
      default:
        break;
    }
  }

  /* ---------------- 答题会话 ---------------- */

  let session = null;
  let sessionTimer = null;

  const SESSION_MODE_LABEL = {
    sequence: '顺序练习',
    random: '随机练习',
    wrong: '错题重练',
    favorite: '收藏练习',
    exam: '模拟考试',
    review: '专项练习'
  };

  function sessionQueue() {
    if (!session) return [];
    return session.ids.map((id) => getQuestion(id)).filter(Boolean);
  }

  function currentSessionQuestion() {
    const queue = sessionQueue();
    if (!session || !queue.length) return null;
    return queue[clamp(session.index, 0, queue.length - 1)] || null;
  }

  function currentSessionRecord() {
    const q = currentSessionQuestion();
    return q && session ? session.records[q.id] : null;
  }

  function questionOptions(q) {
    if (q && Array.isArray(q.options) && q.options.length) return q.options;
    if (q && q.type === 'judge') return [{ key: 'T', text: '正确' }, { key: 'F', text: '错误' }];
    return [];
  }

  function recordHasAnswer(q, record) {
    if (!record) return false;
    if (q.type === 'fill') return !!String(record.text || '').trim();
    return record.picked.length > 0;
  }

  function normalizeFill(value) {
    return String(value == null ? '' : value)
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[，。！？；：、,.!?;:（）()【】\[\]“”"']/g, '');
  }

  function answerIsCorrect(q, record) {
    const expected = Array.isArray(q.answer) ? q.answer : [String(q.answer || '')].filter(Boolean);
    if (q.type === 'fill') {
      const got = normalizeFill(record.text);
      if (!got) return false;
      return expected.some((item) => normalizeFill(item) === got);
    }
    const picked = record.picked.slice().sort();
    const sorted = expected.slice().sort();
    return picked.length > 0 && picked.length === sorted.length && picked.every((key, i) => key === sorted[i]);
  }

  function answeredSessionCount() {
    if (!session) return 0;
    return sessionQueue().reduce((count, q) => {
      const rec = session.records[q.id];
      if (!rec) return count;
      return count + (rec.checked || recordHasAnswer(q, rec) ? 1 : 0);
    }, 0);
  }

  function beginSession(mode, options = {}) {
    closeSession(true);
    let list;
    if (Array.isArray(options.ids)) {
      list = options.ids.map(getQuestion).filter(Boolean);
    } else {
      list = activeQuestions();
    }
    if (mode === 'wrong') list = list.filter(isWrong);
    if (mode === 'favorite') list = list.filter((q) => q.favorite);
    if (mode === 'exam' || mode === 'random') list = shuffle(list);
    else if (!Array.isArray(options.ids) || mode !== 'review') {
      list = list.slice().sort((a, b) => a.createdAt - b.createdAt);
    }

    if (mode === 'exam') {
      let count = Number(options.count) || Number(state.settings.examCount) || 20;
      count = clamp(count, 1, Math.max(1, list.length));
      list = list.slice(0, count);
    } else if (!Array.isArray(options.ids)) {
      const per = Number(state.settings.perSession) || 0;
      if (per > 0) list = list.slice(0, per);
    }

    if (!list.length) {
      const modeText = mode === 'wrong' ? '错题本还是空的，先做几道题吧' : mode === 'favorite' ? '还没有收藏题目' : '当前题库还没有可练习的题目';
      toast(modeText, 'warn');
      return;
    }

    const label = options.label || SESSION_MODE_LABEL[mode] || '练习';
    const records = {};
    list.forEach((q) => {
      records[q.id] = {
        picked: [],
        text: '',
        checked: false,
        correct: null,
        flagged: false,
        recorded: false
      };
    });

    session = {
      mode,
      label,
      ids: list.map((q) => q.id),
      index: 0,
      records,
      exam: mode === 'exam',
      startedAt: Date.now(),
      deadline: null,
      minutes: clamp(Number(options.minutes) || Number(state.settings.examMinutes) || 20, 1, 300),
      finished: false,
      finishing: false,
      result: null
    };
    if (session.exam) session.deadline = Date.now() + session.minutes * 60000;

    document.body.classList.add('session-open');
    renderSession();
    startSessionTimer();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function startMode(mode) {
    const scope = activeQuestions();
    if (!scope.length) {
      toast('当前题库还没有题目，先导入或者载入示例题库', 'warn');
      return;
    }
    if (mode === 'wrong' && !scope.some(isWrong)) { toast('错题本是空的，先做几道题吧', 'warn'); return; }
    if (mode === 'favorite' && !scope.some((q) => q.favorite)) { toast('还没有收藏题目', 'warn'); return; }
    beginSession(mode);
  }

  function openExamModal() {
    const scope = activeQuestions();
    if (!scope.length) {
      toast('当前题库还没有题目，先导入题目', 'warn');
      return;
    }
    const maxCount = scope.length;
    const count = clamp(Number(state.settings.examCount) || 20, 1, maxCount);
    const minutes = clamp(Number(state.settings.examMinutes) || 20, 1, 300);
    openModal({
      title: '模拟考试',
      subtitle: '随机抽题、限时作答，交卷后统一看答案。',
      size: 'sm',
      body: `
        <form id="examForm" data-form="exam">
          <div class="field">
            <label for="examCountInput">抽题数量</label>
            <input class="input" id="examCountInput" type="number" min="1" max="${maxCount}" value="${count}">
            <span class="hint">当前题库共 ${maxCount} 道题，最多抽 ${maxCount} 道。</span>
          </div>
          <div class="field">
            <label for="examMinutesInput">考试时长</label>
            <select class="select" id="examMinutesInput">
              ${[10, 20, 30, 45, 60, 90, 120].map((n) => `<option value="${n}" ${n === minutes ? 'selected' : ''}>${n} 分钟</option>`).join('')}
            </select>
          </div>
          <div class="side-note"><strong>考试规则</strong>未作答题目按错误计入成绩；交卷后可以只练错题。</div>
        </form>`,
      footer: `<button class="btn" data-action="close-modal">取消</button><button class="btn btn-primary" data-action="begin-exam">开始考试</button>`
    });
  }

  function beginExam() {
    const scope = activeQuestions();
    if (!scope.length) { toast('当前题库还没有题目', 'warn'); closeModal(true); return; }
    const count = clamp(Number($('#examCountInput') ? $('#examCountInput').value : state.settings.examCount) || 20, 1, scope.length);
    const minutes = clamp(Number($('#examMinutesInput') ? $('#examMinutesInput').value : state.settings.examMinutes) || 20, 1, 300);
    state.settings.examCount = count;
    state.settings.examMinutes = minutes;
    save();
    closeModal(true);
    beginSession('exam', { count, minutes });
  }

  function renderSession() {
    const root = $('#sessionRoot');
    if (!root) return;
    if (!session) { root.innerHTML = ''; return; }
    const animateIn = !root.querySelector('.session-screen');
    if (session.finished) {
      root.innerHTML = renderResult();
      hydrateIcons(root);
      return;
    }
    const queue = sessionQueue();
    if (!queue.length) { closeSession(true); return; }
    session.index = clamp(session.index, 0, queue.length - 1);
    const q = queue[session.index];
    const rec = session.records[q.id];
    const total = queue.length;
    const answered = answeredSessionCount();
    const progress = total ? Math.round((answered / total) * 100) : 0;
    const remaining = session.exam ? Math.max(0, Math.ceil((session.deadline - Date.now()) / 1000)) : 0;
    const elapsed = Math.floor((Date.now() - session.startedAt) / 1000);
    const timerText = session.exam ? formatClock(remaining) : formatClock(elapsed);
    const timerWarning = session.exam && remaining <= 60;

    root.innerHTML = `
      <div class="session-screen${animateIn ? ' session-screen-enter' : ''}">
        <header class="session-head">
          <button class="session-exit" data-action="exit-session">${icon('arrowLeft')} 退出</button>
          <div class="session-meta">
            <div class="session-meta-row">
              <span class="session-mode">${esc(session.label)}${session.exam ? ` · ${session.minutes} 分钟` : ''}</span>
              <span class="session-count">第 ${session.index + 1} / ${total} 题 · 已答 ${answered}</span>
            </div>
            <div class="session-progress"><span style="width:${progress}%"></span></div>
          </div>
          <div class="session-tools">
            <span class="timer ${timerWarning ? 'warning' : ''}" id="sessionTimer">${icon('clock')}<span>${timerText}</span></span>
            ${session.exam ? '<button class="btn btn-primary btn-sm" data-action="finish-exam">交卷</button>' : ''}
          </div>
        </header>
        <div class="session-body">
          <div class="question-wrap">
            <div class="question-card">
              <div class="question-head">
                ${typeBadge(q)}
                <span class="question-bank">${esc(bankName(q.bankId))}</span>
                <span class="question-no">第 ${session.index + 1} 题</span>
              </div>
              <div class="question-stem">${esc(q.stem)}</div>
              ${q.type === 'fill' ? renderFillInput(q, rec) : renderOptions(q, rec)}
              ${!session.exam && rec.checked ? renderFeedback(q, rec) : ''}
              ${renderQuestionActions(q, rec, total)}
            </div>
          </div>
          <aside class="session-side">
            <div class="panel palette-card">
              <div class="palette-head"><h3>答题卡</h3><span class="eyebrow">${answered} / ${total}</span></div>
              <div class="palette">${queue.map((item, i) => paletteButton(item, i)).join('')}</div>
              <div class="palette-legend">
                <span><i class="legend-dot green"></i>已答</span>
                <span><i class="legend-dot red"></i>答错</span>
                <span><i class="legend-dot gray"></i>未答</span>
                <span><i class="legend-dot current"></i>当前</span>
              </div>
            </div>
            ${session.exam
              ? '<button class="btn btn-primary" data-action="finish-exam">交卷并查看成绩</button>'
              : '<button class="btn" data-action="exit-session">退出本轮练习</button>'}
            <div class="side-note">
              <strong>快捷键</strong>
              1–8 选择选项 · Enter 提交 / 下一题 · ← → 切换题目 · F 标记题目
            </div>
          </aside>
        </div>
      </div>`;
    hydrateIcons(root);
    const fill = $('#sessionFill', root);
    if (fill && !rec.checked) {
      requestAnimationFrame(() => fill.focus({ preventScroll: true }));
    }
  }

  function renderOptions(q, rec) {
    const checked = rec.checked;
    const options = questionOptions(q);
    return `<div class="options">${options.map((opt) => {
      const picked = rec.picked.includes(opt.key);
      const correct = (q.answer || []).includes(opt.key);
      let cls = 'option-btn';
      if (checked) {
        if (correct) cls += ' correct';
        else if (picked) cls += ' wrong';
        else cls += ' dimmed';
      } else if (picked) {
        cls += ' selected';
      }
      const mark = checked
        ? (correct ? `<span class="option-mark">${icon('check')}</span>` : picked ? `<span class="option-mark">${icon('x')}</span>` : '')
        : picked ? `<span class="option-mark">${icon('check')}</span>` : '';
      return `<button class="${cls}" data-action="pick-option" data-key="${escapeAttr(opt.key)}" ${checked ? 'disabled' : ''}>
        <span class="option-key">${esc(opt.key)}</span>
        <span class="option-text">${esc(opt.text)}</span>
        ${mark}
      </button>`;
    }).join('')}</div>`;
  }

  function renderFillInput(q, rec) {
    return `<div class="fill-area">
      <textarea class="fill-input" id="sessionFill" rows="2" placeholder="在这里输入答案，按 Enter 提交" ${rec.checked ? 'disabled' : ''}>${esc(rec.text)}</textarea>
    </div>`;
  }

  function renderFeedback(q, rec) {
    const ok = rec.correct;
    const yours = q.type === 'fill' && rec.text.trim()
      ? `<div class="feedback-answer">你的答案：<b>${esc(rec.text.trim())}</b></div>`
      : '';
    return `<div class="feedback ${ok ? 'ok' : 'bad'}">
      <div class="feedback-head"><span class="feedback-icon">${icon(ok ? 'check' : 'x')}</span>${ok ? '回答正确' : '答错了'}</div>
      <div class="feedback-answer">正确答案：<b>${esc(answerShort(q))}</b></div>
      ${yours}
      ${q.explanation ? `<div class="feedback-explanation"><span class="label">解析</span>${esc(q.explanation)}</div>` : ''}
    </div>`;
  }

  function renderQuestionActions(q, rec, total) {
    const isLast = session.index >= total - 1;
    const flagLabel = rec.flagged ? '取消标记' : '标记';
    if (session.exam) {
      return `<div class="question-actions">
        <button class="btn" data-action="prev-question" ${session.index === 0 ? 'disabled' : ''}>上一题</button>
        <button class="btn btn-ghost" data-action="toggle-flag">${icon(rec.flagged ? 'starFill' : 'star')} ${flagLabel}</button>
        <span class="spacer"></span>
        <button class="btn btn-primary" data-action="next-question">${isLast ? '检查并交卷' : '下一题'}</button>
      </div>
      <div class="question-hint" style="margin-top:9px">考试中不显示答案，交卷后统一查看。</div>`;
    }
    return `<div class="question-actions">
      <button class="btn" data-action="prev-question" ${session.index === 0 ? 'disabled' : ''}>上一题</button>
      <button class="btn btn-ghost" data-action="toggle-flag">${icon(rec.flagged ? 'starFill' : 'star')} ${flagLabel}</button>
      <span class="spacer"></span>
      ${rec.checked
        ? `<button class="btn btn-primary" data-action="next-question">${isLast ? '查看结果' : '下一题'}</button>`
        : '<button class="btn btn-primary" data-action="submit-answer">提交答案</button>'}
    </div>`;
  }

  function paletteButton(q, index) {
    const rec = session.records[q.id];
    const classes = ['palette-btn'];
    if (rec.checked) classes.push(rec.correct ? 'answered' : 'wrong');
    else if (recordHasAnswer(q, rec)) classes.push('answered');
    if (index === session.index) classes.push('current');
    if (rec.flagged) classes.push('flagged');
    return `<button class="${classes.filter(Boolean).join(' ')}" data-action="jump-question" data-index="${index}" title="第 ${index + 1} 题">${index + 1}</button>`;
  }

  function pickOption(key) {
    if (!session || session.finished || session.finishing) return;
    const q = currentSessionQuestion();
    const rec = currentSessionRecord();
    if (!q || !rec || (!session.exam && rec.checked)) return;
    if (q.type === 'multiple') {
      const index = rec.picked.indexOf(key);
      if (index >= 0) rec.picked.splice(index, 1);
      else rec.picked.push(key);
    } else {
      rec.picked = [key];
    }
    renderSession();
  }

  function submitCurrentAnswer() {
    if (!session || session.finished) return;
    if (session.exam) { nextQuestion(); return; }
    const q = currentSessionQuestion();
    const rec = currentSessionRecord();
    if (!q || !rec || rec.checked) return;
    if (!recordHasAnswer(q, rec)) {
      toast(q.type === 'fill' ? '请先填写答案' : '请先选择答案', 'warn');
      return;
    }
    rec.checked = true;
    rec.correct = answerIsCorrect(q, rec);
    recordAttempt(q, rec.correct, session.mode);
    renderSession();
  }

  function nextQuestion() {
    if (!session || session.finished) return;
    const queue = sessionQueue();
    const rec = currentSessionRecord();
    if (!session.exam && rec && !rec.checked) {
      toast('先提交这道题的答案', 'warn');
      return;
    }
    if (session.index >= queue.length - 1) {
      if (session.exam) finishExam(false);
      else finishPractice();
      return;
    }
    session.index += 1;
    renderSession();
  }

  function prevQuestion() {
    if (!session || session.finished || session.index <= 0) return;
    session.index -= 1;
    renderSession();
  }

  function jumpToQuestion(index) {
    if (!session || session.finished) return;
    const queue = sessionQueue();
    if (!Number.isInteger(index) || index < 0 || index >= queue.length) return;
    session.index = index;
    renderSession();
  }

  function toggleFlag() {
    if (!session || session.finished) return;
    const rec = currentSessionRecord();
    if (!rec) return;
    rec.flagged = !rec.flagged;
    renderSession();
  }

  function finishPractice() {
    if (!session || session.finished) return;
    const queue = sessionQueue();
    const firstUnchecked = queue.findIndex((q) => !session.records[q.id].checked);
    if (firstUnchecked !== -1) {
      session.index = firstUnchecked;
      renderSession();
      toast('还有题目没提交，先把它们做完', 'warn');
      return;
    }
    let correct = 0;
    const wrongIds = [];
    queue.forEach((q) => {
      const rec = session.records[q.id];
      if (rec.correct) correct += 1;
      else wrongIds.push(q.id);
    });
    const total = queue.length;
    session.finished = true;
    session.result = {
      total,
      answered: total,
      correct,
      wrong: total - correct,
      unanswered: 0,
      accuracy: total ? correct / total : 0,
      timeSpent: Date.now() - session.startedAt,
      wrongIds,
      exam: false
    };
    stopSessionTimer();
    renderSession();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  async function finishExam(auto = false) {
    if (!session || session.finished || session.finishing) return;
    const queue = sessionQueue();
    const unanswered = queue.filter((q) => !recordHasAnswer(q, session.records[q.id])).length;

    if (!auto) {
      session.finishing = true;
      stopSessionTimer();
      const ok = await confirmDialog({
        title: unanswered ? '还有题目未作答' : '确认交卷？',
        message: unanswered
          ? `还有 ${unanswered} 道题未作答，未作答题目会按错误计入成绩。确定现在交卷吗？`
          : '交卷后不能修改答案，交卷会立即显示成绩和错题。',
        confirmText: '交卷',
        danger: unanswered > 0
      });
      session.finishing = false;
      if (!session) return;
      if (!ok) { startSessionTimer(); return; }
    }

    if (!session || session.finished) return;
    session.finishing = true;
    const answered = answeredSessionCount();
    let correct = 0;
    const wrongIds = [];
    queue.forEach((q) => {
      const rec = session.records[q.id];
      const has = recordHasAnswer(q, rec);
      const isCorrect = has && answerIsCorrect(q, rec);
      rec.checked = true;
      rec.correct = isCorrect;
      if (isCorrect) correct += 1;
      else wrongIds.push(q.id);
      if (!rec.recorded) {
        recordAttempt(q, isCorrect, 'exam');
        rec.recorded = true;
      }
    });
    const total = queue.length;
    session.finished = true;
    session.finishing = false;
    session.result = {
      total,
      answered,
      correct,
      wrong: total - correct,
      unanswered: total - answered,
      accuracy: total ? correct / total : 0,
      timeSpent: Date.now() - session.startedAt,
      wrongIds,
      exam: true
    };
    stopSessionTimer();
    renderSession();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function renderResult() {
    const r = session.result || {
      total: sessionQueue().length,
      answered: 0,
      correct: 0,
      wrong: 0,
      unanswered: 0,
      accuracy: 0,
      timeSpent: 0,
      wrongIds: [],
      exam: session.exam
    };
    const percent = Math.round(r.accuracy * 100);
    const title = r.exam
      ? (percent >= 80 ? '考得不错' : percent >= 60 ? '考试结束' : '这次有点难')
      : (percent >= 90 ? '漂亮，这一轮很稳' : percent >= 75 ? '不错，再巩固一下' : percent >= 60 ? '有进步空间' : '别急，先把错题吃透');
    const sub = r.exam
      ? `${r.answered} / ${r.total} 题已作答 · 用时 ${formatDuration(r.timeSpent)}`
      : `共 ${r.total} 题 · 用时 ${formatDuration(r.timeSpent)}`;
    const size = 177;
    const stroke = 10;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - clamp(r.accuracy * 100, 0, 100) / 100);
    const wrongQuestions = sessionQueue().filter((q) => r.wrongIds.includes(q.id));
    const review = wrongQuestions.slice(0, 12).map((q, i) => `<div class="review-item">
      <span class="no">${i + 1}</span>
      <span class="stem">${esc(q.stem)}</span>
      <span class="ans">${esc(answerShort(q))}</span>
    </div>`).join('');

    return `<div class="session-screen">
      <div class="result-wrap">
        <div class="result-card">
          <div class="result-eyebrow">${r.exam ? 'EXAM RESULT' : 'ROUND COMPLETE'}</div>
          <h1>${title}</h1>
          <p class="sub">${sub}</p>
          <div class="result-ring">
            <svg viewBox="0 0 ${size} ${size}" aria-hidden="true">
              <circle class="bg" cx="${size / 2}" cy="${size / 2}" r="${radius}"></circle>
              <circle class="fg" cx="${size / 2}" cy="${size / 2}" r="${radius}" stroke-dasharray="${circumference}" stroke-dashoffset="${offset}"></circle>
            </svg>
            <div class="result-ring-text"><strong>${percent}%</strong><span>正确率</span></div>
          </div>
          <div class="result-stats">
            <div class="result-stat green"><strong>${r.correct}</strong><span>答对</span></div>
            <div class="result-stat red"><strong>${r.wrong}</strong><span>答错</span></div>
            <div class="result-stat"><strong>${formatDuration(r.timeSpent)}</strong><span>用时</span></div>
          </div>
          <div class="result-actions">
            <button class="btn" data-action="result-home">返回首页</button>
            ${wrongQuestions.length ? '<button class="btn" data-action="result-wrong">只练错题</button>' : ''}
            <button class="btn btn-primary" data-action="result-retry">${r.exam ? '再考一次' : '再来一轮'}</button>
          </div>
          <div class="result-review">
            <div class="result-review-head"><h3>${wrongQuestions.length ? '错题回顾' : '这一轮没有错题'}</h3><span class="eyebrow">${wrongQuestions.length} 道需要再看</span></div>
            ${wrongQuestions.length ? `<div class="review-list">${review}</div>${wrongQuestions.length > 12 ? '<p class="question-hint" style="margin-top:9px">仅显示前 12 道错题，建议点「只练错题」继续。</p>' : ''}` : '<p class="question-hint">保持这个状态，可以挑战更高难度的题库了。</p>'}
          </div>
        </div>
      </div>
    </div>`;
  }

  function closeSession(force = false) {
    stopSessionTimer();
    session = null;
    const root = $('#sessionRoot');
    if (root) root.innerHTML = '';
    document.body.classList.remove('session-open');
    if (!force) render();
  }

  async function exitSession() {
    if (!session || session.finished) { closeSession(); return; }
    if (session.finishing) return;
    if (session.exam) {
      session.finishing = true;
      stopSessionTimer();
      const ok = await confirmDialog({
        title: '退出考试？',
        message: '退出后本次考试不会记录成绩，已作答内容会丢失。确定退出吗？',
        confirmText: '退出考试',
        danger: true
      });
      session.finishing = false;
      if (!session) return;
      if (!ok) { startSessionTimer(); return; }
    } else if (answeredSessionCount() > 0) {
      const ok = await confirmDialog({
        title: '退出本轮练习？',
        message: '已提交的题目会保留练习记录，未提交的答案会丢失。',
        confirmText: '退出练习'
      });
      if (!session) return;
      if (!ok) return;
    }
    closeSession();
  }

  function retrySession() {
    if (!session) return;
    const mode = session.mode;
    const label = session.label;
    const ids = session.ids.slice();
    const minutes = session.minutes;
    closeSession(true);
    if (mode === 'review') beginSession('review', { ids, label });
    else if (mode === 'exam') beginSession('exam', { ids, label, count: ids.length, minutes });
    else beginSession(mode);
  }

  function retryWrong() {
    if (!session || !session.result) return;
    const ids = session.result.wrongIds.slice();
    if (!ids.length) { toast('这一轮没有错题', 'success'); return; }
    closeSession(true);
    beginSession('review', { ids, label: '错题重练' });
  }

  function handleSessionKey(e) {
    if (!session || session.finished) return;
    const q = currentSessionQuestion();
    const rec = currentSessionRecord();
    if (!q || !rec) return;
    if (e.key === 'Escape') { e.preventDefault(); exitSession(); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); prevQuestion(); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); nextQuestion(); return; }
    if (e.key === 'f' || e.key === 'F') { e.preventDefault(); toggleFlag(); return; }
    if (e.key === 'Enter') {
      e.preventDefault();
      if (session.exam) nextQuestion();
      else if (rec.checked) nextQuestion();
      else submitCurrentAnswer();
      return;
    }
    if (!session.exam && !rec.checked && q.type !== 'fill') {
      const options = questionOptions(q);
      let index = -1;
      if (/^[1-8]$/.test(e.key)) index = Number(e.key) - 1;
      else if (/^[a-hA-H]$/.test(e.key)) index = 'abcdefgh'.indexOf(e.key.toLowerCase());
      if (index >= 0 && index < options.length) {
        e.preventDefault();
        pickOption(options[index].key);
      }
    }
  }

  function startSessionTimer() {
    stopSessionTimer();
    if (!session) return;
    const tick = () => {
      if (!session || session.finished) { stopSessionTimer(); return; }
      const el = $('#sessionTimer');
      if (!el) return;
      let text = '';
      let warning = false;
      if (session.exam) {
        const seconds = Math.max(0, Math.ceil((session.deadline - Date.now()) / 1000));
        text = formatClock(seconds);
        warning = seconds <= 60;
        if (seconds <= 0) { finishExam(true); return; }
      } else {
        text = formatClock(Math.floor((Date.now() - session.startedAt) / 1000));
      }
      const span = el.querySelector('span');
      if (span) span.textContent = text;
      el.classList.toggle('warning', warning);
    };
    tick();
    sessionTimer = setInterval(tick, 500);
  }

  function stopSessionTimer() {
    if (sessionTimer) {
      clearInterval(sessionTimer);
      sessionTimer = null;
    }
  }

  /* ---------------- 启动 ---------------- */

  function init() {
    applyTheme();
    bindEvents();
    hydrateIcons(document);
    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
