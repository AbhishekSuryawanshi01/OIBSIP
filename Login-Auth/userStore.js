/**
 * userStore.js
 * In-memory user store (replace with a real DB like MongoDB/PostgreSQL in production)
 */

const users = new Map(); // key: email, value: user object
let idCounter = 1;

const UserStore = {
  /**
   * Create a new user
   * @param {string} email
   * @param {string} username
   * @param {string} hashedPassword
   * @returns {object} created user (without password)
   */
  create(email, username, hashedPassword) {
    if (users.has(email)) return null;
    const user = {
      id: idCounter++,
      email,
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };
    users.set(email, user);
    const { password, ...safeUser } = user;
    return safeUser;
  },

  /**
   * Find user by email (includes hashed password for auth checks)
   */
  findByEmail(email) {
    return users.get(email) || null;
  },

  /**
   * Find user by email, return without password
   */
  findSafeByEmail(email) {
    const user = users.get(email);
    if (!user) return null;
    const { password, ...safeUser } = user;
    return safeUser;
  },

  /**
   * Find user by id, return without password
   */
  findById(id) {
    for (const user of users.values()) {
      if (user.id === id) {
        const { password, ...safeUser } = user;
        return safeUser;
      }
    }
    return null;
  },

  exists(email) {
    return users.has(email);
  },
};

module.exports = UserStore;
