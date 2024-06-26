import { render, userEvent, screen } from '@app/test-utils'
import SendName from './SendName-flow' 

jest.mock('@app/hooks/useAccountSafely', () => ({
  useAccountSafely: () => ({ address: '0xowner'})
}))

jest.mock('@app/hooks/useBasicName', () => ({
  useBasicName: () => ({
    ownerData: {
      owner: '0xmanager',
      registrant: '0xowner'
    },
    isLoading: false
  })
}))

jest.mock('@app/hooks/ownership/useRoles/useRoles', () => () => ({
  data: [
  {
    role: 'owner',
    address: '0xowner'
  },
  {
    role: 'manager',
    address: '0xmanager'
  },
  {
    role: 'eth-record',
    address: '0xeth-record'
  },
  {
    role: 'parent-owner',
    address: '0xparent-address'
  },
  {
    role: 'dns-owner',
    address: '0xdns-owner'
  }
],
isLoading: false}
))

jest.mock('@app/hooks/abilities/useAbilities', () => ({
  useAbilities: () => ({
    data: {
      canSendOwner: true,
      canSendManager: true,
      canEditRecords: true,
      sendNameFunctionCallDetails: {
        sendManager: {
          contract: 'contract',
        },
        sendOwner: {
          contract: 'contract'
        }
      }
    },
    isLoading: false
  })
}))

let searchData: any[] = []
jest.mock('@app/transaction-flow/input/EditRoles/hooks/useSimpleSearch.ts', () => ({
  useSimpleSearch: () => ({
    mutate: (query: string) => {
      searchData = [{ name: `${query}.eth`, address: `0x${query}`}]
    },
    data: searchData,
    isLoading: false, 
    isSuccess: true
  })
}))

jest.mock('@app/components/@molecules/AvatarWithIdentifier/AvatarWithIdentifier', () => ({
  AvatarWithIdentifier: ({name, address}: any) => <div><span>{name}</span><span>{address}</span></div>
}))

const mockIntersectionObserver = jest.fn().mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.IntersectionObserver = mockIntersectionObserver
window.scroll = jest.fn()

const mockDispatch = jest.fn()

afterEach(() => {
  jest.clearAllMocks()
})

describe('SendName', () => {
  it('should render', async () => {
    render(<SendName data={{name: 'test.eth'}} dispatch={mockDispatch} onDismiss={() => {}}/>)
    await userEvent.type(screen.getByTestId('send-name-search-input'), 'nick')
    await userEvent.click(screen.getByTestId('search-result-0xnick'))
  })

  it('should disable the row if it is the current send role ', async () => {
    render(<SendName data={{name: 'test.eth'}} dispatch={mockDispatch} onDismiss={() => {}}/>)
    await userEvent.type(screen.getByTestId('send-name-search-input'), 'owner')
    expect(screen.getByTestId('search-result-0xowner')).toBeDisabled()
  })
})