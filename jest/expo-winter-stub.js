// Minimal stub used in tests to avoid importing Expo's Winter runtime,
// which currently throws when required outside of Jest's test code scope.
if (typeof globalThis.__ExpoImportMetaRegistry === 'undefined') {
  Object.defineProperty(globalThis, '__ExpoImportMetaRegistry', {
    value: { url: null },
    writable: true,
    configurable: true,
    enumerable: false,
  });
}

if (typeof Symbol !== 'undefined' && Symbol.asyncIterator === undefined) {
  Symbol.asyncIterator = Symbol.for('Symbol.asyncIterator');
}

module.exports = {};

