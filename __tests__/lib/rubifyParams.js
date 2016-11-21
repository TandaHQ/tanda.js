import test from 'ava';
import rubify from '../../src/lib/rubifyParams';

test('doesn\'t mess with normal words', (t) => {
  t.is('test', rubify('test'));
});

test('makes a param underscored instead of camelcased', (t) => {
  t.is('my_test_param', rubify('myTestParam'));
});
