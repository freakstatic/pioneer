import { SubmittableExtrinsic } from '@polkadot/api/types'
import { ISubmittableResult } from '@polkadot/types/types'
import BN from 'bn.js'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { ActorRef } from 'xstate'

import { useMyAccounts } from '@/accounts/hooks/useMyAccounts'
import { accountOrNamed } from '@/accounts/model/accountOrNamed'
import { Account } from '@/accounts/types'
import { WithdrawInfo } from '@/bounty/components/WithdrawInfo/WithdrawInfo'
import { Bounty } from '@/bounty/types/Bounty'
import { ButtonPrimary } from '@/common/components/buttons'
import { ModalBody, ModalFooter, TransactionInfoContainer } from '@/common/components/Modal'
import { TransactionInfo } from '@/common/components/TransactionInfo'
import { TextMedium } from '@/common/components/typography'
import { BN_ZERO } from '@/common/constants'
import { useSignAndSendTransaction } from '@/common/hooks/useSignAndSendTransaction'
import { TransactionModal } from '@/common/modals/TransactionModal'
import { formatTokenValue } from '@/common/model/formatters'

export interface Props {
  onClose: () => void
  transaction: SubmittableExtrinsic<'rxjs', ISubmittableResult>
  service: ActorRef<any>
  controllerAccount: Account
  type: 'stake' | 'contribution' | 'reward'
  reward?: BN
  stake?: BN
  amount: BN
  bounty?: Bounty
  isContributor?: boolean
}

export const WithdrawSignModal = ({
  onClose,
  transaction,
  service,
  controllerAccount,
  type,
  reward,
  stake,
  amount,
  bounty,
  isContributor,
}: Props) => {
  const { t } = useTranslation('bounty')
  const { allAccounts } = useMyAccounts()

  const { sign, isReady, paymentInfo } = useSignAndSendTransaction({
    service,
    transaction,
    signer: controllerAccount.address,
  })

  const extraAmount = bounty && isContributor ? bounty.cherry.mul(amount.div(bounty.totalFunding)) : BN_ZERO
  const bountyFailedInfo = bounty?.stage === 'failed' && !!isContributor

  return (
    <TransactionModal onClose={onClose} service={service} title={t(`modals.withdraw.${type}.title`)}>
      <ModalBody>
        <TextMedium light>{`${t(`modals.withdraw.${type}.description`, { value: formatTokenValue(amount) })} ${
          bountyFailedInfo
            ? t('modals.withdraw.extraDescription', {
                amount: formatTokenValue(extraAmount),
              })
            : ''
        }`}</TextMedium>

        <WithdrawInfo
          account={accountOrNamed(allAccounts, controllerAccount.address, 'Account')}
          amountTitle={t(`modals.withdraw.${type}.amountTitle`)}
          rows={[
            ...(stake ? [{ stakingFromTitle: t('modals.withdraw.stake.stakingFrom'), amount: stake }] : []),
            ...(reward ? [{ stakingFromTitle: t('modals.withdraw.reward.stakingFrom'), amount: reward }] : []),
            ...(!stake && !reward
              ? [{ stakingFromTitle: t(`modals.withdraw.${type}.stakingFrom`), amount: amount.add(extraAmount) }]
              : []),
          ]}
        />
      </ModalBody>
      <ModalFooter>
        <TransactionInfoContainer>
          <TransactionInfo
            title={t('modals.common.amount')}
            value={amount.add(extraAmount)}
            tooltipText={bountyFailedInfo ? t('modals.withdraw.extraTooltipInformation') : undefined}
          />
          <TransactionInfo
            title={t('modals.common.transactionFee.label')}
            value={paymentInfo?.partialFee.toBn()}
            tooltipText={t('modals.common.transactionFee.tooltip')}
          />
        </TransactionInfoContainer>
        <ButtonPrimary size="medium" disabled={!isReady} onClick={sign}>
          {t(`modals.withdraw.${type}.button`)}
        </ButtonPrimary>
      </ModalFooter>
    </TransactionModal>
  )
}
