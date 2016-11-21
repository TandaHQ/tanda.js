/* eslint no-param-reassign: 0 */
import test from 'ava';
// lib under test
import AwardTags from '../../src/endpoints/AwardTags';
import { valid } from '../fixtures/tanda';

test.beforeEach((t) => {
  t.context.parent = valid;
  t.context.class = new AwardTags(t.context.parent);
});

test('#gets calls the right endpoint', (t) => {
  const c = t.context.class;
  c.get();
  const req = t.context.parent.request;
  t.is(req.callCount, 1);
  t.true(req.calledWith(c.endpoint, 'GET'));
});

// only one really needs to test this
test('makes a proper endpoint name', (t) => {
  t.is('award_tags', t.context.class.endpoint);
});
