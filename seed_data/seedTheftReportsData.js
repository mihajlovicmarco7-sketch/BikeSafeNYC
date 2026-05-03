import {ObjectId} from 'mongodb';

    export const theftReportsSeedData = [
        {
            _id: new ObjectId(),
            userId: new ObjectId(),
            locationId: new ObjectId(),
            locationName: "Downtown Bike Rack",
            incidentDate: new Date("2026-03-24T14:30:00.000Z"),
            bikeDescription: "Red track bike, sticker on stem",
            contactEmail: "john@doe.com",
            contactPhone: "(123)-456-7890",
            notes: "Locked with chain lock, chain was broken",
            status: "missing",
            createdAt: new Date("2026-03-24T15:00:00.000Z"),
            updatedAt: new Date("2026-03-24T15:00:00.000Z"),
            comments: [{ _id: new ObjectId(), userId: new ObjectId(), username: "marco", text: "Saw it at Port Authority", createdAt: new Date() }]
        },
        {
            _id: new ObjectId(),
            userId: new ObjectId(),
            locationId: new ObjectId(),
            locationName: "North Station",
            incidentDate: new Date("2026-03-25T09:00:00.000Z"),
            bikeDescription: "Blue Trek Hybrid",
            contactEmail: "jane@smith.com",
            contactPhone: "(555)-111-2222",
            notes: "U-lock was cut with an angle grinder",
            status: "missing",
            createdAt: new Date("2026-03-25T10:00:00.000Z"),
            updatedAt: new Date("2026-03-25T10:00:00.000Z"),
            comments: []
        },
        {
            _id: new ObjectId(),
            userId: new ObjectId(),
            locationId: new ObjectId(),
            locationName: "East Side Pier",
            incidentDate: new Date("2026-03-27T18:00:00.000Z"),
            bikeDescription: "Yellow Fixie, white rims",
            contactEmail: "sam@cycle.org",
            contactPhone: "(555)-999-8888",
            notes: "Cable lock was snipped",
            status: "missing",
            createdAt: new Date("2026-03-27T19:00:00.000Z"),
            updatedAt: new Date("2026-03-27T19:00:00.000Z"),
            comments: []
        },
        {
            _id: new ObjectId(),
            userId: new ObjectId(),
            locationId: new ObjectId(),
            locationName: "University Quad",
            incidentDate: new Date("2026-03-28T11:00:00.000Z"),
            bikeDescription: "Green Fuji Road Bike",
            contactEmail: "prof_xyz@uni.edu",
            contactPhone: "(555)-444-5555",
            notes: "Stolen during lecture hour",
            status: "spotted",
            createdAt: new Date("2026-03-28T12:30:00.000Z"),
            updatedAt: new Date("2026-03-28T14:00:00.000Z"),
            comments: [{ _id: new ObjectId(), userId: new ObjectId(), username: "student1", text: "I saw someone riding this toward 5th Ave", createdAt: new Date() }]
        },
        {
            _id: new ObjectId(),
            userId: new ObjectId(),
            locationId: new ObjectId(),
            locationName: "Post Office Yard",
            incidentDate: new Date("2026-04-03T10:00:00.000Z"),
            bikeDescription: "Pink Kids Bike",
            contactEmail: "parent@home.com",
            contactPhone: "(555)-987-6543",
            notes: "Streamers on handlebars",
            status: "missing",
            createdAt: new Date("2026-04-03T10:30:00.000Z"),
            updatedAt: new Date("2026-04-03T10:30:00.000Z"),
            comments: [
                { _id: new ObjectId(), userId: new ObjectId(), username: "neighbor", text: "Saw a truck loading bikes nearby!!!", createdAt: new Date() },
                { _id: new ObjectId(), userId: new ObjectId(), username: "marco", text: "second comment!!!", createdAt: new Date() }
            ]
        }
    ];
