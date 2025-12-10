import { StandardMerkleTree } from "@openzeppelin/merkle-tree";
import { uploadJsonFile, loadJsonFile } from "./storage";


export async function generateMerkleTree(tokenId: string, values: [string, string][]) {
    const jsonFileName = tokenId + "_merkle_leaves.json";
    // Create the Merkle Tree
    const tree = StandardMerkleTree.of(values, ["string", "string"]);
    console.log('Merkle Root:', tree.root);
    // Save the tree structure to a JSON file
    await uploadJsonFile(tree.dump(), jsonFileName);
    return tree.root;
}

export async function generateMerkleProof(tokenId: string, clue: string) {
    const jsonFileName = tokenId + "_merkle_leaves.json";
    const tree = StandardMerkleTree.load(JSON.parse(await loadJsonFile(jsonFileName)));
    console.log('Merkle Root:', tree.root);
    // Generate and display proofs for specific values
    for (const [i, v] of tree.entries()) {
        if (v[0] === clue) {
            const proof = tree.getProof(i);
            console.log('Value:', v);
            console.log('Proof:', proof);
            return proof;
        }
    }
}