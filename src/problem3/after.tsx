import { FC, useMemo } from "react";
import useWalletBalances from "./useWalletBalances";
import usePrices from "./usePrices";
import WalletRow from "./WalletRow";

interface WalletBalance {
  blockchain: string; // Added this as it's referenced but missing in the original code
  currency: string;
  amount: number;
}
interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
  usdValue: number;
}

const blockchainPriority: Record<string, number> = {
  Osmosis: 100,
  Ethereum: 50,
  Arbitrum: 30,
  Zilliqa: 20,
  Neo: 20,
};

// remove this cause there is no BoxProps
// interface Props extends BoxProps {}

interface Props {
  classes: string; // Assumed to be a CSS class or style-related prop
}

const MAGIC_NUMBER = -99;
const MIN_BALANCE_AMOUNT = 0;

const WalletPage: FC<Props> = ({ classes, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // lhsPriority: Removed unnecessary checks and unused variables

  // Used a blockchainPriority object for priorities, making it easier to add or update blockchain priorities without modifying the function.
  const getPriority = (blockchain: string): number =>
    blockchainPriority[blockchain] ?? -99;

  const __filteredBalances: WalletBalance[] = useMemo(() => {
    return balances.filter(
      (balance) =>
        getPriority(balance.blockchain) > MAGIC_NUMBER &&
        balance.amount > MIN_BALANCE_AMOUNT
    );
  }, [balances]);

  const __sortedBalances: WalletBalance[] = useMemo(() => {
    return __filteredBalances.sort(
      (a, b) => getPriority(b.blockchain) - getPriority(a.blockchain)
    );
  }, [__filteredBalances]);

  const __formattedBalances: FormattedWalletBalance[] = useMemo(() => {
    return (
      __sortedBalances.map((balance) => ({
        ...balance,
        // consistent formatting of 2
        formatted: balance.amount.toFixed(2), // Ensuring two decimal places to actually formatted something than convert to string only
        // add this because WalletRow component need it
        usdValue: prices[balance.currency] * balance.amount,
      })),
      [__sortedBalances]
    );
  });

  return (
    <div {...rest}>
      {__formattedBalances.map(
        (balance: FormattedWalletBalance, index: number) => {
          return (
            <WalletRow
              key={index}
              // Not assuming this is styled, so I just use it as a class prop from parent component
              className={classes}
              amount={balance.amount}
              usdValue={balance.usdValue}
              formattedAmount={balance.formatted}
            />
          );
        }
      )}
    </div>
  );
};

// need the export default to read this file
export default WalletPage;
