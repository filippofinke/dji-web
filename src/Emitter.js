class Emitter {
  listeners = {};

  on(type, callaback) {
    if (!this.listeners[type]) this.listeners[type] = [];
    this.listeners[type].push(callaback);
  }

  emit(type, ...args) {
    if (this.listeners[type]) {
      for (let listener of this.listeners[type]) {
        listener(...args);
      }
    }
  }
}

module.exports = Emitter;
