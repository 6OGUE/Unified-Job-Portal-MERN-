    import bcrypt from 'bcryptjs';

    // *** IMPORTANT: Replace 'YOUR_EXACT_PASSWORD_HERE' with 'john1234'
    // *** IMPORTANT: Replace 'PASTE_THE_FULL_HASH_YOU_COPIED_FROM_MONGODB_HERE' with the hash from your DB

    const typedPassword = 'john1234';
    const hashedPasswordFromDB = '$2b$10$Pm9oVlXTv3/07Uv37cl24.HbxPSGb5lu1rVatsSd1YI5x5XKTiR0y'; 

    async function testPassword() {
        try {
            const match = await bcrypt.compare(typedPassword, hashedPasswordFromDB);
            console.log('Manual Password Match Result:', match);
        } catch (error) {
            console.error('Error during manual bcrypt comparison:', error);
        }
    }

    testPassword();
    