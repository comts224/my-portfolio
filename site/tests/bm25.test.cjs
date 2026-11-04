const test = require('node:test');
const assert = require('node:assert/strict');
const { chooseBM25, getSelectedScores } = require('../static/demo/bm25.js');

const document = '사과는 맛있다. 바나나는 노랗다. 포도는 달콤하다.';

test('BM25: 질문과 일치하는 문장을 선택한다', () => {
  const result = chooseBM25(document, '바나나는', 100);
  assert.equal(result, '바나나는 노랗다.');
});

test('BM25: 관련 없는 문장은 선택하지 않는다', () => {
  const result = chooseBM25(document, '바나나는', 100);
  assert.ok(!result.includes('사과는'));
  assert.ok(!result.includes('포도는'));
});

test('BM25: 글자 수 제한을 지킨다', () => {
  const result = chooseBM25(document, '바나나는', 5);
  assert.ok(result.length <= 5);
});

test('BM25: 관련 단어가 없으면 빈 결과를 반환한다', () => {
  const result = chooseBM25(document, '자동차', 100);
  assert.equal(result, '');
});

test('BM25: 선택된 문장의 원문 위치와 점수를 기록한다', () => {
  chooseBM25(document, '바나나는', 100);
  const scores = getSelectedScores();
  assert.equal(scores.length, 1);
  assert.equal(scores[0].index, 2);
  assert.ok(scores[0].score > 0);
});

test('BM25: 질문이 비어 있으면 빈 결과를 반환한다', () => {
  const result = chooseBM25('사과는 맛있다.', '', 100);
  assert.equal(result, '');
  assert.deepEqual(getSelectedScores(), []);
});

test('BM25: 문서가 비어 있으면 빈 결과를 반환한다', () => {
  const result = chooseBM25('', '사과', 100);
  assert.equal(result, '');
  assert.deepEqual(getSelectedScores(), []);
});

test('BM25: 관련 문장이 여러 개여도 글자 수 제한을 지킨다', () => {
  const text = '사과는 빨갛다. 사과는 맛있다. 바나나는 노랗다.';
  const result = chooseBM25(text, '사과는', 20);
  assert.ok(result.length <= 20);
  assert.ok(result.includes('사과는'));
});

test('BM25: 다음 검색에서 이전 문장의 점수가 남지 않는다', () => {
  chooseBM25('사과는 맛있다.', '사과는', 100);
  assert.equal(getSelectedScores().length, 1);

  chooseBM25('바나나는 노랗다.', '자동차', 100);
  assert.deepEqual(getSelectedScores(), []);
});
