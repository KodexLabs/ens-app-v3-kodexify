import styled, { css } from 'styled-components'

import useRoles from '@app/hooks/ownership/useRoles/useRoles'

import { SearchViewResult } from '../components/SearchViewResult'

const Container = styled.div(
  () => css`
    width: 100%;
    display: flex;
    flex-direction: column;
  `,
)

type Props = {
  name: string
  results: any[]
  senderRole?: 'owner' | 'manager' | null
  onSelect: (address: string) => void
}

export const SearchViewResultsView = ({ name, results, senderRole, onSelect }: Props) => {
  const roles = useRoles(name)
  return (
    <Container>
      {results.map((result) => (
        <SearchViewResult
          key={result.address}
          name={result.name}
          address={result.address}
          roles={roles.data || []}
          excludeRole={senderRole}
          onClick={() => onSelect(result.address)}
        />
      ))}
    </Container>
  )
}
