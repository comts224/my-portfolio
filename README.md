# My Portfolio

컴퓨터인공지능공학을 공부하며 학습 내용과 프로젝트 경험을 정리하기 위해 제작한 개인 포트폴리오 웹사이트입니다.

## 웹사이트

- **배포 주소:** https://comts224.github.io/my-portfolio/
- **GitHub 저장소:** https://github.com/comts224/my-portfolio

## 프로젝트 소개

Hugo 정적 사이트 생성기와 Hugo Mana 테마를 활용하여 개인 포트폴리오를 제작했습니다.

Git과 GitHub로 변경 이력을 관리하고, GitHub Actions와 GitHub Pages를 이용해 웹사이트를 자동으로 배포합니다.

## 사용 기술

- Hugo 0.167.0
- Hugo Mana Theme
- Markdown
- Git 및 GitHub
- GitHub Actions
- GitHub Pages

## 주요 페이지

| 페이지 | 설명 |
|---|---|
| Home | 포트폴리오 메인 화면 |
| About | 자기소개, 관심 분야, 학습 목표 |
| Projects | 프로젝트 및 연구 경험 소개 |

## 프로젝트 경험

### LLM 긴 문맥 압축 연구

대규모 언어 모델이 긴 문서를 처리할 때 입력 토큰 수를 줄이는 방법을 실험했습니다.

LongBench와 HotpotQA 데이터셋을 활용해 문맥 처리 방법별 답변 정확도와 토큰 효율성을 비교했습니다.

## 주요 기능

- 반응형 웹 디자인
- Home, About, Projects 메뉴 이동
- 라이트 모드 및 다크 모드 전환
- 게시글 검색과 필터 기능

## 실행 환경 및 프로젝트 구조

이 프로젝트는 Hugo 정적 사이트 생성기를 사용하며, GitHub Actions에서 자동으로 빌드하고 배포합니다.

주요 실행 환경은 다음과 같습니다.

- Hugo Extended 0.167.0
- Python 3.12
- Node.js 24
- Go 1.27.1
- Dart Sass 1.105.0

주요 파일과 폴더의 역할은 다음과 같습니다.

| 경로 | 설명 |
|---|---|
| `site/content/` | 자기소개 및 프로젝트 콘텐츠 |
| `site/pages.json` | Hugo 사이트 설정 |
| `site/themes/template/` | Hugo Mana 테마 |
| `.github/workflows/hugo-pages.yml` | GitHub Actions 자동 배포 설정 |
| `.github/pages_build.py` | 의존성 준비 및 사이트 빌드 스크립트 |

## 빌드 및 실행 방법

1. GitHub 저장소를 복제합니다.

   `git clone https://github.com/comts224/my-portfolio.git`

2. 프로젝트 폴더로 이동합니다.

   `cd my-portfolio`

3. Hugo Extended 0.167.0과 필요한 실행 환경을 준비합니다.

4. 웹사이트 빌드에 필요한 도구와 라이브러리를 준비합니다.

   `python .github/pages_build.py --dependencies`

5. 사이트를 빌드합니다.

   `python .github/pages_build.py --build`

6. 생성된 `public/` 폴더에 정적 웹사이트 파일이 있는지 확인합니다.

실제 GitHub Pages 배포는 `main` 브랜치에 Push하면 GitHub Actions를 통해 자동으로 진행됩니다.

로컬 환경에서는 Hugo 및 기타 의존성이 설치되어 있어야 하며, 위 명령어는 GitHub Actions의 빌드 설정을 기준으로 작성했습니다.

## 배포 방법

1. 로컬에서 콘텐츠와 설정 파일을 수정합니다.
2. 변경 사항을 Git에 커밋합니다.
3. `main` 브랜치에 Push합니다.
4. GitHub Actions가 Hugo 사이트를 빌드합니다.
5. GitHub Pages에 변경 사항이 배포됩니다.

## 테마 및 라이선스

이 프로젝트는 [Hugo Mana Theme](https://github.com/Livour/hugo-mana-theme)를 기반으로 제작했습니다.

테마의 원본 설명은 `README-theme-original.md`에 보관했습니다.

테마의 저작권 및 라이선스는 원본 프로젝트의 라이선스 조건을 따릅니다.

## 기능 검증 결과

GitHub Pages에 배포된 웹사이트에서 다음 기능을 직접 확인했습니다.

| 검증 항목 | 확인 내용 | 결과 |
|---|---|---|
| 자동 배포 | main 브랜치 Push 후 GitHub Actions 실행 | 성공 |
| 메뉴 이동 | Home, About, Projects 페이지 이동 | 성공 |
| 검색 기능 | LLM 검색 후 프로젝트 상세 페이지 이동 | 성공 |
| 검색 접근성 | Enter로 검색창 열기, Esc로 닫기 | 성공 |
| 반응형 화면 | 데스크톱 1440px 및 모바일 390px 확인 | 성공 |
| 모바일 메뉴 | 메뉴 열기·닫기 및 페이지 이동 | 성공 |
| 다크 모드 | 다크 모드 전환 및 라이트 모드 복귀 | 성공 |
| 404 페이지 | 한국어 안내문, 행성 이미지 및 홈 복귀 버튼 | 성공 |
| 정적 자산 | 행성 파비콘 적용 및 콘솔 404 오류 해결 | 성공 |
| 문서 언어 | HTML lang="ko" 적용 확인 | 성공 |

## 문제 해결 기록

### 검색 기능 오류

검색 인덱스에 프로젝트 콘텐츠가 포함되지 않아 LLM 프로젝트가 검색되지 않는 문제가 있었습니다.

Hugo의 JSON 출력 설정과 검색 인덱스 생성 코드를 수정했습니다. 이후 LLM 검색 결과가 표시되고, 프로젝트 상세 페이지로 정상 이동하는 것을 확인했습니다.

### 파비콘 및 자산 경로 오류

존재하지 않는 파비콘 이미지와 웹 매니페스트를 참조하여 브라우저 콘솔에 404 오류가 발생했습니다.

사용하지 않는 매니페스트 참조를 제거하고 행성 파비콘을 추가했습니다. 이미지 경로에는 Hugo의 relURL을 적용하여 GitHub Pages 배포 경로에 대응했습니다.

수정 후 브라우저 탭에 파비콘이 표시되고 콘솔의 404 오류가 사라진 것을 확인했습니다.

### 404 페이지 개선

존재하지 않는 페이지에 접속했을 때 이미지가 깨지고 영어 안내문이 표시되는 문제가 있었습니다.

깨진 이미지를 행성 이미지로 교체하고 제목, 안내문, 홈 복귀 버튼을 한국어로 수정했습니다. 이후 실제 404 페이지에서 정상 작동하는 것을 확인했습니다.
