const calcMedian = (ordersChecks) => {
  const ordersAmounts = ordersChecks.map(elem => Math.trunc((Number(elem.data.total)) * 100));
  ordersAmounts.sort((a, b) => a - b);
  let median;
  const { length } = ordersAmounts;
  const middle = length / 2;
  if (length % 2 === 0) {
    median = (ordersAmounts[middle] + ordersAmounts[middle - 1]) / 2;
  } else {
    median = ordersAmounts[Math.floor(middle)];
  }
  return median;
};


export default function calculateStatistics(data) {
  const statistics = data.filter(element => element.display)
    .reduce((acc, element) => {
      const total = Number(element.data.total) * 100;
      if (element.data.userGender === 'Male') {
        acc.totalMale += total;
        acc.countMale += 1;
        acc.count += 1;
      }
      acc.totalAll += total;
      return acc;
    }, {
      totalMale: 0, countMale: 0, totalAll: 0, count: 0,
    });

  statistics.countFemale = statistics.count - statistics.countMale;
  statistics.totalFemale = ((statistics.totalAll - statistics.totalMale) / 100).toFixed(2);
  statistics.totalMale = (statistics.totalMale / 100).toFixed(2);
  statistics.totalAll = (statistics.totalAll / 100).toFixed(2);
  statistics.averageCheck = (statistics.totalAll / statistics.count).toFixed(2);
  statistics.averageCheckMale = (statistics.totalMale / statistics.countMale).toFixed(2);
  statistics.averageCheckFemale = (statistics.totalFemale / statistics.countFemale).toFixed(2);

  statistics.median = ((calcMedian(data)) / 100).toFixed(2);
  return statistics;
}
