import sinon from 'sinon';

export const valid = {
  scopes: [],
  auth: { access_token: '12345678910' },
  request: sinon.spy(),
};

export const noAuth = {
  scopes: [],
  auth: {},
  request: sinon.spy(),
};

