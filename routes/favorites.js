import { Router } from 'express';
import { mockFavorites } from '../data/mockData.js';

const router = Router();

router.post('/:locationId/remove', async (req, res) => {
    const locationId = req.params.locationId;

    const favoriteIndex = mockFavorites.findIndex(
        (location) => location._id === locationId
    );

    if (favoriteIndex === -1) {
        return res.status(404).render('error', {
            title: 'Favorite Not Found',
            message: 'This location was not found in your favorites.'
        });
    }

    mockFavorites.splice(favoriteIndex, 1);

    return res.redirect('/dashboard');
});

router.post('/:locationId/add', async (req, res) => {
    const locationId = req.params.locationId;

    // Prevent duplicates
    const alreadyExists = mockFavorites.find(
        (loc) => loc._id === locationId
    );

    if (alreadyExists) {
        return res.redirect('/dashboard');
    }

    // Temp mock location
    const newFavorite = {
        _id: locationId,
        locationName: `Location ${locationId}`,
        address: 'Mock Address',
        safetyRating: 7.0
    };

    mockFavorites.push(newFavorite);

    return res.redirect('/dashboard');
});

export default router;