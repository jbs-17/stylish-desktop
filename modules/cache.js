class Cache {
  constructor(intervalChecker = 10000, maxAge) {
    this.container = {};
    this.log = {};
    this.intervalChecker = intervalChecker;
    this.#checker();
  }

  async add({ key, value }) {
    const expired = Date.now() + 5 * 60 * 1000; // 10 menit dari sekarang
    this.container[key] = { value, expired };
    return true;
  }

  async del(key) {
    return delete this.container[key];
  }

  async get(key) {
    const result = this.container[key]?.value ?? null;
    return result;
  }

  #checker() {
    setInterval(() => {
      const now = Date.now();
      for (const [key, { expired }] of Object.entries(this.container)) {
        if (expired <= now) {
          delete this.container[key];
        }
      }
    }, this.intervalChecker);
  }
}

export default Cache;
export { Cache };
