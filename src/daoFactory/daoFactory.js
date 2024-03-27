const DaoFirebaseUsers = require("../dao/DaoFirebaseUsers");

let instance = null;

class DaoFactory {
  static getInstance() {
    if (!instance) instance = new DaoFactory();
    return instance;
  }

  create(type) {
    switch (type) {
      case "firebase":
        return DaoFirebaseUsers.getInstance();
    }
  }
}

module.exports = DaoFactory;
