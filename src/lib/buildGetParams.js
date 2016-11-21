import rubify from './rubifyParams';

export default function buildGetParams(params) {
  const build = [];

  Object.keys(params).forEach((param) => {
    const rubied = rubify(param);
    const value = params[param];
    if (value != null) {
      build.push(`${rubied}=${value}`);
    }
  });

  return `?${build.join('&')}`;
}
