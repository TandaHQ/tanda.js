import getDeprecationHandler from '../lib/getDeprecationHandler';

export default class Roles {
  constructor() {
    return getDeprecationHandler(this, 'Teams (Departments)');
  }
}
