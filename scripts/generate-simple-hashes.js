const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Function to generate a unique IPFS-like hash
function generateUniqueHash(id) {
    // Combine multiple unique elements
    const uniqueElements = {
        id: id,
        timestamp: Date.now(),
        random: Math.random(),
        seed: crypto.randomBytes(32).toString('hex')
    };

    // Create hash
    const hash = crypto.createHash('sha256')
        .update(JSON.stringify(uniqueElements))
        .digest('hex');

    // Convert to IPFS-like hash (Qm + 44 chars)
    return 'Qm' + hash.substring(0, 44);
}

// Generate metadata for a single NFT
function generateNFTMetadata(id) {
    const uniqueHash = generateUniqueHash(id);
    
    return {
        name: `Digital Revolution #${id}`,
        description: `Digital Revolution NFT Collection - Edition ${id}/608`,
        image: `ipfs://${uniqueHash}/${id}.png`,
        attributes: [
            {
                trait_type: "Edition",
                value: id.toString()
            },
            {
                trait_type: "Collection",
                value: "Digital Revolution"
            },
            {
                trait_type: "Hash",
                value: uniqueHash
            }
        ],
        uniqueHash: uniqueHash
    };
}

// Generate all NFTs
async function generateAllNFTs() {
    const totalNFTs = 608;
    const metadataDir = path.join(__dirname, '..', 'metadata');
    
    // Create metadata directory if it doesn't exist
    if (!fs.existsSync(metadataDir)) {
        fs.mkdirSync(metadataDir, { recursive: true });
    }

    console.log('Generating unique NFTs...');
    
    const hashSummary = {
        totalNFTs,
        generatedAt: new Date().toISOString(),
        hashes: {},
        uniquenessCheck: new Set()
    };

    for (let i = 1; i <= totalNFTs; i++) {
        let nft;
        let attempts = 0;
        const maxAttempts = 5;

        // Keep generating until we get a unique hash
        do {
            nft = generateNFTMetadata(i);
            attempts++;
            
            if (attempts >= maxAttempts) {
                console.error(`Failed to generate unique hash for NFT #${i} after ${maxAttempts} attempts`);
                process.exit(1);
            }
        } while (hashSummary.uniquenessCheck.has(nft.uniqueHash));

        // Store hash and metadata
        hashSummary.uniquenessCheck.add(nft.uniqueHash);
        hashSummary.hashes[i] = nft.uniqueHash;
        
        // Save individual metadata file
        fs.writeFileSync(
            path.join(metadataDir, `${i}.json`),
            JSON.stringify(nft, null, 2)
        );

        if (i % 50 === 0) {
            console.log(`Generated ${i}/${totalNFTs} NFTs`);
        }
    }

    // Remove the Set before saving summary
    delete hashSummary.uniquenessCheck;
    
    // Save hash summary
    fs.writeFileSync(
        path.join(metadataDir, 'hash_summary.json'),
        JSON.stringify(hashSummary, null, 2)
    );

    console.log('\nGeneration Complete!');
    console.log('-------------------');
    console.log(`Total NFTs: ${totalNFTs}`);
    console.log(`Unique Hashes: ${Object.keys(hashSummary.hashes).length}`);
    console.log('-------------------');
}

// Run the generation
generateAllNFTs().catch(console.error);
