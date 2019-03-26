export default function prepareData(data) {
  const users = data.users.reduce((acc, element) => {
    const userInfo = {
      userBirthday: element.birthday,
      userCompanyId: element.company_id,
      userFirstName: element.first_name,
      userGender: element.gender,
      userAvatar: element.avatar,
      userLastName: element.last_name,
    };
    acc[element.id] = userInfo;
    return acc;
  }, {});
  const companies = data.companies.reduce((acc, element) => {
    const companyInfo = {
      companyTitle: element.title,
      companyIndustry: element.industry,
      companyUrl: element.url,
    };
    acc[element.id] = companyInfo;
    return acc;
  }, {});
  const { orders } = data;

  const allOrders = orders.map((element) => {
    const orderInfo = {
      id: element.id,
      userId: element.user_id,
      cardNumber: element.card_number,
      cardType: element.card_type,
      createdAt: element.created_at,
      transactionId: element.transaction_id,
      orderIp: element.order_ip,
      total: element.total,
      country: element.order_country,
    };

    const userId = element.user_id;
    const userInfo = users[userId] || {};
    const { userCompanyId } = userInfo;
    const companyInfo = (userCompanyId && companies[userCompanyId])
      ? companies[userCompanyId]
      : {};
    const order = { ...orderInfo, ...userInfo, ...companyInfo };
    return order;
  });
  return allOrders;
}
