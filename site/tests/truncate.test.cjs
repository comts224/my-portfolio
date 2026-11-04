const test = require('node:test');
const assert = require('node:assert/strict');

const { truncateContext } = require('../static/demo/truncate.js');

test('Truncate: 글자 수 제한만큼 문맥을 선택한다', () => {
  assert.equal(truncateContext('abcdefghij', 5), 'abcde');
});

test('Truncate: 제한이 원본보다 크면 전체 문서를 유지한다', () => {
  assert.equal(truncateContext('hello', 20), 'hello');
});

test('Truncate: 제한이 0이면 빈 결과를 반환한다', () => {
  assert.equal(truncateContext('hello', 0), '');
});
