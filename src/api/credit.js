import getConfig from "constant/envCofnig";
import { formatTimeWithUTC } from "utils/time";

const PATH_PREFIX = `${getConfig().INDEXER_ENDPOINT}/score_lend`;

export const getVaultData = () => {
  return fetch(`${PATH_PREFIX}/total_borrow`).then((res) => res.json());
};

const formatRecord = (item) => {
  return {
    lendId: item.lendId,
    lendIdDisplay: String(8800000 + Number(item.lendId)),
    status: item.lendStatus,
    debtor: item.debtor,
    borrowAmount: Number(item.borrowAmount),
    borrowTime: formatTimeWithUTC(item.borrowTimestamp),
    borrowTx: item.borrowTx,
    rate: `${Number(item.interestRate) * 100}`,
    interestDays: item.interestDays,
    interestAmount: Number(item.interestAmount),
    paybackTime: formatTimeWithUTC(item.paybackTimestamp),
    paybackTx: item.paybackTx,
    overdueTime: formatTimeWithUTC(item.overdueTimestamp),
    mortgageSCRAmount: Number(item.mortgageSCRAmount),
  };
};

export const getBorrowList = (data) => {
  const queryData = new URLSearchParams(data);
  return fetch(`${PATH_PREFIX}/lends?${queryData.toString()}`)
    .then((res) => res.json())
    .then((res) => {
      return {
        ...res,
        data: res.data.map((item) => formatRecord(item)),
      };
    });
};

export const getRecordDetail = (id) => {
  return fetch(`${PATH_PREFIX}/lend/${id}`)
    .then((res) => res.json())
    .then((item) => formatRecord(item));
};
