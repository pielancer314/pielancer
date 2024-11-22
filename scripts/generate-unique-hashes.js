const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Function to generate a unique IPFS-like hash
function generateIPFSHash(content) {
    const hash = crypto.createHash('sha256');
    hash.update(content);
    // Create a hash that looks like an IPFS hash (Qm + 44 characters)
    return 'Qm' + hash.digest('hex').substring(0, 44);
}

// Function to generate unique content for each NFT
function generateUniqueContent(id) {
    return `Digital Revolution NFT #${id} - Unique Content ${Date.now()}-${Math.random()}`;
}

// Generate metadata with unique hashes for all 608 NFTs
async function generateMetadataWithUniqueHashes() {
    const totalNFTs = 608;
    const metadataDir = path.join(__dirname, '..', 'metadata');

    // Create metadata directory if it doesn't exist
    if (!fs.existsSync(metadataDir)) {
        fs.mkdirSync(metadataDir, { recursive: true });
    }

    console.log('Generating unique metadata for 608 NFTs...');

    for (let i = 1; i <= totalNFTs; i++) {
        // Generate unique content and hash for each NFT
        const uniqueContent = generateUniqueContent(i);
        const uniqueHash = generateIPFSHash(uniqueContent);

        // Create metadata object
        const metadata = {
            name: `Digital Revolution #${i}`,
            description: "Part of the Digital Revolution collection, representing the convergence of art and technology.",
            image: `ipfs://${uniqueHash}/${i}.png`,
            attributes: [
                {
                    trait_type: "Edition",
                    value: `${i}`
                },
                {
                    trait_type: "Collection",
                    value: "Digital Revolution"
                },
                {
                    trait_type: "Series",
                    value: "Genesis"
                },
                {
                    trait_type: "Hash",
                    value: uniqueHash
                }
            ],
            uniqueHash: uniqueHash // Store the hash separately for reference
        };

        // Write metadata to file
        const filePath = path.join(metadataDir, `${i}.json`);
        fs.writeFileSync(filePath, JSON.stringify(metadata, null, 2));

        if (i % 50 === 0) {
            console.log(`Generated metadata for ${i} NFTs...`);
        }
    }

    console.log('Completed generating metadata with unique hashes!');
    
    // Create a summary file with all hashes
    const summaryPath = path.join(__dirname, '..', 'metadata', 'hash_summary.json');
    const hashSummary = {
        totalNFTs: totalNFTs,
        generatedAt: new Date().toISOString(),
        hashes: {}
    };

    // Collect all hashes
    for (let i = 1; i <= totalNFTs; i++) {
        const metadata = JSON.parse(fs.readFileSync(path.join(metadataDir, `${i}.json`)));
        hashSummary.hashes[i] = metadata.uniqueHash;
    }

    fs.writeFileSync(summaryPath, JSON.stringify(hashSummary, null, 2));
    console.log('Hash summary created at metadata/hash_summary.json');
}

// Run the generation
generateMetadataWithUniqueHashes().catch(console.error);
