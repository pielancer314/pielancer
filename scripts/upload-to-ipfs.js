const { NFTStorage, File } = require('nft.storage');
const fs = require('fs');
const path = require('path');
const mime = require('mime');
require('dotenv').config();

// NFT.Storage API token
const NFT_STORAGE_TOKEN = process.env.NFT_STORAGE_TOKEN;

// Initialize NFT.Storage client
const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

async function uploadArtwork() {
    const artDir = path.join(__dirname, '..', 'art');
    const metadataDir = path.join(__dirname, '..', 'metadata');
    
    // Read hash summary
    const hashSummary = JSON.parse(
        fs.readFileSync(path.join(metadataDir, 'hash_summary.json'))
    );

    console.log('Starting artwork upload to IPFS...');

    for (let i = 1; i <= hashSummary.totalNFTs; i++) {
        try {
            const artworkPath = path.join(artDir, `${i}.png`);
            
            // Check if artwork file exists
            if (!fs.existsSync(artworkPath)) {
                console.log(`Artwork ${i}.png not found, skipping...`);
                continue;
            }

            // Read artwork file
            const artwork = fs.readFileSync(artworkPath);
            const type = mime.getType(artworkPath);

            // Create File object
            const file = new File([artwork], `${i}.png`, { type });

            // Upload to IPFS
            console.log(`Uploading artwork ${i}.png to IPFS...`);
            const cid = await client.storeBlob(file);

            console.log(`Artwork ${i}.png uploaded with CID: ${cid}`);

            // Update metadata with actual IPFS CID
            const metadataPath = path.join(metadataDir, `${i}.json`);
            const metadata = JSON.parse(fs.readFileSync(metadataPath));
            
            // Update image URL with actual IPFS CID
            metadata.image = `ipfs://${cid}/${i}.png`;
            
            // Save updated metadata
            fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));

            // Optional: delay to prevent rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));

        } catch (error) {
            console.error(`Error uploading artwork ${i}:`, error);
        }
    }

    console.log('Artwork upload complete!');
    console.log('Uploading metadata directory...');

    // Upload entire metadata directory
    const metadataFiles = [];
    for (let i = 1; i <= hashSummary.totalNFTs; i++) {
        const metadataPath = path.join(metadataDir, `${i}.json`);
        const content = fs.readFileSync(metadataPath);
        metadataFiles.push(new File(
            [content],
            `${i}.json`,
            { type: 'application/json' }
        ));
    }

    // Upload metadata directory
    const metadataCid = await client.storeDirectory(metadataFiles);
    console.log(`Metadata directory uploaded with CID: ${metadataCid}`);

    // Save deployment info
    const deployInfo = {
        metadataCid,
        timestamp: new Date().toISOString(),
        totalNFTs: hashSummary.totalNFTs
    };

    fs.writeFileSync(
        path.join(__dirname, '..', 'deployment-info.json'),
        JSON.stringify(deployInfo, null, 2)
    );

    return { metadataCid };
}

// Install required packages
async function installDependencies() {
    console.log('Installing required packages...');
    const { execSync } = require('child_process');
    try {
        execSync('npm install nft.storage mime --save', { stdio: 'inherit' });
        console.log('Packages installed successfully');
    } catch (error) {
        console.error('Error installing packages:', error);
        process.exit(1);
    }
}

// Main execution
async function main() {
    // First install dependencies
    await installDependencies();
    
    // Check for NFT.Storage token
    if (!NFT_STORAGE_TOKEN) {
        console.error('Please set NFT_STORAGE_TOKEN in your .env file');
        process.exit(1);
    }

    try {
        const result = await uploadArtwork();
        console.log('Upload completed successfully!');
        console.log('Metadata CID:', result.metadataCid);
    } catch (error) {
        console.error('Error during upload:', error);
        process.exit(1);
    }
}

main();
