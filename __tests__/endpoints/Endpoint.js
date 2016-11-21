import test from 'ava';
import Endpoint from '../../src/endpoints/Endpoint';

test('constructs', (t) => {
  t.notThrows(() => new Endpoint());
});

test('creates an endpoint name', (t) => {
  const e = new Endpoint();
  t.is('endpoint', e.endpoint);
});
