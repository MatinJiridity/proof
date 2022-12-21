const { task, types } = require("hardhat/config")

task("deploy", "Deploy a SemaphoreVoting contract")
    .addOptionalParam("semaphore", "Semaphore contract address", undefined, types.string)
    .addParam("group", "Group identifier", 42, types.int)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, semaphore: semaphoreAddress, group: groupId }, { ethers, run }) => {
        const { address: verifierAddress } = await run("deploy:verifier", { logs, merkleTreeDepth: 20 })

        const SemaphoreVoting = await ethers.getContractFactory("SemaphoreVoting")

        const semaphoreVoting = await SemaphoreVoting.deploy({ merkleTreeDepth: 20, contractAddress: verifierAddress })

        await semaphoreVoting.deployed()

        if (logs) {
            console.info(`semaphoreVoting contract has been deployed to: ${semaphoreVoting.address}`)
        }

        return semaphoreVoting
    })
