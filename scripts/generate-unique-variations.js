const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Unique variation techniques
const variationTechniques = {
    // 1. Time-based uniqueness
    timeBasedHash: (id) => {
        const timestamp = Date.now();
        return crypto.createHash('sha256')
            .update(`${id}-${timestamp}-${Math.random()}`)
            .digest('hex');
    },

    // 2. Position-based uniqueness
    positionBasedHash: (id) => {
        const position = {
            x: Math.sin(id) * 1000,
            y: Math.cos(id) * 1000,
            z: Math.tan(id) * 1000
        };
        return crypto.createHash('sha256')
            .update(JSON.stringify(position))
            .digest('hex');
    },

    // 3. Color variation uniqueness
    colorBasedHash: (id) => {
        const color = {
            r: (Math.sin(id) * 255) % 255,
            g: (Math.cos(id) * 255) % 255,
            b: (Math.tan(id) * 255) % 255
        };
        return crypto.createHash('sha256')
            .update(JSON.stringify(color))
            .digest('hex');
    },

    // 4. Mathematical uniqueness
    mathBasedHash: (id) => {
        const mathOps = {
            fibonacci: Math.fibonacci(id % 100),
            prime: Math.isPrime(id),
            factorial: Math.factorial(id % 10)
        };
        return crypto.createHash('sha256')
            .update(JSON.stringify(mathOps))
            .digest('hex');
    },

    // 5. Trait-based uniqueness
    traitBasedHash: (id) => {
        const traits = {
            rarity: (id % 10) + 1,
            power: (Math.sin(id) * 100) % 100,
            level: (id % 100) + 1,
            experience: id * 100,
            strength: (Math.cos(id) * 50) % 50
        };
        return crypto.createHash('sha256')
            .update(JSON.stringify(traits))
            .digest('hex');
    }
};

// Helper functions
Math.fibonacci = (n) => {
    if (n <= 1) return n;
    return Math.fibonacci(n - 1) + Math.fibonacci(n - 2);
};

Math.isPrime = (n) => {
    for (let i = 2; i <= Math.sqrt(n); i++)
        if (n % i === 0) return false;
    return n > 1;
};

Math.factorial = (n) => {
    if (n <= 1) return 1;
    return n * Math.factorial(n - 1);
};

// Generate unique metadata for each NFT
function generateUniqueNFT(id) {
    // Combine all variation techniques
    const uniqueElements = {
        timeHash: variationTechniques.timeBasedHash(id),
        positionHash: variationTechniques.positionBasedHash(id),
        colorHash: variationTechniques.colorBasedHash(id),
        mathHash: variationTechniques.mathBasedHash(id),
        traitHash: variationTechniques.traitBasedHash(id)
    };

    // Create final unique hash
    const finalHash = crypto.createHash('sha256')
        .update(JSON.stringify(uniqueElements))
        .digest('hex');

    // Generate IPFS-like hash (Qm + 44 chars)
    const ipfsHash = 'Qm' + finalHash.substring(0, 44);

    // Generate unique traits
    const traits = {
        Edition: id,
        Rarity: (id % 10) + 1,
        Power: Math.floor((Math.sin(id) * 100) % 100),
        Level: (id % 100) + 1,
        Experience: id * 100,
        Strength: Math.floor((Math.cos(id) * 50) % 50),
        TimeSignature: Date.now(),
        PositionX: Math.floor(Math.sin(id) * 1000),
        PositionY: Math.floor(Math.cos(id) * 1000),
        ColorR: Math.floor((Math.sin(id) * 255) % 255),
        ColorG: Math.floor((Math.cos(id) * 255) % 255),
        ColorB: Math.floor((Math.tan(id) * 255) % 255)
    };

    return {
        name: `Digital Revolution #${id}`,
        description: `A unique piece from the Digital Revolution collection. Edition ${id}/608.`,
        image: `ipfs://${ipfsHash}/${id}.png`,
        attributes: Object.entries(traits).map(([trait_type, value]) => ({
            trait_type,
            value: value.toString()
        })),
        uniqueHash: ipfsHash,
        uniqueElements
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

    console.log('Generating unique NFTs with multiple variation layers...');
    
    const hashSummary = {
        totalNFTs,
        generatedAt: new Date().toISOString(),
        hashes: {},
        uniquenessVerification: new Set()
    };

    for (let i = 1; i <= totalNFTs; i++) {
        const nft = generateUniqueNFT(i);
        
        // Verify uniqueness
        if (hashSummary.uniquenessVerification.has(nft.uniqueHash)) {
            console.error(`Duplicate hash detected for NFT #${i}! Regenerating...`);
            i--; // Retry this NFT
            continue;
        }
        
        // Store hash and metadata
        hashSummary.uniquenessVerification.add(nft.uniqueHash);
        hashSummary.hashes[i] = nft.uniqueHash;
        
        // Save individual metadata file
        fs.writeFileSync(
            path.join(metadataDir, `${i}.json`),
            JSON.stringify(nft, null, 2)
        );

        if (i % 50 === 0) {
            console.log(`Generated ${i}/${totalNFTs} NFTs...`);
        }
    }

    // Remove the Set before saving summary
    delete hashSummary.uniquenessVerification;
    
    // Save hash summary
    fs.writeFileSync(
        path.join(metadataDir, 'hash_summary.json'),
        JSON.stringify(hashSummary, null, 2)
    );

    console.log('\nUniqueness Statistics:');
    console.log('----------------------');
    console.log(`Total NFTs Generated: ${totalNFTs}`);
    console.log(`Unique Hashes: ${Object.keys(hashSummary.hashes).length}`);
    console.log('----------------------');
}

// Run the generation
generateAllNFTs().catch(console.error);
