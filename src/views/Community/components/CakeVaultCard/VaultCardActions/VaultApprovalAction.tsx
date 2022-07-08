import React from 'react'
import { Button, AutoRenewIcon, Skeleton } from '@glide-finance/uikit'
import { useTranslation } from 'contexts/Localization'
import { useVaultApprove } from '../../../hooks/useApprove'
import useActiveWeb3React from '../../../../../hooks/useActiveWeb3React'

interface ApprovalActionProps {
  setLastUpdated: () => void
  isLoading?: boolean
}

const VaultApprovalAction: React.FC<ApprovalActionProps> = ({ isLoading = false, setLastUpdated }) => {
  const { t } = useTranslation()
  const { chainId } = useActiveWeb3React()

  const { handleApprove, requestedApproval } = useVaultApprove(setLastUpdated)

  return (
    <>
      {isLoading ? (
        <Skeleton width="100%" height="52px" />
      ) : (
        <Button
          style={{ marginTop: '10px' }}
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

export default VaultApprovalAction
