import { Router } from 'express';
import { createUser, loginUser } from '../data/users.js';
import { requireLogin, redirectIfLoggedIn } from '../middleware/auth.js';

const router = Router();

router
  .route('/signup')
  .get(redirectIfLoggedIn, async (req, res) => {
    return res.render('signup', {
      title: 'Sign Up | BikeSafe NYC'
    });
  })
  .post(redirectIfLoggedIn, async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        username,
        email,
        password,
        confirmPassword
      } = req.body;

      if (password !== confirmPassword) {
        throw 'Passwords do not match';
      }

      const user = await createUser(
        firstName,
        lastName,
        username,
        email,
        password
      );

      req.session.user = user;

      return res.redirect('/dashboard');
    } catch (e) {
      return res.status(400).render('signup', {
        title: 'Sign Up | BikeSafe NYC',
        error: e,
        formData: req.body
      });
    }
  });

router
  .route('/login')
  .get(redirectIfLoggedIn, async (req, res) => {
    return res.render('login', {
      title: 'Login | BikeSafe NYC'
    });
  })
  .post(redirectIfLoggedIn, async (req, res) => {
    try {
      const { identifier, password } = req.body;

      const user = await loginUser(identifier, password);

      req.session.user = user;

      return res.redirect('/dashboard');
    } catch (e) {
      return res.status(400).render('login', {
        title: 'Login | BikeSafe NYC',
        error: e,
        formData: req.body
      });
    }
  });

router.route('/logout').get(requireLogin, async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).render('error', {
        title: 'Logout Error',
        message: 'Could not log out'
      });
    }

    res.clearCookie('BikeSafeAuth');
    return res.redirect('/login');
  });
});

export default router;