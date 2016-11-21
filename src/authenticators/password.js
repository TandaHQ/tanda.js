import fetch from 'isomorphic-fetch';

export default async function (username, password) {
  const res = await fetch(`${this.api}/oauth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `username=${username}&password=${password}` +
      `&scope=${this.scopes.join(' ')}&grant_type=password`,
  });
  if (res.ok) {
    this.auth = await res.json();
  } else {
    throw new Error(`Error Authenticating: ${res.statusCode}.`);
  }
}
