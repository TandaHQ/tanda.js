import test from 'ava';
import sinon from 'sinon';
// lib under test
import AwardTags from '../../src/endpoints/AwardTags';

test.beforeEach((t) => {
  t.context.parent = {
    scopes: [],
    auth: { access_token: true },
    request: sinon.spy(),
  };
  t.context.class = new AwardTags(t.context.parent);
});

test('#gets calls the right endpoint', (t) => {
  const c = t.context.class;
  c.get();
  const req = t.context.parent.request;
  t.is(req.callCount, 1);
  t.true(req.calledWith(c.endpoint, 'GET'));
});
