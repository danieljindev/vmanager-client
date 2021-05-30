
export enum TypeNames {
  Income = 1,
  Expenditure = 2
}

export enum TypeColors {
  '#108ee9' = 1,
  '#f50' = 2
}

export const TYPES = [
  { name: 'Income', value: 1, symbol: '+', color: '#666' },
  { name: 'Expenditure', value: 2, symbol: '-', color: '#f50' }
]

export const OPTION_TYPES = [
  { name: 'All', value: '' },
  ...TYPES
]
