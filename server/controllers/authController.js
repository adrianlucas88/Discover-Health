const bcrypt = require('bcrypt');
const UserDAO = require('../dao/userDAO');

function removePassword(user) {
  return {
    id: user.id,
    username: user.username
  };
}

function isPasswordValid(password, storedPassword) {
  if (!storedPassword) {
    return false;
  }

  if (storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$')) {
    return bcrypt.compareSync(password, storedPassword);
  }

  return password === storedPassword;
}

const AuthController = {
  signup(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required'
      });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({
        error: 'Username must be at least 3 characters'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Password must be at least 6 characters'
      });
    }

    const existingUser = UserDAO.findByUsername(username.trim());

    if (existingUser) {
      return res.status(409).json({
        error: 'Username is already taken'
      });
    }

    const passwordHash = bcrypt.hashSync(password, 10);
    const user = UserDAO.create(username.trim(), passwordHash);

    req.session.userId = user.id;

    return res.status(201).json({
      message: 'Signup successful',
      user
    });
  },

  login(req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required'
      });
    }

    const user = UserDAO.findByUsername(username.trim());

    if (!user || !isPasswordValid(password, user.password)) {
      return res.status(401).json({
        error: 'Invalid username or password'
      });
    }

    req.session.userId = user.id;

    return res.json({
      message: 'Login successful',
      user: removePassword(user)
    });
  },
  logout(req, res) {
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).json({
          error: 'Logout failed'
        });
      }

      return res.json({
        message: 'Logout successful'
      });
    });
  },

  currentUser(req, res) {
    if (!req.session.userId) {
      return res.status(401).json({
        error: 'Not logged in'
      });
    }

    const user = UserDAO.findById(req.session.userId);

    if (!user) {
      return res.status(401).json({
        error: 'Not logged in'
      });
    }

    return res.json({
      user
    });
  }
};

module.exports = AuthController;