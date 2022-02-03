import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR, GLIDE_START_BLOCK, GLIDE_BONUS_PERIOD, GLIDE_REDUCTION_PERIOD, GLIDE_PER_BLOCK } from 'config'

// Calculate phase
function phase(blockNumber: BigNumber) {
  // Issue here if connected to another chain with a different block height. Calculates based on that height. Hardcoded for now.

  // if (blockNumber.gte(GLIDE_START_BLOCK)) {
  //   // Calculate block number from start block
  //   const blockNumberFromStart = blockNumber.minus(GLIDE_START_BLOCK)
  //   // If blockNumberFromStart less then block for reduction period, then we are in one phase
  //   if (blockNumberFromStart.lte(GLIDE_BONUS_PERIOD)) {
  //     return 1
  //   }
  //   // Calculate phase and add 1, because, will be start from one, and one phase is bonus phase
  //   return blockNumberFromStart
  //     .minus(GLIDE_BONUS_PERIOD)
  //     .minus(new BigNumber(1))
  //     .idiv(GLIDE_REDUCTION_PERIOD)
  //     .plus(new BigNumber(2))
  //     .toNumber()
  // }
  return 2
}

// Get Glide token reward per block
function rewardPerPhase(phaseNumber: number) {
  // If larger than 25, it would be overflow error (also, in first 25 phase we will distribute all tokens)
  if (phaseNumber === 0 || phaseNumber > 25) {
    return new BigNumber(0)
  }
  if (phaseNumber === 1) {
    return GLIDE_PER_BLOCK
  }
  const rwrd = GLIDE_PER_BLOCK.multipliedBy(75)
    .div(100)
    .multipliedBy(85 ** (phaseNumber - 2))
    .div(100 ** (phaseNumber - 2))
  return rwrd
}

/**
 * Returns the total number of glide per year
 */
export const getGlidesPerYear = (currentBlock: BigNumber) => {
  // Reward sum
  let rewardSum = new BigNumber(0)
  let totalBlocks = BLOCKS_PER_YEAR
  if (currentBlock.lt(GLIDE_START_BLOCK)) {
    totalBlocks = totalBlocks.minus(GLIDE_START_BLOCK.minus(currentBlock))
  }
  let iterationBlocks = GLIDE_START_BLOCK.plus(1)
  const currentPhase = phase(currentBlock)

  // Calculate reward sum
  while (totalBlocks.gt(0)) {
    let nextBlockBorder
    const iterationPhase = phase(iterationBlocks)
    if (iterationPhase === 1) {
      nextBlockBorder = GLIDE_BONUS_PERIOD
    } else {
      nextBlockBorder = GLIDE_REDUCTION_PERIOD
    }

    // If loop is same or after current block phase
    if (currentPhase > 0 && iterationPhase >= currentPhase) {
      let blocksForReward
      if (iterationPhase === currentPhase) {
        blocksForReward = iterationBlocks.minus(currentBlock)
      } else if (iterationPhase > currentPhase) {
        blocksForReward = nextBlockBorder
      }
      // Calculate rewards for current loop phase
      blocksForReward = totalBlocks.minus(blocksForReward).gt(0) ? blocksForReward : totalBlocks
      // Calculate reward sum before and for current loop phase
      rewardSum = rewardSum.plus(rewardPerPhase(iterationPhase).multipliedBy(new BigNumber(blocksForReward)))
      totalBlocks = totalBlocks.minus(blocksForReward)
    }
    iterationBlocks = iterationBlocks.plus(nextBlockBorder)
  }
  return rewardSum
}

/*
 * Returns the glide current emission
 */
export const getGlideCurrentEmissions = (currentBlock: BigNumber) => {
  const currentPhase = phase(currentBlock)
  return rewardPerPhase(currentPhase)
}
