import React from 'react'
import { Button, AutoRenewIcon, Skeleton } from '@glide-finance/uikit'
import { useTranslation } from 'contexts/Localization'
import { useERC20 } from 'hooks/useContract'
import { getAddress } from 'utils/addressHelpers'
import { Pool } from 'state/types'
import { useApprovePool } from '../../../hooks/useApprove'
import useActiveWeb3React from '../../../../../hooks/useActiveWeb3React'

interface ApprovalActionProps {
  pool: Pool
  isLoading?: boolean
}

const ApprovalAction: React.FC<ApprovalActionProps> = ({ pool, isLoading = false }) => {
  const { sousId, stakingToken, earningToken } = pool
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()
  const stakingTokenContract = useERC20(stakingToken.address ? getAddress(stakingToken.address) : '')
  const { handleApprove, requestedApproval } = useApprovePool(stakingTokenContract, sousId, earningToken.symbol)

  return (
    <>
      {isLoading ? (
        <Skeleton width="100%" height="52px" />
      ) : (
        <Button
          isLoading={requestedApproval}
          endIcon={requestedApproval ? <AutoRenewIcon spin color="currentColor" /> : null}
          disabled={requestedApproval || chainId !== 20}
          onClick={handleApprove}
          width="100%"
        >
          {t('Enable')}
        </Button>
      )}
    </>
  )
}

export default ApprovalAction
