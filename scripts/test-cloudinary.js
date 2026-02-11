require('dotenv').config({ path: '.env' });
const cloudinary = require('cloudinary').v2;

console.log('🔍 Testing Cloudinary Connection...');
console.log('--------------------------------');
console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('API Key:', process.env.CLOUDINARY_API_KEY ? 'Present' : 'Missing');
console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? 'Present' : 'Missing');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Test connection by listing resources (lightweight operation)
console.log('\n🔄 Attempting to list 1 resource from Cloudinary...');

cloudinary.api.resources({ max_results: 1 }, (error, result) => {
    if (error) {
        console.error('\n❌ Cloudinary Connection Failed!');
        console.error('Error:', error);

        if (error.code === 'ENOTFOUND') {
            console.log('\nPossible causes:');
            console.log('- No internet connection');
            console.log('- DNS issues');
        } else if (error.http_code === 401) {
            console.log('\nPossible causes:');
            console.log('- Invalid API Key or Secret');
            console.log('- Cloud Name is incorrect');
        }
    } else {
        console.log('\n✅ Cloudinary Connection Successful!');
        console.log('Rate Limit Allowed:', result.rate_limit_allowed);
        console.log('Rate Limit Remaining:', result.rate_limit_remaining);

        // Attempt a small upload test
        console.log('\n🔄 Attempting small upload test...');
        cloudinary.uploader.upload('https://res.cloudinary.com/demo/image/upload/sample.jpg',
            { public_id: "test_upload_debug", tags: "debug" },
            function (err, image) {
                if (err) {
                    console.warn('⚠️ Upload test failed (resources list worked though):', err);
                } else {
                    console.log('✅ Upload test successful!');
                    console.log('url:', image.url);
                }
            });
    }
});
