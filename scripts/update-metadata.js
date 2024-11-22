const fs = require('fs');
const path = require('path');

// Function to update metadata files with IPFS CID
const updateMetadataWithCID = (imagesCID) => {
    const metadataDir = path.join(__dirname, '../metadata');
    
    // Read all files in the metadata directory
    const files = fs.readdirSync(metadataDir);
    
    files.forEach(file => {
        if (file.endsWith('.json')) {
            const filePath = path.join(metadataDir, file);
            const metadata = JSON.parse(fs.readFileSync(filePath));
            
            // Update the image URL with the new CID
            metadata.image = `ipfs://${imagesCID}/${file.replace('.json', '.png')}`;
            
            // Write the updated metadata back to the file
            fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));
            console.log(`Updated metadata for ${file}`);
        }
    });
};

// Check if CID was provided as command line argument
const imagesCID = process.argv[2];
if (!imagesCID) {
    console.error('Please provide the IPFS CID for the images as a command line argument');
    console.error('Usage: node update-metadata.js <IPFS_CID>');
    process.exit(1);
}

updateMetadataWithCID(imagesCID);
console.log('\nMetadata update complete!');
console.log('You can now upload the metadata directory to IPFS');
