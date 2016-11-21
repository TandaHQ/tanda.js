import rubify from './rubifyParams';

export default function buildGetParams(params) {
  const build = [];

  Object.keys(params).forEach((param) => {
    const rubied = rubify(param);
    const value = params[param];
    if (value instanceof Array) {
      return build.push(`${rubied}=${value.join(',')}`);
    }
    if (value != null) {
      build.push(`${rubied}=${value}`);
    }
    return null;
  });

  return `?${build.join('&')}`;
}
