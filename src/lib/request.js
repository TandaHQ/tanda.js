import buildGetParams from './buildGetParams';

export default function request(endpoint, method, data) {
  let url = endpoint;
  if (method === 'GET') {
    url += buildGetParams(data);
  }
  console.log(url);
  console.log(this);
}
