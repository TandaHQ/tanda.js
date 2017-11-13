export default class Deprecated {
  constructor(migratedTo) {
    if (typeof migratedTo !== 'string') {
      return null;
    }
    let message = `${this.constructor.name} is deprecated.`;
    if (migratedTo) {
      message += `  You should migrate your code to ${migratedTo}.`;
    }
    const ignore = ['symbol', 'inspect']; // this is kinda dumb, but is necessary

    return new Proxy({}, {
      get: (target, property) => {
        if (typeof property !== 'symbol' && !ignore.includes(property)) {
          throw new Error(`Error in ${this.constructor.name}#${property} call: ${message}`);
        }
      },
    });
  }

  // eslint-disable-next-line class-methods-use-this
  toString() {
    return 'Deprecated Endpoint';
  }
}
