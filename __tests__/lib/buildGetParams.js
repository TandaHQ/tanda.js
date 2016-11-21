import test from 'ava';
import buildGetParams from '../../src/lib/buildGetParams';

test('generates correct params', (t) => {
  const params = { test: true, param: 'string', number: 12 };
  const built = buildGetParams(params);
  t.is('?test=true&param=string&number=12', built);
});

test('test array works properly', (t) => {
  const built = buildGetParams({ test: ['my', 'cool', 'array'] });
  t.is('?test=my,cool,array', built);
});

test('accurately uses ruby name', (t) => {
  const built = buildGetParams({ myTestParam: 1 });
  t.is('?my_test_param=1', built);
});
