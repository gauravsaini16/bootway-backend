const mongoose = require('mongoose');
require('dotenv').config();

async function fixIndexes() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Get the applications collection
    const db = mongoose.connection.db;
    const collection = db.collection('applications');

    // Drop all existing indexes
    console.log('🗑️ Dropping existing indexes...');
    await collection.dropIndexes();
    console.log('✅ All indexes dropped');

    // Create the correct index
    console.log('📝 Creating new index...');
    await collection.createIndex(
      { jobId: 1, candidateEmail: 1 }, 
      { unique: true, name: 'jobId_1_candidateEmail_1' }
    );
    console.log('✅ New index created: jobId_1_candidateEmail_1');

    // List all indexes to verify
    const indexes = await collection.listIndexes();
    console.log('📋 Current indexes:');
    indexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    console.log('🎉 Index fix completed successfully!');
  } catch (error) {
    console.error('❌ Error fixing indexes:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

fixIndexes();
