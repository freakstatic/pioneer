import React from 'react'

import { PageHeader } from '@/app/components/PageHeader'
import { AddBountyButton } from '@/bounty/components/modalsButtons/AddBountyButton'

import { BountiesTabs } from './BountiesTabs'

export const BountiesHeader = () => {
  return <PageHeader title="Bounty" tabs={<BountiesTabs />} buttons={<AddBountyButton />} />
}
