import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import { BountyPeriod, Contributor, Entrant, EntrantResult, PeriodsLengthsType, Withdrawn } from '@/bounty/types/Bounty'

import { BountyActorsList } from '../BountyActorsList/BountyActorsList'

import { Periods } from './Periods'

export interface BountySidebarProps {
  contributors?: Contributor[]
  entrants?: Entrant[]
  withdrawals?: Withdrawn[]
  entrantResult?: EntrantResult
  stage: BountyPeriod
  periodsLengths?: PeriodsLengthsType
  isSlashed?: boolean
  hidePeriods?: boolean
}

export const BountySidebar = memo(
  ({ contributors, entrants, withdrawals, entrantResult, stage, periodsLengths, isSlashed }: BountySidebarProps) => {
    const { t } = useTranslation('bounty')

    return (
      <>
        {entrants && (
          <BountyActorsList
            isSlashed={isSlashed}
            title={t('sidebar.entrants')}
            elements={entrants}
            entrantResult={entrantResult}
          />
        )}
        {withdrawals && <BountyActorsList title={t('sidebar.withdrawals')} elements={withdrawals} />}
        {contributors && (
          <BountyActorsList title={t('sidebar.contributors')} elements={contributors} open={stage === 'funding'} />
        )}
        {periodsLengths && <Periods stage={stage} periodsLengths={periodsLengths} />}
      </>
    )
  }
)
