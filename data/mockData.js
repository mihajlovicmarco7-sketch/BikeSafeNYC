export const mockUser = {
  _id: 'user123',
  firstName: 'Nick',
  username: 'nickp'
};

export let mockReports = [
  {
    _id: 'report1',
    userId: 'user123',
    bikeDescription: 'Red track bike with sticker on stem',
    locationId: 'loc1',
    locationName: '123 Main St',
    incidentDate: '2026-03-24T14:30:00.000Z',
    contactEmail: 'john@doe.com',
    contactPhone: '(123)-456-7890',
    notes: 'Locked with chain lock, chain was broken when I returned',
    status: 'missing'
  },
  {
    _id: 'report2',
    userId: 'user123',
    bikeDescription: 'Black Trek commuter bike',
    locationId: 'loc2',
    locationName: '456 Broadway',
    incidentDate: '2026-03-20T09:00:00.000Z',
    contactEmail: 'john@doe.com',
    contactPhone: '',
    notes: 'Recovered two days later near Union Square',
    status: 'recovered'
  }
];

export const mockFavorites = [
  {
    _id: 'loc1',
    locationName: '123 Main St',
    address: '123 Main St, New York, NY',
    safetyRating: 7.5
  },
  {
    _id: 'loc3',
    locationName: '789 Park Ave',
    address: '789 Park Ave, New York, NY',
    safetyRating: 8.8
  }
];