const {expect} = require("chai");

describe("PlatziPunks Contract", () => {
    const setup = async ({maxSupply = 10000}) => {
        const [owner] = await ethers.getSigners();
        const PlatziPunks = await ethers.getContractFactory("PlatziPunks");
        const deployed = await PlatziPunks.deploy(maxSupply);

        return {
            owner,
            deployed
        }
    }
 
    context("Deployment", () => {
        it("Should set max supply to passed param", async () => {
            const maxSupply = 4000;
            const { deployed } = await setup({maxSupply});

            const returnedMaxSuplly = await deployed.maxSupply();
            expect(maxSupply).to.equal(returnedMaxSuplly);
        });
    });

    context("Minting", () => {
        it("Should mint a new token and assigns it to owner", async () => {
            const {owner, deployed} = await setup({})

            await deployed.mint();

            const ownerOfMinted = await deployed.ownerOf(0);
            expect(ownerOfMinted).to.equal(owner.address);
        });

        it("Has a minting limit", async () => {
            const maxSupply = 2;
            const { deployed } = await setup({maxSupply});

            await Promise.all([deployed.mint(), deployed.mint()])

            await expect(deployed.mint()).to.be.revertedWith("No PlatziPunks left :(")
        })
    });

    context("TokenURI", () => {
        it("Should return a valid metadata object", async () => {
            const { deployed } = await setup({});

            await deployed.mint();

            const tokenURI = await deployed.tokenURI(0);
            const stringifiedTokenURI = await tokenURI.toString();
            const [_, base64JSON] = stringifiedTokenURI.split('data:application/json;base64,')
            const stringifiedMetadata = await Buffer.from(base64JSON, "base64").toString('ascii');

            const metadata = JSON.parse(stringifiedMetadata);

            expect(metadata).to.have.all.keys("name", "description", "image")
        });
    });
});