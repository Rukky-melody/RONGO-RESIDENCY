const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const AboutContent = require('../models/AboutContent');

/**
 * Called once on server boot.
 * 1. Creates the superadmin from .env if no admin exists.
 * 2. Seeds default About content if none exists.
 */
const seedAdmin = async () => {
    try {
        // --- Seed Admin ---
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
            if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_DEFAULT_PASSWORD) {
                console.warn('⚠️  Seed: ADMIN_EMAIL or ADMIN_DEFAULT_PASSWORD not set in .env — skipping admin seed.');
            } else {
                const hashedPassword = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD, 12);
                await Admin.create({
                    email:    process.env.ADMIN_EMAIL,
                    password: hashedPassword,
                    role:     'superadmin'
                });
                console.log(`✅ Seed: Superadmin created → ${process.env.ADMIN_EMAIL}`);
            }
        }

        // --- Seed About Content ---
        const aboutCount = await AboutContent.countDocuments();
        if (aboutCount === 0) {
            await AboutContent.create({
                leadText: 'Rongo Art Foundation is a youth-led cultural organisation based in Benin City, Nigeria, working at the intersection of heritage, artistic freedom and professional sustainability.',
                bodyParagraphs: [
                    'We exist because emerging artists in Nigeria often possess extraordinary talent but lack the structural support needed to thrive. Informal contracts, limited legal awareness, mobility barriers and digital exploitation risks continue to shape the creative landscape. We respond by building structure through training, advocacy, mentorship and strategic partnerships.',
                    'Our work includes the Benin Arts and Books Festival, which celebrates cultural expression and social dialogue, and the Rongo Artist Residency, a multidisciplinary programme that combines artistic production with legal literacy, AI protection awareness and mobility guidance.',
                    'We are committed to decentralising cultural infrastructure, strengthening professional standards and ensuring that artists are not merely creative, but protected and positioned for sustainable growth.',
                    'Rongo Art Foundation is rooted in heritage, driven by young leadership and building toward a more equitable creative future.'
                ],
                lastUpdatedBy: 'system'
            });
            console.log('✅ Seed: Default About content created.');
        }
    } catch (err) {
        console.error('❌ Seed Error:', err.message);
    }
};

module.exports = seedAdmin;
