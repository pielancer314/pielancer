const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Comprehensive NFT description
const nftDescription = `Embrace the Future of Technology

The Digital Revolution NFT collection is a celebration of the transformative power of technology. Each NFT in this collection represents a key milestone in the digital revolution, from the invention of the internet to the rise of artificial intelligence.

Own a Piece of History

By owning a Digital Revolution NFT, you're not just acquiring a digital asset; you're becoming a part of history. Each NFT is a unique piece of digital art that commemorates the technological advancements that have shaped our world.

Invest in the Future

The digital revolution is still in its early stages, and the potential for future growth is immense. By investing in Digital Revolution NFTs, you're positioning yourself to benefit from the continued expansion of the digital world.

Join the Community

The Digital Revolution NFT community is a vibrant and growing group of technology enthusiasts. By owning a Digital Revolution NFT, you'll gain access to exclusive events, networking opportunities, and other benefits.

Experience the Future Today

The Digital Revolution NFT collection is more than just a collection of digital art. It's an invitation to experience the future of technology firsthand.

Own a Digital Revolution NFT today and be a part of the future!`;

// Function to generate a unique IPFS-like hash
function generateUniqueHash(id) {
    const uniqueElements = {
        id: id,
        timestamp: Date.now(),
        random: Math.random(),
        seed: crypto.randomBytes(32).toString('hex')
    };

    const hash = crypto.createHash('sha256')
        .update(JSON.stringify(uniqueElements))
        .digest('hex');

    return 'Qm' + hash.substring(0, 44);
}

// Generate metadata for a single NFT
function generateNFTMetadata(id) {
    const uniqueHash = generateUniqueHash(id);
    
    return {
        name: `Digital Revolution #${id}`,
        description: nftDescription,
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
    
    if (!fs.existsSync(metadataDir)) {
        fs.mkdirSync(metadataDir, { recursive: true });
    }

    console.log('Generating NFTs with comprehensive description...');
    
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

        do {
            nft = generateNFTMetadata(i);
            attempts++;
            
            if (attempts >= maxAttempts) {
                console.error(`Failed to generate unique hash for NFT #${i} after ${maxAttempts} attempts`);
                process.exit(1);
            }
        } while (hashSummary.uniquenessCheck.has(nft.uniqueHash));

        hashSummary.uniquenessCheck.add(nft.uniqueHash);
        hashSummary.hashes[i] = nft.uniqueHash;
        
        fs.writeFileSync(
            path.join(metadataDir, `${i}.json`),
            JSON.stringify(nft, null, 2)
        );

        if (i % 50 === 0) {
            console.log(`Generated ${i}/${totalNFTs} NFTs`);
        }
    }

    delete hashSummary.uniquenessCheck;
    
    fs.writeFileSync(
        path.join(metadataDir, 'hash_summary.json'),
        JSON.stringify(hashSummary, null, 2)
    );

    console.log('\nGeneration Complete!');
    console.log('-------------------');
    console.log(`Total NFTs: ${totalNFTs}`);
    console.log(`Unique Hashes: ${Object.keys(hashSummary.hashes).length}`);
    console.log('Description Length: ${nftDescription.length} characters');
    console.log('-------------------');
}

// Run the generation
generateAllNFTs().catch(console.error);
