export { };

declare global {
  interface Window {
    chrome?: typeof chrome;
  }

  const chrome: typeof globalThis.chrome;
}
