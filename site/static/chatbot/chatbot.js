'use strict';

(function () {
  const root = document.getElementById('portfolio-chatbot');
  if (!root) return;

  const toggle = document.getElementById('chat-toggle');
  const panel = document.getElementById('chat-panel');
  const close = document.getElementById('chat-close');
  const messages = document.getElementById('chat-messages');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');

  function addMessage(text, sender, link) {
    const message = document.createElement('div');
    message.className = 'chat-message chat-' + sender;

    const content = document.createElement('span');
    content.textContent = text;
    message.appendChild(content);

    if (link) {
      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.textContent = link.label;
      message.appendChild(anchor);
    }

    messages.appendChild(message);
    messages.scrollTop = messages.scrollHeight;
  }

  function getAnswer(question) {
    const q = question.toLowerCase().replace(/\s+/g, '');

    if (/안녕|반가워|hello|hi/.test(q)) {
      return {
        text: '안녕하세요! 프로젝트, 사용 기술, 연구 결과 등에 관해 질문해 주세요.'
      };
    }

    if (/데모|체험|실습/.test(q)) {
      return {
        text: 'Truncate와 BM25가 문맥을 선택하는 과정을 직접 비교할 수 있는 교육용 데모가 있습니다.',
        link: {href: root.dataset.demo, label: '문맥 압축 데모 열기'}
      };
    }

    if (/연구결과|성능|f1|토큰|실험결과/.test(q)) {
      return {
        text: '초기 LongBench 실험에서 F1은 Truncate 0.349, BM25 0.384, Compress 0.306이었습니다. 평균 입력 토큰 수는 각각 2,402개, 1,909개, 98개였습니다. 초기 실험 기준이며 전체 연구의 최종 성능은 아닙니다.',
        link: {href: root.dataset.project, label: '실험 결과 자세히 보기'}
      };
    }

    if (/hybrid|하이브리드|compress|압축|bm25|truncate/.test(q)) {
      return {
        text: 'Truncate는 앞부분을 자르고, BM25는 질문 단어와 관련된 문장을 고릅니다. Compress는 소형 언어 모델로 정보를 압축하며, Hybrid는 검색과 압축 결과를 조합하는 방식입니다.',
        link: {href: root.dataset.project, label: '연구 방법 자세히 보기'}
      };
    }

    if (/프로젝트|연구|논문|무엇을했|뭘했/.test(q)) {
      return {
        text: '주요 프로젝트는 4가지입니다. ① LLM 긴 문맥 압축 연구: 검색·압축 방법과 성능 비교 ② JCodeQuest: 코딩 문제 풀이 플랫폼 프론트엔드 개발 ③ 8-Puzzle: DFS, BFS, UCS, A* 탐색 알고리즘 비교 ④ Connect-6: 휴리스틱 기반 육목 AI 구현 및 성능 평가입니다.',
        link: {href: root.dataset.project, label: '프로젝트 소개 보기'}
      };
    }

    if (/기술|언어|python|파이썬|ollama|사용도구|개발환경/.test(q)) {
      return {
        text: '연구에는 Python, Ubuntu, Ollama, Gemma 및 Qwen 계열 모델을 활용했습니다. 포트폴리오는 Hugo, HTML, CSS, JavaScript, GitHub Pages를 이용했습니다.',
        link: {href: root.dataset.about, label: '자기소개 보기'}
      };
    }

    if (/소개|누구|관심분야|공부|학습/.test(q)) {
      return {
        text: '컴퓨터인공지능공학을 공부하며 LLM과 웹 개발, 소프트웨어 개발에 관심을 두고 있습니다.',
        link: {href: root.dataset.about, label: '자기소개 페이지 보기'}
      };
    }

    if (/깃허브|github|코드|저장소/.test(q)) {
      return {
        text: '포트폴리오의 코드와 변경 기록은 GitHub에서 확인할 수 있습니다.',
        link: {href: 'https://github.com/comts224/my-portfolio', label: 'GitHub 저장소 열기'}
      };
    }

    return {
      text: '아직 해당 질문에 대한 답변은 준비되지 않았습니다. 프로젝트, 사용 기술, 연구 결과, 데모에 관해 질문해 주세요.'
    };
  }

  function ask(question) {
    const text = question.trim();
    if (!text) return;

    addMessage(text, 'user');
    const answer = getAnswer(text);
    addMessage(answer.text, 'bot', answer.link);
  }

  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));

    if (open) input.focus();
    else toggle.focus();
  }

  toggle.addEventListener('click', () => setOpen(panel.hidden));
  close.addEventListener('click', () => setOpen(false));

  form.addEventListener('submit', event => {
    event.preventDefault();
    const question = input.value;
    input.value = '';
    ask(question);
  });

  root.querySelectorAll('[data-question]').forEach(button => {
    button.addEventListener('click', () => ask(button.dataset.question));
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) setOpen(false);
  });

  addMessage(
    '안녕하세요! 포트폴리오 안내 챗봇입니다. 프로젝트나 사용 기술에 대해 질문해 주세요. 정해진 정보에 기반해 답변하며, 생성형 AI는 아닙니다.',
    'bot'
  );
})();
