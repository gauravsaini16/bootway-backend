const mongoose = require('mongoose');
const User = require('../models/User');
const dotenv = require('dotenv');
const path = require('path');

// Adjust path to .env file
dotenv.config({ path: path.join(__dirname, '../.env') });

const checkAndFixUser = async () => {
    try {
        console.log('Connecting to DB...', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const email = 'hr@bootway.com';
        let user = await User.findOne({ email });

        if (user) {
            console.log(`User found: ${user.email}`);
            console.log(`Current Role: ${user.role}`);

            if (user.role !== 'hr') {
                console.log('Updating role to "hr"...');
                user.role = 'hr';
                await user.save();
                console.log('User role updated to "hr".');
            } else {
                console.log('User already has "hr" role.');
            }
        } else {
            console.log('User hr@bootway.com not found. Creating it...');
            // Create the user if it doesn't exist
            const newUser = await User.create({
                fullName: 'HR Manager',
                email: email,
                password: 'password123', // You might want to hash this if not using pre-save hook or use a known hash
                role: 'hr',
                phone: '1234567890'
            });
            console.log('HR User created.');
        }

        await mongoose.disconnect();
        console.log('Done.');
    } catch (error) {
        console.error('Error:', error);
    }
};

checkAndFixUser();
