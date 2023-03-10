const api = require('termux');

class CheckTermuxApi {
  static check() {
    return api.hasTermux;
  }
}

module.exports = {
  CheckTermuxApi
};
