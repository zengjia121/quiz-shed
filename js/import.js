/* =========================================================
   题库解析器：JSON / CSV / TSV / 纯文本
   暴露 window.QuizImport
   ========================================================= */
(function () {
  'use strict';

  const TYPE_ALIASES = [
    { type: 'multiple', words: ['多选', '多选题', '多项选择', 'multiple', 'multi', 'checkbox'] },
    { type: 'single', words: ['单选', '单选题', '单项选择', 'single', 'choice', 'radio'] },
    { type: 'judge', words: ['判断', '判断题', '是非', '对错', 'judge', 'truefalse', 'boolean'] },
    { type: 'fill', words: ['填空', '填空题', 'fill', 'blank', 'shortanswer', '简答', '问答'] }
  ];

  const STEM_KEYS = ['题目', '题干', '问题', '题目内容', '题干内容', '内容', 'question', 'stem', 'title'];
  const ANSWER_KEYS = ['答案', '正确答案', '参考答案', 'answer', 'correct', 'correctanswer', 'key'];
  const EXPLANATION_KEYS = ['解析', '答案解析', '解释', '说明', 'explanation', 'analysis', 'note'];
  const TYPE_KEYS = ['类型', '题型', 'type'];
  const TAG_KEYS = ['标签', '分类', '知识点', 'tags', 'tag', 'category'];
  const DIFFICULTY_KEYS = ['难度', 'difficulty', 'level'];
  const OPTIONS_TEXT_KEYS = ['选项', 'options', 'choices'];

  function cleanText(value) {
    return String(value == null ? '' : value)
      .replace(/^\uFEFF/, '')
      .replace(/\u00a0/g, ' ')
      .replace(/\r\n?/g, '\n')
      .trim();
  }

  function normalizeHeader(value) {
    return cleanText(value)
      .toLowerCase()
      .replace(/[\s*＊]/g, '')
      .replace(/[（(][^）)]*[）)]/g, '')
      .replace(/[:：]/g, '');
  }

  function normalizeType(value) {
    const raw = cleanText(value).toLowerCase();
    if (!raw) return '';
    for (const item of TYPE_ALIASES) {
      if (item.words.some((word) => raw.includes(word))) return item.type;
    }
    return '';
  }

  function normalizeDifficulty(value) {
    const raw = cleanText(value);
    if (!raw) return 2;
    if (/简单|容易|基础|easy/i.test(raw)) return 1;
    if (/困难|很难|较难|hard|difficult/i.test(raw)) return 3;
    if (/中等|一般|普通|medium|normal/i.test(raw)) return 2;
    const n = Number(raw.replace(/[^\d.]/g, ''));
    if (n >= 3) return 3;
    if (n > 0 && n < 2) return 1;
    return 2;
  }

  function normalizeTags(value) {
    let arr = [];
    if (Array.isArray(value)) arr = value;
    else if (value != null && String(value).trim()) arr = String(value).split(/[,，;；]/);
    const seen = new Set();
    const out = [];
    for (let tag of arr) {
      tag = cleanText(tag).replace(/^#+/, '').trim();
      if (!tag || seen.has(tag)) continue;
      seen.add(tag);
      out.push(tag);
      if (out.length >= 8) break;
    }
    return out;
  }

  function stripOptionPrefix(text) {
    return cleanText(text)
      .replace(/^[A-Ha-h]\s*[.．、:：)）]\s*/, '')
      .replace(/^[（(]\s*[A-Ha-h]\s*[)）]\s*/, '')
      .trim();
  }

  function normalizeOptions(value) {
    let list = [];
    if (value == null) return [];
    if (Array.isArray(value)) {
      list = value;
    } else if (typeof value === 'object') {
      list = Object.keys(value)
        .sort((a, b) => String(a).localeCompare(String(b), 'en'))
        .map((key) => ({ key: String(key).toUpperCase(), text: value[key] }));
    } else if (typeof value === 'string') {
      const raw = cleanText(value);
      if (!raw) return [];
      let parts = raw.split(/\n|;|；/).map((s) => s.trim()).filter(Boolean);
      if (parts.length === 1) parts = raw.split(/\s*[|｜]\s*/).map((s) => s.trim()).filter(Boolean);
      list = parts;
    }

    const out = [];
    const used = new Set();
    let autoIndex = 0;
    for (const item of list) {
      let key = '';
      let text = '';
      if (item && typeof item === 'object') {
        key = cleanText(item.key || item.label || item.value || '').toUpperCase();
        text = cleanText(item.text || item.content || item.title || item.value || '');
        if (!text && item.value && typeof item.value === 'string') text = cleanText(item.value);
      } else {
        text = cleanText(item);
        const m = text.match(/^([A-Ha-h])\s*[.．、:：)）]\s*(.+)$/);
        if (m) {
          key = m[1].toUpperCase();
          text = cleanText(m[2]);
        }
      }
      if (!text) continue;
      if (!key || used.has(key)) {
        while (used.has(String.fromCharCode(65 + autoIndex)) && autoIndex < 8) autoIndex += 1;
        key = String.fromCharCode(65 + autoIndex);
        autoIndex += 1;
      }
      if (!/^[A-H]$/.test(key) || used.has(key)) continue;
      used.add(key);
      out.push({ key, text: stripOptionPrefix(text) });
      if (out.length >= 8) break;
    }
    return out;
  }

  function normalizeAnswerText(value) {
    return cleanText(value)
      .replace(/^\s*(?:答案|正确答案|参考答案|answer)\s*[:：]?\s*/i, '')
      .replace(/^[（(]\s*([A-Ha-h])\s*[)）]$/, '$1')
      .trim();
  }

  function judgeToken(value) {
    const raw = normalizeAnswerText(value)
      .replace(/[\s。.!！]/g, '')
      .toLowerCase();
    if (/^(正确|对|是|真|√|✓|true|t|yes|y)$/.test(raw)) return 'T';
    if (/^(错误|错|否|假|×|✕|x|false|f|no|n)$/.test(raw)) return 'F';
    return '';
  }

  function isJudgeAnswer(value) {
    if (Array.isArray(value)) return value.length === 1 && !!judgeToken(value[0]);
    return !!judgeToken(value);
  }

  function splitAlternatives(value) {
    if (Array.isArray(value)) {
      return value.map((item) => cleanText(item)).filter(Boolean);
    }
    const raw = normalizeAnswerText(value);
    if (!raw) return [];
    return raw.split(/[|｜]/).map((s) => cleanText(s)).filter(Boolean);
  }

  function optionTextKey(text) {
    return cleanText(text)
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[.。、,，;；:：!?！？'"“”‘’]/g, '');
  }

  function answerToKeys(value, options) {
    const keys = options.map((o) => o.key);
    const keySet = new Set(keys);
    const texts = new Map(options.map((o) => [optionTextKey(o.text), o.key]));
    const found = [];
    const add = (key) => {
      if (keySet.has(key) && !found.includes(key)) found.push(key);
    };

    const consider = (item) => {
      const raw = cleanText(item);
      if (!raw) return;
      const byText = texts.get(optionTextKey(raw));
      if (byText) { add(byText); return; }
      const normalized = normalizeAnswerText(raw).toUpperCase();
      if (/^[A-H](?:\s*[,，、/;；|｜]?\s*[A-H])*$/.test(normalized)) {
        normalized.replace(/[^A-H]/g, '').split('').forEach(add);
        return;
      }
      const exact = normalized.match(/^([A-H])(?:\s*[.．、:：)）]|\s|$)/);
      if (exact) add(exact[1]);
    };

    if (Array.isArray(value)) value.forEach(consider);
    else consider(value);

    return keys.filter((key) => found.includes(key));
  }

  function normalizeRaw(input, index) {
    const label = index == null ? '' : `第 ${index + 1} 条：`;
    if (!input || typeof input !== 'object') throw new Error(`${label}题目格式不正确`);

    let stem = cleanText(input.stem || input.question || input.title || input.题干 || input.题目);
    if (!stem) throw new Error(`${label}缺少题干`);

    const typeHint = normalizeType(input.type || input.题型 || input.类型);
    let options = normalizeOptions(input.options != null ? input.options : (input.选项 != null ? input.选项 : input.choices));
    let answerRaw = input.answer != null ? input.answer
      : (input.答案 != null ? input.答案
        : (input.correct != null ? input.correct
          : (input.correctAnswer != null ? input.correctAnswer : input.key)));

    if (answerRaw == null || (typeof answerRaw === 'string' && !cleanText(answerRaw))) {
      throw new Error(`${label}缺少答案`);
    }

    const judge = judgeToken(Array.isArray(answerRaw) ? answerRaw[0] : answerRaw);
    let type = typeHint;

    if (!type) {
      if (options.length >= 2) {
        const keys = answerToKeys(answerRaw, options);
        type = keys.length > 1 ? 'multiple' : 'single';
      } else if (judge) {
        type = 'judge';
      } else {
        type = 'fill';
      }
    }

    if (type === 'judge') {
      if (!judge) throw new Error(`${label}判断题答案应填写“正确 / 错误”`);
      return {
        stem,
        type: 'judge',
        options: [{ key: 'T', text: '正确' }, { key: 'F', text: '错误' }],
        answer: [judge],
        explanation: cleanText(input.explanation || input.解析 || input.答案解析 || input.analysis),
        tags: normalizeTags(input.tags || input.标签 || input.分类),
        difficulty: normalizeDifficulty(input.difficulty || input.难度)
      };
    }

    if (type === 'fill') {
      const alternatives = splitAlternatives(answerRaw);
      if (!alternatives.length) throw new Error(`${label}缺少参考答案`);
      return {
        stem,
        type: 'fill',
        options: [],
        answer: alternatives,
        explanation: cleanText(input.explanation || input.解析 || input.答案解析 || input.analysis),
        tags: normalizeTags(input.tags || input.标签 || input.分类),
        difficulty: normalizeDifficulty(input.difficulty || input.难度)
      };
    }

    if (options.length < 2) throw new Error(`${label}选择题至少需要两个选项`);
    options = options.sort((a, b) => a.key.localeCompare(b.key));
    const keys = answerToKeys(answerRaw, options);
    if (!keys.length) {
      const shown = Array.isArray(answerRaw) ? answerRaw.join('、') : cleanText(answerRaw);
      throw new Error(`${label}答案“${shown}”无法对应到选项 A–${options[options.length - 1].key}`);
    }
    if (typeHint === 'single' && keys.length > 1) {
      throw new Error(`${label}单选题只能有一个答案`);
    }
    const finalType = typeHint === 'multiple' || (!typeHint && keys.length > 1) ? 'multiple' : (typeHint === 'single' ? 'single' : 'single');
    if (finalType === 'single' && keys.length > 1) throw new Error(`${label}单选题只能有一个答案`);

    return {
      stem,
      type: finalType,
      options,
      answer: keys,
      explanation: cleanText(input.explanation || input.解析 || input.答案解析 || input.analysis),
      tags: normalizeTags(input.tags || input.标签 || input.分类),
      difficulty: normalizeDifficulty(input.difficulty || input.难度)
    };
  }

  /* ---------------- JSON ---------------- */

  function pick(obj, keys) {
    for (const key of keys) {
      if (obj[key] != null && obj[key] !== '') return obj[key];
    }
    return undefined;
  }

  function parseJson(text) {
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      return {
        format: 'JSON',
        questions: [],
        errors: [{ message: `JSON 格式有误：${err.message}` }]
      };
    }
    let list;
    if (Array.isArray(data)) list = data;
    else if (data && Array.isArray(data.questions)) list = data.questions;
    else if (data && Array.isArray(data.data)) list = data.data;
    else if (data && typeof data === 'object') list = [data];
    else list = [];

    if (!list.length) {
      return { format: 'JSON', questions: [], errors: [{ message: '没有找到题目数组' }] };
    }

    const questions = [];
    const errors = [];
    list.forEach((item, i) => {
      try {
        if (!item || typeof item !== 'object') throw new Error('不是有效的题目对象');
        const input = {
          stem: pick(item, STEM_KEYS),
          type: pick(item, TYPE_KEYS),
          options: pick(item, ['options', '选项', 'choices']),
          answer: pick(item, ANSWER_KEYS),
          explanation: pick(item, EXPLANATION_KEYS),
          tags: pick(item, TAG_KEYS),
          difficulty: pick(item, DIFFICULTY_KEYS)
        };
        questions.push(normalizeRaw(input, i));
      } catch (err) {
        errors.push({ row: i + 1, message: err.message });
      }
    });
    return { format: 'JSON', questions, errors };
  }

  /* ---------------- CSV / TSV ---------------- */

  function countDelimiter(line, delimiter) {
    let count = 0;
    let quoted = false;
    for (let i = 0; i < line.length; i += 1) {
      const ch = line[i];
      if (ch === '"') quoted = !quoted;
      else if (ch === delimiter && !quoted) count += 1;
    }
    return count;
  }

  function detectDelimiter(text) {
    const line = text.split('\n').find((item) => item.trim()) || '';
    const candidates = [
      { delimiter: '\t', count: countDelimiter(line, '\t') },
      { delimiter: ',', count: countDelimiter(line, ',') },
      { delimiter: ';', count: countDelimiter(line, ';') }
    ].sort((a, b) => b.count - a.count);
    return candidates[0].count > 0 ? candidates[0].delimiter : '';
  }

  function parseDelimitedRows(text, delimiter) {
    const rows = [];
    let row = [];
    let field = '';
    let quoted = false;
    for (let i = 0; i < text.length; i += 1) {
      const ch = text[i];
      if (quoted) {
        if (ch === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
        else if (ch === '"') quoted = false;
        else field += ch;
      } else if (ch === '"') {
        quoted = true;
      } else if (ch === delimiter) {
        row.push(field);
        field = '';
      } else if (ch === '\n') {
        row.push(field);
        rows.push(row);
        row = [];
        field = '';
      } else if (ch !== '\r') {
        field += ch;
      }
    }
    row.push(field);
    rows.push(row);
    return rows.filter((cells) => cells.some((cell) => cleanText(cell)));
  }

  function headerIndex(row, aliases) {
    return row.findIndex((cell) => {
      const h = normalizeHeader(cell);
      return aliases.some((alias) => h === normalizeHeader(alias));
    });
  }

  function analyzeHeaders(row) {
    const result = {
      stem: headerIndex(row, STEM_KEYS),
      answer: headerIndex(row, ANSWER_KEYS),
      explanation: headerIndex(row, EXPLANATION_KEYS),
      type: headerIndex(row, TYPE_KEYS),
      tags: headerIndex(row, TAG_KEYS),
      difficulty: headerIndex(row, DIFFICULTY_KEYS),
      optionsText: headerIndex(row, OPTIONS_TEXT_KEYS),
      options: {}
    };
    row.forEach((cell, i) => {
      const h = normalizeHeader(cell);
      if (!h) return;
      const m = h.match(/^(?:选项|option)?([a-h])$/) || h.match(/^([a-h])选项$/);
      if (m && !result.options[m[1].toUpperCase()]) {
        result.options[m[1].toUpperCase()] = i;
      }
    });
    return result;
  }

  function cell(row, index) {
    return index >= 0 && index < row.length ? cleanText(row[index]) : '';
  }

  function hasHeader(row) {
    const h = analyzeHeaders(row);
    return h.stem >= 0 || h.answer >= 0;
  }

  function rowToInput(row, headers) {
    const input = {
      stem: cell(row, headers.stem),
      type: cell(row, headers.type),
      answer: cell(row, headers.answer),
      explanation: cell(row, headers.explanation),
      tags: cell(row, headers.tags),
      difficulty: cell(row, headers.difficulty)
    };
    const optionEntries = Object.keys(headers.options)
      .sort()
      .map((key) => ({ key, text: cell(row, headers.options[key]) }))
      .filter((item) => item.text);
    if (optionEntries.length >= 2) {
      input.options = optionEntries;
    } else if (headers.optionsText >= 0) {
      input.options = cell(row, headers.optionsText);
    } else if (optionEntries.length === 1) {
      input.options = optionEntries;
    }
    return input;
  }

  function looksLikeAnswerCell(value) {
    const raw = normalizeAnswerText(value).toUpperCase().replace(/\s+/g, '');
    if (!raw) return false;
    if (/^[A-H](?:[,，、/;；]?[A-H])*$/.test(raw)) return true;
    return /^(正确|错误|对|错|是|否|TRUE|FALSE|T|F|√|×|✓|✕)$/.test(raw);
  }

  function guessAnswerColumn(rows, width) {
    const sample = rows.slice(0, 30);
    let best = -1;
    let bestRatio = 0;
    for (let col = 1; col < width; col += 1) {
      const values = sample.map((row) => cleanText(row[col] || '')).filter(Boolean);
      if (!values.length) continue;
      const ratio = values.filter(looksLikeAnswerCell).length / values.length;
      if (ratio >= 0.6 && ratio >= bestRatio) {
        best = col;
        bestRatio = ratio;
      }
    }
    return best;
  }

  function noHeaderLayout(rows) {
    const width = Math.max(...rows.map((row) => row.length));
    if (width < 2) return null;
    let answer = guessAnswerColumn(rows, width);
    if (answer < 0) answer = width - 1;
    const optionCols = [];
    for (let col = 1; col < answer; col += 1) optionCols.push(col);
    if (!optionCols.length) return null;
    const options = {};
    optionCols.slice(0, 8).forEach((col, index) => {
      options[String.fromCharCode(65 + index)] = col;
    });
    return {
      stem: 0,
      options,
      answer,
      explanation: answer + 1 < width ? answer + 1 : -1,
      type: -1,
      tags: -1,
      difficulty: -1,
      optionsText: -1
    };
  }

  function parseDelimited(text, forcedDelimiter) {
    const delimiter = forcedDelimiter || detectDelimiter(text);
    if (!delimiter) {
      return { format: '表格', questions: [], errors: [{ message: '没有识别到分隔符，请使用逗号、制表符或分号' }] };
    }
    const rows = parseDelimitedRows(text, delimiter);
    if (!rows.length) return { format: '表格', questions: [], errors: [{ message: '没有读取到内容' }] };

    const first = rows[0];
    let headers;
    let dataRows;
    let lineOffset;
    if (hasHeader(first)) {
      headers = analyzeHeaders(first);
      dataRows = rows.slice(1);
      lineOffset = 2;
      if (headers.stem < 0) {
        return { format: '表格', questions: [], errors: [{ message: '缺少“题目 / 题干”列' }] };
      }
      if (headers.answer < 0) {
        return { format: '表格', questions: [], errors: [{ message: '缺少“答案”列' }] };
      }
    } else {
      // 无表头：按「题目, A, B, C, D, 答案, 解析」的常见布局推断答案列
      headers = noHeaderLayout(rows);
      if (!headers) {
        return {
          format: '表格',
          questions: [],
          errors: [{ message: '没有检测到表头。请在第一行加入：题目, 选项A, 选项B, 答案, 解析' }]
        };
      }
      dataRows = rows;
      lineOffset = 1;
    }

    const questions = [];
    const errors = [];
    dataRows.forEach((row, i) => {
      if (!row.some((c) => cleanText(c))) return;
      try {
        const input = rowToInput(row, headers);
        questions.push(normalizeRaw(input, i));
      } catch (err) {
        errors.push({ row: i + lineOffset, message: err.message.replace(/^第 \d+ 条：/, '') });
      }
    });
    return { format: delimiter === '\t' ? 'TSV / Excel 粘贴' : 'CSV', questions, errors };
  }

  /* ---------------- 纯文本 ---------------- */

  const RE_ANSWER = /^\s*(?:【?\s*答案\s*】?|正确答案|参考答案|answer)\s*[:：]?\s*(.*)$/i;
  const RE_EXPLANATION = /^\s*(?:【?\s*解析\s*】?|答案解析|解释|说明|explanation)\s*[:：]?\s*(.*)$/i;
  const RE_TAGS = /^\s*(?:标签|分类|知识点|tags?)\s*[:：]\s*(.*)$/i;
  const RE_DIFFICULTY = /^\s*(?:难度|difficulty)\s*[:：]\s*(.*)$/i;
  const RE_TYPE = /^\s*(?:类型|题型|type)\s*[:：]\s*(.*)$/i;
  const RE_OPTION = /^\s*([A-Ha-h])\s*[.．、:：)）]\s*(.*)$/;
  const RE_NUMBER = /^\s*(?:\d{1,3}\s*[.．、)）]|[（(]\s*\d{1,3}\s*[)）])\s*/;

  function splitTextBlocks(text) {
    let blocks = text.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean);
    const expanded = [];
    for (const block of blocks) {
      const lines = block.split('\n');
      const numbered = lines.filter((line) => RE_NUMBER.test(line)).length;
      if (numbered <= 1) {
        expanded.push(lines);
        continue;
      }
      let current = [];
      const chunks = [];
      let hasAnswer = false;
      for (const line of lines) {
        if (RE_NUMBER.test(line) && current.length && hasAnswer) {
          chunks.push(current);
          current = [];
          hasAnswer = false;
        }
        current.push(line);
        if (RE_ANSWER.test(line)) hasAnswer = true;
      }
      if (current.length) chunks.push(current);
      chunks.forEach((chunk) => expanded.push(chunk));
    }

    // 没有任何空行时，按题号拆分
    if (expanded.length === 1 && expanded[0].filter((line) => RE_NUMBER.test(line)).length > 1) {
      const lines = expanded[0];
      const chunks = [];
      let current = [];
      let hasAnswer = false;
      for (const line of lines) {
        if (RE_NUMBER.test(line) && current.length && hasAnswer) {
          chunks.push(current);
          current = [];
          hasAnswer = false;
        }
        current.push(line);
        if (RE_ANSWER.test(line)) hasAnswer = true;
      }
      if (current.length) chunks.push(current);
      return chunks;
    }
    return expanded;
  }

  function parseTextBlock(lines, index) {
    const label = `第 ${index + 1} 题：`;
    const cleaned = lines.map((line) => line.replace(/\s+$/, '')).filter((line, i) => i === 0 || line.trim() !== '');
    if (!cleaned.length) throw new Error(`${label}内容为空`);

    cleaned[0] = cleaned[0].replace(RE_NUMBER, '').trim();
    const stemLines = [];
    const options = [];
    let answerRaw = '';
    const explanationLines = [];
    const tags = [];
    let difficulty;
    let typeHint = '';
    let phase = 'stem';
    let lastOption = null;

    const typeMarker = cleaned[0].match(/[【\[（(]\s*(单选题?|多选题?|判断题?|填空题?|简答题?)\s*[】\]）)]/);
    if (typeMarker) {
      typeHint = normalizeType(typeMarker[1]);
      cleaned[0] = cleaned[0].replace(typeMarker[0], '').trim();
    }

    for (const line of cleaned) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      let m;
      if ((m = trimmed.match(RE_ANSWER))) {
        answerRaw = cleanText(m[1]);
        phase = 'explanation';
        lastOption = null;
        continue;
      }
      if ((m = trimmed.match(RE_EXPLANATION))) {
        phase = 'explanation';
        if (m[1]) explanationLines.push(cleanText(m[1]));
        lastOption = null;
        continue;
      }
      if ((m = trimmed.match(RE_TAGS))) {
        normalizeTags(m[1]).forEach((tag) => tags.push(tag));
        continue;
      }
      if ((m = trimmed.match(RE_DIFFICULTY))) {
        difficulty = m[1];
        continue;
      }
      if ((m = trimmed.match(RE_TYPE))) {
        typeHint = normalizeType(m[1]) || typeHint;
        continue;
      }
      if (phase !== 'explanation' && (m = trimmed.match(RE_OPTION))) {
        phase = 'options';
        lastOption = { key: m[1].toUpperCase(), text: cleanText(m[2]) };
        options.push(lastOption);
        continue;
      }
      if (phase === 'options' && lastOption && !RE_NUMBER.test(trimmed)) {
        lastOption.text = `${lastOption.text}\n${trimmed}`.trim();
        continue;
      }
      if (phase === 'explanation') {
        explanationLines.push(trimmed);
      } else {
        stemLines.push(trimmed);
      }
    }

    const stem = cleanText(stemLines.join('\n'));
    if (!stem) throw new Error(`${label}缺少题干`);
    if (!answerRaw) throw new Error(`${label}缺少“答案：”一行`);

    return normalizeRaw({
      stem,
      type: typeHint,
      options,
      answer: answerRaw,
      explanation: explanationLines.join('\n'),
      tags,
      difficulty
    }, index);
  }

  function parseText(text) {
    const blocks = splitTextBlocks(text);
    if (!blocks.length) {
      return { format: '文本', questions: [], errors: [{ message: '没有读取到题目' }] };
    }
    const questions = [];
    const errors = [];
    blocks.forEach((lines, i) => {
      try {
        questions.push(parseTextBlock(lines, i));
      } catch (err) {
        errors.push({ row: i + 1, message: err.message.replace(/^第 \d+ 题：/, '') });
      }
    });
    return { format: '文本', questions, errors };
  }

  /* ---------------- 入口 ---------------- */

  function parseImportText(text, filename) {
    const raw = cleanText(text);
    if (!raw) return { format: '', questions: [], errors: [{ message: '请先粘贴题库内容或选择文件' }] };
    const lower = String(filename || '').toLowerCase();

    try {
      if (lower.endsWith('.json') || /^[\[{]/.test(raw)) {
        return parseJson(raw);
      }
      if (lower.endsWith('.csv') || lower.endsWith('.tsv')) {
        return parseDelimited(raw, lower.endsWith('.tsv') ? '\t' : '');
      }
      const firstLine = raw.split('\n')[0] || '';
      const looksLikeTable = firstLine.includes('\t') ||
        (firstLine.split(',').length >= 2 && /题目|题干|答案|question|answer/i.test(firstLine));
      if (looksLikeTable) {
        const result = parseDelimited(raw);
        if (result.questions.length || result.format === 'CSV') return result;
      }
      return parseText(raw);
    } catch (err) {
      return { format: '', questions: [], errors: [{ message: `解析失败：${err.message}` }] };
    }
  }

  const SAMPLE_QUESTIONS = [
    {
      stem: '中国的首都是哪座城市？',
      type: 'single',
      options: ['北京', '上海', '广州', '深圳'],
      answer: 'A',
      explanation: '北京是中华人民共和国的首都，也是全国的政治、文化中心。',
      tags: ['地理', '常识'],
      difficulty: 1
    },
    {
      stem: '光合作用主要发生在植物细胞的哪个结构中？',
      type: 'single',
      options: ['细胞核', '叶绿体', '线粒体', '液泡'],
      answer: 'B',
      explanation: '叶绿体含有叶绿素，是绿色植物进行光合作用的场所。',
      tags: ['生物'],
      difficulty: 2
    },
    {
      stem: '下列属于可再生能源的是？',
      type: 'multiple',
      options: ['太阳能', '风能', '煤炭', '水能'],
      answer: ['A', 'B', 'D'],
      explanation: '太阳能、风能和水能都可以自然补充；煤炭属于不可再生能源。',
      tags: ['地理', '科学'],
      difficulty: 2
    },
    {
      stem: '声音可以在真空中传播。',
      type: 'judge',
      answer: '错误',
      explanation: '声音的传播需要介质，真空不能传声。',
      tags: ['物理'],
      difficulty: 1
    },
    {
      stem: '水的化学式是______。',
      type: 'fill',
      answer: 'H2O|H₂O',
      explanation: '一个水分子由两个氢原子和一个氧原子构成。',
      tags: ['化学'],
      difficulty: 1
    },
    {
      stem: 'JavaScript 中用于声明常量的关键字是？',
      type: 'single',
      options: ['var', 'let', 'const', 'static'],
      answer: 'C',
      explanation: 'const 声明一个块级作用域的常量，声明后不能重新赋值。',
      tags: ['编程', 'JavaScript'],
      difficulty: 1
    },
    {
      stem: '下列 HTTP 状态码中，表示请求成功的有？',
      type: 'multiple',
      options: ['200 OK', '201 Created', '301 Moved Permanently', '404 Not Found'],
      answer: ['A', 'B'],
      explanation: '2xx 表示成功；301 是永久重定向，404 表示资源不存在。',
      tags: ['编程', '网络'],
      difficulty: 2
    },
    {
      stem: '在 CSS 盒模型中，margin 表示外边距。',
      type: 'judge',
      answer: '正确',
      explanation: 'margin 是外边距，padding 是内边距，border 是边框。',
      tags: ['编程', 'CSS'],
      difficulty: 1
    },
    {
      stem: '我国现行宪法是______年颁布的。',
      type: 'fill',
      answer: '1982',
      explanation: '现行宪法于 1982 年 12 月 4 日由第五届全国人民代表大会第五次会议通过。',
      tags: ['历史', '法律'],
      difficulty: 2
    },
    {
      stem: '一年中，北半球白昼最长的节气是？',
      type: 'single',
      options: ['春分', '夏至', '秋分', '冬至'],
      answer: 'B',
      explanation: '夏至日太阳直射北回归线，北半球白昼达到一年中最长。',
      tags: ['地理', '常识'],
      difficulty: 1
    }
  ];

  window.QuizImport = {
    parse: parseImportText,
    sample: SAMPLE_QUESTIONS,
    normalizeRaw
  };
})();
