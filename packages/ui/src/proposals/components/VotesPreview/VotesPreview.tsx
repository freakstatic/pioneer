import React from 'react'
import styled from 'styled-components'

import { ProposalVoteKind } from '@/common/api/queries'
import { RowGapBlock } from '@/common/components/page/PageContent'
import { BorderRad, Colors } from '@/common/constants'
import { VotingRound } from '@/proposals/hooks/useVotingRounds'

import { VotePreview } from './VotePreview'

const { Approve, Reject, Slash, Abstain } = ProposalVoteKind

interface VotesPreviewProps {
  votes: VotingRound
}

export const VotesPreview = ({ votes }: VotesPreviewProps) => (
  <VotesContainer>
    <VotePreview kind={Approve} count={votes.count.approve} votes={votes.map.get(Approve)} />
    <VotePreview kind={Reject} count={votes.count.reject} votes={votes.map.get(Reject)} />
    <VotePreview kind={Slash} count={votes.count.slash} votes={votes.map.get(Slash)} />
    <VotePreview kind={Abstain} count={votes.count.abstain} votes={votes.map.get(Abstain)} />
    <VotePreview kind="Not Voted" count={votes.count.remain} />
  </VotesContainer>
)

export const VotesContainer = styled(RowGapBlock).attrs({ gap: 0 })`
  border: 1px solid ${Colors.Black[200]};
  border-radius: ${BorderRad.s};
`
