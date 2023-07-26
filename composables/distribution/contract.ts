import {
  ContractFunctionInput,
  EvolvableState,
  OwnableState
} from '~/utils/contracts'

export type Score = {
  score: string
  address: string
  fingerprint: string
}

export type DistributionState = OwnableState & EvolvableState & {
  distributionAmount: string,
  pendingDistributions: {
    [timestamp: string]: Score[]
  },
  claimable: {
    [address: string]: string
  }
  previousDistributions: {
    [timestamp: string]: { distributionAmount: string }
  }
}

export interface SetDistributionAmount extends ContractFunctionInput {
  function: 'setDistributionAmount',
  distributionAmount: string
}

export interface AddScores extends ContractFunctionInput {
  function: 'addScores',
  timestamp: string,
  scores: Score[]
}

export interface Distribute extends ContractFunctionInput {
  function: 'distribute',
  timestamp: string
}

export interface CancelDistribution extends ContractFunctionInput {
  function: 'cancelDistribution',
  timestamp: string
}
