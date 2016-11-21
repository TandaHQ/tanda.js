import test from 'ava';
import buildGetParams from '../../src/lib/buildGetParams';

test('generates correct params', (t) => {
  const params = { test: true, param: 'string', number: 12 };
  const built = buildGetParams(params);
  t.is('?test=true&param=string&number=12', built);
});
