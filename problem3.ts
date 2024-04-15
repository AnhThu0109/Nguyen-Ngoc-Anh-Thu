import React, { useMemo } from 'react';
import { BoxProps } from 'path'; // replace this with the actual library path
import { useWalletBalances, usePrices } from 'custom-hooks-path'; // replace this with the actual custom hooks path
import WalletRow from './WalletRow'; // replace this with the actual path to WalletRow component

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; //Add blockchain property to distinguish between different blockchains
}

//FormattedWalletBalance extends WalletBalance by inheriting its properties and adds an additional property called formatted
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

interface Props extends BoxProps {}

//Moved the getPriority function outside the component for better readability and reusability.
const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case 'Osmosis':
      return 100;
    case 'Ethereum':
      return 50;
    case 'Arbitrum':
      return 30;
    case 'Zilliqa':
    case 'Neo': //Combine same priority because Zilliqa and Neo return 20
      return 20;
    default:
      return -99;
  }
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  //Simplified the sorting logic 
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => balance.amount > 0) //Filter out non-positive balances
      .sort((lhs: WalletBalance, rhs: WalletBalance) => getPriority(rhs.blockchain) - getPriority(lhs.blockchain)); //Sort balances by priority
  }, [balances, prices]);

  const formattedBalances = sortedBalances.map((balance: WalletBalance) => ({
    ...balance,
    formatted: balance.amount.toFixed(),
  }));

  const rows = formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow
        className={classes.row}
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};

export default WalletPage;
