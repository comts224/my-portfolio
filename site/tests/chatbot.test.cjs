'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const chatbotPath = path.join(__dirname, '../static/chatbot/chatbot.js');
const chatbotCode = fs.readFileSync(chatbotPath, 'utf8');

function createElement() {
  return {
    children: [],
    listeners: {},
    dataset: {},
    hidden: false,
    value: '',
    textContent: '',
    className: '',
    scrollTop: 0,
    scrollHeight: 0,
    appendChild(child) {
      this.children.push(child);
    },
    addEventListener(type, callback) {
      this.listeners[type] = callback;
    },
    setAttribute(name, value) {
      this[name] = value;
    },
    focus() {}
  };
}

function setupChatbot() {
  const ids = [
    'portfolio-chatbot',
    'chat-toggle',
    'chat-panel',
    'chat-close',
    'chat-messages',
    'chat-form',
    'chat-input'
  ];

  const elements = Object.fromEntries(
    ids.map(id => [id, createElement()])
  );

  const root = elements['portfolio-chatbot'];
  root.dataset = {
    about: '/my-portfolio/about/',
    project: '/my-portfolio/projects/llm-context-compression/',
    demo: '/my-portfolio/demo/',
    jcodequest: '/my-portfolio/projects/jcodequest/',
    puzzle: '/my-portfolio/projects/8-puzzle/',
    connect6: '/my-portfolio/projects/connect-6-ai/'
  };

  const suggestion = createElement();
  suggestion.dataset.question = '어떤 프로젝트를 했나요?';
  root.querySelectorAll = () => [suggestion];

  elements['chat-panel'].hidden = true;

  const document = {
    getElementById(id) {
      return elements[id];
    },
    createElement,
    addEventListener() {}
  };

  vm.runInNewContext(chatbotCode, { document });

  function ask(question) {
    elements['chat-input'].value = question;
    elements['chat-form'].listeners.submit({
      preventDefault() {}
    });
  }

  const messages = elements['chat-messages'].children;

  function lastMessage() {
    return messages[messages.length - 1];
  }

  return { elements, suggestion, messages, ask, lastMessage };
}

test('Chatbot: 첫 안내 메시지를 표시한다', () => {
  const chat = setupChatbot();

  assert.equal(chat.messages.length, 1);
  assert.match(
    chat.lastMessage().children[0].textContent,
    /생성형 AI는 아닙니다/
  );
});

test('Chatbot: 프로젝트 질문에 연구 소개와 링크를 제공한다', () => {
  const chat = setupChatbot();

  chat.ask('어떤 프로젝트를 했나요?');

  assert.match(
    chat.lastMessage().children[0].textContent,
    /LLM 긴 문맥 압축 연구/
  );

  assert.equal(
    chat.lastMessage().children[1].href,
    '/my-portfolio/projects/llm-context-compression/'
  );
});

test('Chatbot: 연구 결과 질문에 정확한 F1 수치를 제공한다', () => {
  const chat = setupChatbot();

  chat.ask('연구 결과는 어떤가요?');

  const answer = chat.lastMessage().children[0].textContent;

  assert.match(answer, /Truncate 0\.349/);
  assert.match(answer, /BM25 0\.384/);
  assert.match(answer, /Compress 0\.306/);
});

test('Chatbot: 모르는 질문에 기본 안내를 반환한다', () => {
  const chat = setupChatbot();

  chat.ask('오늘 점심 메뉴는?');

  assert.match(
    chat.lastMessage().children[0].textContent,
    /아직 해당 질문에 대한 답변은 준비되지 않았습니다/
  );
});

test('Chatbot: HTML 입력을 텍스트로 처리한다', () => {
  const chat = setupChatbot();
  const maliciousInput = '<img src=x onerror=alert(1)>';

  chat.ask(maliciousInput);

  const userMessage = chat.messages[chat.messages.length - 2];

  assert.equal(
    userMessage.children[0].textContent,
    maliciousInput
  );

  assert.equal(userMessage.children.length, 1);
});

test('Chatbot: JCodeQuest 질문에 전용 답변과 링크를 제공한다', () => {
  const chat = setupChatbot();
  chat.ask('JCodeQuest 알려줘');
  assert.match(chat.lastMessage().children[0].textContent, /Ranking/);
  assert.equal(chat.lastMessage().children[1].href, '/my-portfolio/projects/jcodequest/');
});

test('Chatbot: 8-Puzzle 질문에 전용 답변과 링크를 제공한다', () => {
  const chat = setupChatbot();
  chat.ask('8-Puzzle 설명해줘');
  assert.match(chat.lastMessage().children[0].textContent, /Manhattan Distance/);
  assert.equal(chat.lastMessage().children[1].href, '/my-portfolio/projects/8-puzzle/');
});

test('Chatbot: Connect-6 질문에 전용 답변과 링크를 제공한다', () => {
  const chat = setupChatbot();
  chat.ask('육목 프로젝트 알려줘');
  assert.match(chat.lastMessage().children[0].textContent, /78.6%/);
  assert.equal(chat.lastMessage().children[1].href, '/my-portfolio/projects/connect-6-ai/');
});