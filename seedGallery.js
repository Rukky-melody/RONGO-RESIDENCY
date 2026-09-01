require('dotenv').config();
const mongoose = require('mongoose');
const GalleryItem = require('./models/GalleryItem');

const seedData = [
    { title: "Day 1", imageUrl: "./images/rongo_drummers.jpg", linkUrl: "https://jiggysrealm.pixieset.com/rongoresidencyday1/", order: 1 },
    { title: "Day 2", imageUrl: "./images/rongo_artists.jpg", linkUrl: "https://jiggysrealm.pixieset.com/rongoartistresidencyday2/", order: 2 },
    { title: "Day 3", imageUrl: "./images/rongo_day3.jpg", linkUrl: "https://jiggysrealm.pixieset.com/rongoartistresidencyday3/", order: 3 },
    { title: "Day 4", imageUrl: "./images/rongo_discussion.jpg", linkUrl: "https://jiggysrealm.pixieset.com/rongoartistresidencyday4/", order: 4 },
    { title: "Day 5", imageUrl: "./images/rongo_class.jpg", linkUrl: "https://jiggysrealm.pixieset.com/rongoartistresidencyday5/", order: 5 },
    { title: "Day 6", imageUrl: "./images/rongo_day6.jpg", linkUrl: "https://jiggysrealm.pixieset.com/rongoartistresidencyday6/", order: 6 }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');
        
        // Clear existing just in case
        await GalleryItem.deleteMany({});
        
        await GalleryItem.insertMany(seedData);
        console.log('Successfully seeded gallery items!');
        process.exit(0);
    } catch (err) {
        console.error('Seed error:', err);
        process.exit(1);
    }
}

seed();
