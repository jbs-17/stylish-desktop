class Cache {
  constructor(maxItem = 100, maxItemAgeInMinute = 5, itemAgeCheckIntervalInMinutes = 1) {
    this.container = {};
    this.log = {};
    this.itemAgeCheckIntervalInMinutes = itemAgeCheckIntervalInMinutes;
    this.#checker();
    this.maxItem = maxItem;
    this.maxItemAgeInMinute = maxItemAgeInMinute
  }

  async add({ key, value }) {
    const keys = Object.keys(this.container);
    if (keys.length > this.maxItem) {
      delete this.container[keys[0]];
    }
    const expired = Date.now() + this.maxItemAgeInMinute * 60 * 1000; // n menit dari sekarang
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

  async isExist(key){
    const keys = Object.keys(this.container);
    return keys.includes(key);
  }
  #checker() {
    setInterval(() => {
      const now = Date.now();
      for (const [key, { expired }] of Object.entries(this.container)) {
        if (expired <= now) {
          delete this.container[key];
        }
      }
    }, this.itemAgeCheckIntervalInMinutes * 1000 * 60);
  }

}

export default Cache;
export { Cache };
