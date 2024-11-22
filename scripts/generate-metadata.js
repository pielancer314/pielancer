const fs = require('fs');
const path = require('path');

// Create directories if they don't exist
const metadataDir = path.join(__dirname, '../metadata');
const imagesDir = path.join(__dirname, '../images');

if (!fs.existsSync(metadataDir)) {
    fs.mkdirSync(metadataDir);
}

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
}

// Generate metadata for each token
const generateMetadata = (tokenId) => {
    return {
        name: `Digital Revolution #${tokenId}`,
        description: "Part of the Digital Revolution collection, representing the convergence of art and technology.",
        image: `ipfs://<CID>/${tokenId}.png`, // This will be updated after IPFS upload
        attributes: [
            {
                trait_type: "Edition",
                value: tokenId.toString()
            },
            {
                trait_type: "Collection",
                value: "Digital Revolution"
            },
            {
                trait_type: "Series",
                value: "Genesis"
            }
        ]
    };
};

// Generate metadata for all tokens
const generateAllMetadata = () => {
    for (let i = 1; i <= 608; i++) {
        const metadata = generateMetadata(i);
        const fileName = path.join(metadataDir, `${i}.json`);
        fs.writeFileSync(fileName, JSON.stringify(metadata, null, 2));
        console.log(`Generated metadata for token #${i}`);
    }
};

// Run the generation
generateAllMetadata();

console.log('\nMetadata generation complete!');
console.log(`Metadata files are stored in: ${metadataDir}`);
console.log(`Place your artwork files in: ${imagesDir}`);
console.log('\nNEXT STEPS:');
console.log('1. Add your artwork files to the images directory (named 1.png, 2.png, etc.)');
console.log('2. Upload the images directory to IPFS');
console.log('3. Update the image CID in the metadata files');
console.log('4. Upload the updated metadata to IPFS');
