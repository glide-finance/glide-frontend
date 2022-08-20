import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import {
  Button,
  Flex,
  Text,
  Box,
  BalanceInput,
  Image,
  ModalBody,
  ModalContainer,
  InjectedModalProps,
  AutoRenewIcon,
  IconButton,
  CloseIcon,
} from '@glide-finance/uikit'
import { useTranslation } from 'contexts/Localization'
import GliderSuccessImage from './pngs/success.png'
import GliderWaitingImage from './pngs/waiting.png'

const StyledBalanceInput = styled(BalanceInput)`
  padding: 0 10px;
  background: none;
`

const InputBox = styled(Box)`
  width: 100%;
  padding: 4px 16px;
  border: 1px solid;
  border-radius: 16px;
  border-color: ${({ theme }) => theme.colors.primary};
  :hover {
    border-width: 2px;
  }
`

const StyledModalContainer = styled(ModalContainer)`
  border-radius: 20px;
`

interface LiquidStakingModalProps extends InjectedModalProps {
  pendingTx?: boolean
  userDenied?: boolean
  userApproved?: boolean
  complete?: boolean
  amount?: string
  type: string
  onDismiss?: InjectedModalProps['onDismiss']
}

const StatusModal: React.FC<LiquidStakingModalProps> = ({
  onDismiss,
  pendingTx,
  userDenied,
  userApproved,
  complete,
  amount,
  type,
}) => {
  const { t } = useTranslation()

  useEffect(() => {
    if (userDenied) {
      onDismiss()
    }
  }, [userDenied, onDismiss])

  return (
    <StyledModalContainer minWidth="320px" p="8px" mr="12px" ml="12px">
      {!pendingTx && complete && (
        <Flex justifyContent="flex-end">
          <IconButton variant="text" onClick={onDismiss}>
            <CloseIcon width="20px" color="text" />
          </IconButton>
        </Flex>
      )}

      <Flex p="0 8px" justifyContent="center">
        {pendingTx && !userApproved && (
          <Image src={GliderWaitingImage} alt="Waiting Approval" width={200} height={200} />
        )}
        {pendingTx && userApproved && (
          <Flex padding="28px 16px 0 16px">
            <AutoRenewIcon spin color="primary" width="65px" />
          </Flex>
        )}
        {!pendingTx && complete && <Image src={GliderSuccessImage} alt="Submitted" width={200} height={200} />}
      </Flex>

      <ModalBody p="20px" maxWidth="400px" width="100%">
        <Flex flexDirection="column" justifyContent="center">
          {pendingTx && !userApproved && (
            <>
              <Text textAlign="center" fontSize="20px" mb="12px">
                Approve your transaction
              </Text>
              <Text textAlign="center" fontSize="13px" color="textSubtle">
                Please confirm the transaction directly in your wallet.
              </Text>
            </>
          )}
          {pendingTx && userApproved && (
            <>
              <Text textAlign="center" fontSize="20px" mb="12px">
                Transaction sent
              </Text>
              <Text textAlign="center" fontSize="13px" color="textSubtle">
                Please wait until your transaction is confirmed on the blockchain.
              </Text>
            </>
          )}
          {!pendingTx && complete && (
            <>
              {type === 'stake' && (
                <>
                  <Text textAlign="center" fontSize="18px" mb="12px">
                    Liquid staking confirmed
                  </Text>
                  <Text textAlign="center" fontSize="15px" color="success" mb="24px">
                    +{amount} stELA received!
                  </Text>
                  <Button color="primary" onClick={onDismiss}>
                    Done
                  </Button>
                </>
              )}
              {type === 'unstake' && (
                <Flex flexDirection="column">
                  <Text textAlign="center" fontSize="16px" mb="12px">
                    Unstake request received
                  </Text>
                  <Text textAlign="center" fontSize="12px" color="textSubtle" mb="24px">
                    Ticket status may be viewed on the Withdaw tab
                  </Text>
                  <Button color="primary" onClick={onDismiss}>
                    Done
                  </Button>
                </Flex>
              )}
              {type === 'withdraw' && (
                <Flex flexDirection="column">
                  <Text textAlign="center" fontSize="18px" mb="12px">
                    Withdrawal confirmed
                  </Text>
                  <Text textAlign="center" fontSize="15px" color="success" mb="24px">
                    +{amount} ELA received!
                  </Text>
                  <Button color="primary" onClick={onDismiss}>
                    Done
                  </Button>
                </Flex>
              )}
            </>
          )}
        </Flex>
      </ModalBody>
    </StyledModalContainer>
  )
}

export default StatusModal
