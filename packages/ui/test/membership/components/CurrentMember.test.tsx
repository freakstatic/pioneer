import { cryptoWaitReady } from '@polkadot/util-crypto'
import { act, fireEvent, render, screen, waitForElementToBeRemoved, within } from '@testing-library/react'
import React from 'react'

import { AccountsContext } from '@/accounts/providers/accounts/context'
import { GlobalModals } from '@/app/GlobalModals'
import { ModalContextProvider } from '@/common/providers/modal/provider'
import { CurrentMember } from '@/memberships/components/CurrentMember'
import { seedMember, seedMembers } from '@/mocks/data'

import { getButton } from '../../_helpers/getButton'
import { alice, aliceStash, bob, bobStash } from '../../_mocks/keyring'
import { MockKeyringProvider, MockQueryNodeProviders } from '../../_mocks/providers'
import { setupMockServer } from '../../_mocks/server'
import { MEMBER_ALICE_DATA } from '../../_mocks/server/seeds'

describe('UI: CurrentMember component', () => {
  const mockServer = setupMockServer()

  beforeAll(async () => {
    await cryptoWaitReady()
  })

  describe('with no memberships', () => {
    it('Displays create button', async () => {
      renderComponent()

      expect(await getButton(/join now/i)).toBeDefined()
    })
  })

  describe('with multiple memberships', () => {
    beforeEach(() => {
      seedMembers(mockServer.server, 2)
    })

    it('Displays memberships count', async () => {
      await renderAndWait()

      expect(screen.getAllByText(/memberships/i)[0]?.parentElement?.textContent).toMatch(/^memberships 2/i)
    })

    it('Renders select member button', async () => {
      await renderAndWait()

      expect(screen.getByText(/select membership/i)).toBeDefined()
    })

    it('Sets active member', async () => {
      await renderAndWait()

      await act(async () => {
        fireEvent.click(screen.getByText(/select membership/i))
        fireEvent.click(within(await screen.findByRole('modal')).getByText(/alice/i))
      })

      expect(screen.getByText(/alice/i)).toBeDefined()
    })
  })

  describe('with one membership', () => {
    beforeEach(() => {
      seedMember(MEMBER_ALICE_DATA, mockServer.server)
    })

    it('Renders select member button', async () => {
      await renderAndWait()

      expect(screen.getByText(/select membership/i)).toBeDefined()
    })
  })

  function renderComponent() {
    return render(
      <MockKeyringProvider>
        <AccountsContext.Provider
          value={{
            isLoading: false,
            hasAccounts: true,
            allAccounts: [
              {
                address: alice.address,
                name: 'Alice',
              },
              {
                address: aliceStash.address,
                name: 'AliceStash',
              },
              {
                address: bob.address,
                name: 'Bob',
              },
              {
                address: bobStash.address,
                name: 'BobStash',
              },
            ],
          }}
        >
          <MockQueryNodeProviders>
            <ModalContextProvider>
              <CurrentMember />
              <GlobalModals />
            </ModalContextProvider>
          </MockQueryNodeProviders>
        </AccountsContext.Provider>
      </MockKeyringProvider>
    )
  }

  async function renderAndWait() {
    renderComponent()

    await waitForElementToBeRemoved(() => screen.getByText(/join now/i))
  }
})
