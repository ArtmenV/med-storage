import Decimal from 'decimal.js-light';

export default (sum: number | Decimal, taxRate: number): number => (
    Number(new Decimal(sum).div(1 + taxRate).toFixed(2))
);
