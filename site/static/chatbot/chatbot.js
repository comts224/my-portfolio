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
      const links = Array.isArray(link) ? link : [link];
      links.forEach(item => {
        const anchor = document.createElement('a');
        anchor.href = item.href;
        anchor.textContent = item.label;
        message.appendChild(anchor);
      });
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

    if (/jcodequest|제이코드퀘스트|랭킹|마이페이지|userprofile/.test(q)) {
      return {
        text: 'JCodeQuest는 코딩 문제 풀이 플랫폼 팀 프로젝트입니다. Ranking, MyPage, UserProfile 등 프론트엔드 페이지 개발을 담당했으며 Docker Compose와 Supabase 설정 문제를 해결한 경험이 있습니다.',
        link: {href: root.dataset.jcodequest, label: 'JCodeQuest 자세히 보기'}
      };
    }

    if (/8-puzzle|8puzzle|퍼즐|탐색알고리즘/.test(q)) {
      return {
        text: '8-Puzzle 프로젝트에서는 DFS, BFS, UCS, A*, RAND 탐색을 구현하고 Misplaced Tiles와 Manhattan Distance 휴리스틱을 사용해 탐색 성능을 비교했습니다.',
        link: {href: root.dataset.puzzle, label: '8-Puzzle 자세히 보기'}
      };
    }

    if (/connect-?6|육목|휴리스틱기반게임/.test(q)) {
      return {
        text: 'Connect-6 프로젝트에서는 공격·수비 휴리스틱과 1-ply Greedy 전략을 사용했습니다. 기존 돌 주변 반경 2칸을 탐색했고, 공식 리더보드에서 14전 11승 3패(승률 78.6%)를 기록했습니다.',
        link: {href: root.dataset.connect6, label: 'Connect-6 자세히 보기'}
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
        text: '주요 프로젝트는 4개입니다. 아래 번호를 누르면 해당 프로젝트로 이동합니다.',
        link: [
          {href: root.dataset.project, label: '1. LLM 긴 문맥 압축 연구'},
          {href: root.dataset.jcodequest, label: '2. JCodeQuest'},
          {href: root.dataset.puzzle, label: '3. 8-Puzzle'},
          {href: root.dataset.connect6, label: '4. Connect-6 AI'},
          {href: root.dataset.projects, label: '전체 프로젝트 목록 보기'}
        ]
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
