const regex = /([A-Z]?[^A-Z]*)/g;

export default function rubify(param) {
  return param.match(regex).slice(0, -1).join('_').toLowerCase();
}
