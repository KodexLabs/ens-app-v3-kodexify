/* eslint-disable jsx-a11y/click-events-have-key-events */

/* eslint-disable jsx-a11y/no-static-element-interactions */

/* eslint-disable jsx-a11y/interactive-supports-focus */
import { ChangeEvent, ForwardedRef, MouseEvent, forwardRef, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Input, MagnifyingGlassSVG } from '@ensdomains/thorin'

import { filtersDefaultState, useFilters } from './SearchInputFIltersProvider'
import { SearchInputFilters } from './SearchInputFilters'

const SearchWrapper = styled.div<{ $size: 'medium' | 'extraLarge' }>(
  ({ $size }) => css`
    z-index: 1;
    display: flex;
    gap: 40px;
    width: ${$size === 'extraLarge' ? '84%' : '100%'};
    margin: 0 auto;
  `,
)

const SearchInputWrapper = styled.div<{ $size: 'medium' | 'extraLarge' }>(
  ({ theme, $size }) => css`
    z-index: 1;
    display: flex;
    align-items: center;
    box-shadow: ${theme.boxShadows['0.25']};
    border-radius: ${theme.radii['2.5xLarge']};
    border-color: ${theme.colors.border};
    width: ${$size === 'extraLarge' ? '90%' : '100%'};
    & input::placeholder {
      color: ${theme.colors.greyPrimary};
      font-weight: ${theme.fontWeights.bold};
    }
    ${$size === 'medium' &&
    css`
      max-width: ${theme.space['96']};
      box-shadow: none;
      border-radius: ${theme.radii.full};
      & input::placeholder {
        color: ${theme.colors.greyPrimary};
        font-weight: ${theme.fontWeights.normal};
      }
    `}
  `,
)

const StyledInputParent = (size: 'medium' | 'extraLarge') =>
  css(
    ({ theme }) => css`
      border-radius: ${theme.radii.full};
      background-color: ${theme.colors.backgroundSecondary};
      transition: background-color 0.35s ease-in-out;
      ${size === 'medium' &&
      css`
        & > div {
          border-radius: ${theme.radii.full};
          input {
            padding-left: ${theme.space['12']};
          }
        }
      `}
      &:focus-within {
        background-color: ${theme.colors.backgroundPrimary};
        & input::placeholder {
          color: transparent;
        }
      }
    `,
  )

const MagnifyingGlassIcon = styled.svg(
  ({ theme }) => css`
    width: ${theme.space['4']};
    height: ${theme.space['4']};
  `,
)

// const ResetButton = styled.div(
//   ({ theme }) => css`
//     display: block;
//     transition: all 0.15s ease-in-out;
//     cursor: pointer;
//     color: rgba(${theme.shadesRaw.foreground}, 0.25);
//     width: ${theme.space['7']};
//     height: ${theme.space['7']};
//     margin-right: ${theme.space['2']};
//     &:hover {
//       color: rgba(${theme.shadesRaw.foreground}, 0.3);
//       transform: translateY(-1px);
//     }
//   `,
// )

export const SearchInputBox = forwardRef(
  (
    {
      size = 'extraLarge',
      input,
      setInput,
      containerRef,
    }: {
      size?: 'medium' | 'extraLarge'
      input: string
      setInput: (input: string) => void
      containerRef: ForwardedRef<HTMLDivElement>
    },
    ref,
  ) => {
    const [currentSearchTerm, setCurrentSearch] = useState(input)
    const { t } = useTranslation('common')

    const { setFilters } = useFilters()

    useEffect(() => {
      if (size === 'medium') setFilters(filtersDefaultState)
    }, [size, setFilters])

    let delayTimer: number | NodeJS.Timeout | string
    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
      clearTimeout(delayTimer)
      setCurrentSearch(e.target.value)
      delayTimer = setTimeout(() => {
        setInput(e.target.value)
      }, 1000)
    }

    return (
      <SearchWrapper ref={containerRef} $size={size}>
        {size === 'extraLarge' && <SearchInputFilters />}
        <SearchInputWrapper $size={size}>
          <Input
            size={size}
            label={t('search.label')}
            hideLabel
            placeholder={t('search.placeholder')}
            value={currentSearchTerm}
            onChange={onChange}
            ref={ref as any}
            clearable
            autoComplete="off"
            autoCorrect="off"
            parentStyles={StyledInputParent(size)}
            icon={size === 'medium' ? <MagnifyingGlassIcon as={MagnifyingGlassSVG} /> : undefined}
            spellCheck="false"
            data-testid="search-input-box"
          />
        </SearchInputWrapper>
      </SearchWrapper>
    )
  },
)

export const FakeSearchInputBox = forwardRef(
  (
    {
      size = 'extraLarge',
      onClick,
    }: {
      size?: 'medium' | 'extraLarge'
      onClick: (e: MouseEvent<HTMLInputElement>) => void
    },
    ref,
  ) => {
    const { t } = useTranslation('common')
    return (
      <SearchInputWrapper $size={size}>
        <Input
          size={size}
          label={t('search.label')}
          hideLabel
          placeholder={t('search.placeholder')}
          ref={ref as any}
          onClick={onClick}
          readOnly
          autoComplete="off"
          autoCorrect="off"
          parentStyles={StyledInputParent(size)}
          spellCheck="false"
          data-testid="search-input-box-fake"
        />
      </SearchInputWrapper>
    )
  },
)
