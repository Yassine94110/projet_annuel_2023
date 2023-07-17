// Importez les bibliothèques et les contrats nécessaires pour les tests
 const { expect } = require("chai");
    const { ethers } = require("hardhat");
    
// Définissez une fonction de test
describe("NFTMarketplace", function () {
  // Déclarez des variables pour les instances du contrat et les adresses d'utilisateurs
  let marketplace;
  let owner;
  let user1;
  let user2;

  // Utilisez "beforeEach" pour déployer le contrat avant chaque test
  beforeEach(async function () {
    // Déployez le contrat
    const Marketplace = await ethers.getContractFactory("NFTMarketplace");
    marketplace = await Marketplace.deploy();
    await marketplace.deployed();

    // Récupérez les adresses des comptes de test
    [owner, user1, user2] = await ethers.getSigners();
  });

  // Exemple de test pour la création d'un NFT et sa mise en vente
  it("should create and list a new NFT", async function () {
    // Appel à la fonction createToken pour créer un nouveau NFT
    const tokenId = await marketplace.createToken("https://gateway.pinata.cloud/ipfs/Qme9SYzyG54rzEYnnWA2iGVwCtJ8UBUqxA1fNZQusjP715", "My NFT", { value: ethers.utils.parseEther("0.01") });

    // Vérifiez que le NFT a été créé avec succès
    const nft = await marketplace.getListedTokenForId(tokenId);
    expect(nft.owner).to.equal(owner.address);
    expect(nft.seller).to.equal(owner.address);
    expect(nft.price).to.equal(0);
    expect(nft.currentlyListed).to.equal(false);

    // Appel à la fonction createListedToken pour mettre le NFT en vente
    await marketplace.connect(user1).createListedToken(tokenId, ethers.utils.parseEther("0.1"));

    // Vérifiez que le NFT est maintenant en vente
    const updatedNFT = await marketplace.getListedTokenForId(tokenId);
    expect(updatedNFT.owner).to.equal(marketplace.address);
    expect(updatedNFT.seller).to.equal(user1.address);
    expect(updatedNFT.price).to.equal(ethers.utils.parseEther("0.1"));
    expect(updatedNFT.currentlyListed).to.equal(true);
  });

  // Ajoutez d'autres tests pour les autres fonctionnalités du contrat

});
