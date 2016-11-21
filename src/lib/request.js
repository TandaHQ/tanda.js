import fetch from 'isomorphic-fetch';
import buildGetParams from './buildGetParams';

const apiBase = process.env.API_BASE;
const apiVersion = process.env.API_VERSION;

function getBase() {
  return `${apiBase}/v${apiVersion}`;
}

/**
 * Does a request
 * @param endpoint
 * @param method
 * @param data
 * @returns {*}
 */
export default async function request(endpoint, method, data) {
  let url = endpoint;
  if (method === 'GET') {
    url += buildGetParams(data);
  }

  const headers = new Headers({
    Authorization: `bearer ${this.auth.access_token}`,
  });

  return await
    fetch(`${getBase()}/${url}`, {
      method,
      headers,
      body: JSON.stringify(data), // assuming it's always JSON...
    });
}
