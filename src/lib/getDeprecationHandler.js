export default function getDeprecatedHandler(toHandle, migrateTo) {
  return new Proxy(toHandle, {
    get(t, property) {
      let message = `${t.constructor.name} is deprecated.`;
      if (migrateTo) {
        message += `  You should migrate your code to ${migrateTo}.`;
      }
      throw new Error(`Error in ${t.constructor.name}#${property} call: ${message}.`);
    },
  });
}
