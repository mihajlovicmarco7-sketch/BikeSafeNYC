import { Router } from 'express';
import { requireLogin } from '../middleware/auth.js';
import {
  addFavoriteLocation,
  removeFavoriteLocation
} from '../data/users.js';

const router = Router();

router.post('/:locationId/add', requireLogin, async (req, res) => {
  const locationId = req.params.locationId;

  try {
    await addFavoriteLocation(req.session.user._id, locationId);

    return res.redirect(`/locations/${locationId}`);
  } catch (e) {
    return res.status(400).render('error', {
      title: 'Favorite Error',
      message: e
    });
  }
});

router.post('/:locationId/remove', requireLogin, async (req, res) => {
  const locationId = req.params.locationId;

  try {
    await removeFavoriteLocation(req.session.user._id, locationId);

    const redirectTo = req.body.redirectTo || '/dashboard';
    return res.redirect(redirectTo);
  } catch (e) {
    return res.status(400).render('error', {
      title: 'Favorite Error',
      message: e
    });
  }
});

export default router;