let token: string;
let cmsToken: string;
let mdn: string;
let email: string;
let authToken: string;

const HOST = 'https://www.smartfren.com';
const _fw_crm_v = 'f8e06268-2a4d-4dee-daa1-bfb058b9aa5b';
const _ga = 'GA1.1.1599877944.1744965771';
const _ga_GF5MR6BLLK = 'GS1.1.1744965770.1.0.1744965770.60.0.0';
const _ga_YDY4PB0EBF = 'GS1.1.1744965770.1.0.1744965770.60.0.0';
const first_session =
  '%7B%22visits%22%3A2%2C%22start%22%3A1744965770445%2C%22last_visit%22%3A1744965771148%2C%22url%22%3A%22https%3A%2F%2Fwww.smartfren.com%2F%22%2C%22path%22%3A%22%2F%22%2C%22referrer%22%3A%22%22%2C%22referrer_info%22%3A%7B%22host%22%3A%22%22%2C%22path%22%3A%22blank%22%2C%22protocol%22%3A%22about%3A%22%2C%22port%22%3A80%2C%22search%22%3A%22%22%2C%22query%22%3A%7B%7D%7D%2C%22search%22%3A%7B%22engine%22%3Anull%2C%22query%22%3Anull%7D%2C%22prev_visit%22%3A1744965770445%2C%22time_since_last_visit%22%3A703%2C%22version%22%3A0.4%7D';
const tscookie =
  '01b5cb327f9395c12534ce39be0ee95a914aa17fcbf187e350f977635ca46bb22979928162a6f352e511c70347634f2fe2555b35d8135c0f6e44935726d6aab9be8db31ee3';
const phpSessId = 'vn55qoelve50d7cem394h1tgnv';
// API Endpoint
const tokenEp = 'api/hello';
const cmsEp = 'api/authucms';
const availablePackagesEp = 'api/available-packages';
const packageDetailEp = 'api/package-detail';
const authTokenEp = 'payment/v2/api/remote-config';
const paymentOptionsEp = 'payment/v2/api/payment-options';
const paymentOrderEp = 'payment/v2/api/payment-order';
const signInReqEp =
  'proxy/CUSTINFO_MAIN_URI/sfpas/registry/v4/signin/mdn/request';
const signInVerifyEp =
  'proxy/CUSTINFO_MAIN_URI/sfpas/registry/v4/signin/mdn/verify';
const customerInfoEp = 'proxy/CUSTINFO_URI';

type paymentMethod =
  | 'PULSA'
  | 'DANA'
  | 'SHOPEE'
  | 'QRIS'
  | 'GOPAY'
  | 'OVO'
  | 'BCAVA'
  | 'MANDIRIVA'
  | 'CIMBVA'
  | 'BNI'
  | 'SPRINT'
  | 'PERMATAVA';
type paymentOpt = {
  partner: string;
  product_code: string;
  session_id: string;
  total_payment: number;
};
type paymentOrderData = {
  type: string;
  extend_data: {
    mdn: string;
  };
  total_payment: [
    {
      id: string;
      productCode: string;
      partnerCode: string;
      typeItem: string;
      name: string;
      price: number;
      promoPrice: number;
      extendData: {
        mdn: string;
      };
    }
  ];
  customer_email: string;
  payment_method: paymentMethod;
  account_name: string;
  account_email: string;
  payment_mdn: string;
  host_name: string;
  reference_id: string;
  partner: string;
  order_id: string;
  transaction_id: string;
};

type custInfo = {
  id: string | null;
  jsonrpc: string | null;
  method: string;
  params: string[];
  my_params: string | null;
  he_params: string | null;
  channel: string | null;
};

// Get Token for using in API
async function getToken() {
  try {
    const response = await fetch(`${HOST}/${tokenEp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const jsonData = await response.json();
    return jsonData.data.token;
  } catch (error) {
    console.error(error);
  }
}

// Get Content Management System(CMS) token
async function getAuthUcms(token: string) {
  try {
    const response = await fetch(`${HOST}/${cmsEp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `fw_crm_v=${_fw_crm_v};_ga=${_ga};_ga_GF5MR6BLLK=${_ga_GF5MR6BLLK};_ga_YDY4PB0EBF=${_ga_YDY4PB0EBF};first_session=${first_session};token=${token};TS0182b4fb=${tscookie};`,
      },
    });
    const jsonData = await response.json();
    return jsonData.token;
  } catch (error) {
    console.error(error);
  }
}

// Check available packages that can be buy
async function getAvailablePackages(mdn: string) {
  try {
    const response = await fetch(`${HOST}/${availablePackagesEp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: '0',
        jsonrpc: '2.0',
        mdn,
        method: 'getWebAvailPackage',
      }),
    });
    const jsonData = await response.json();
    return jsonData.result.data;
  } catch (error) {
    console.error(error);
  }
}

// Get detail for specific package
// Ex: 1ON55RB
async function getDetailPackage(packId: string) {
  try {
    const response = await fetch(`${HOST}/${packageDetailEp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: '0',
        jsonrpc: '2.0',
        packId,
        method: 'getWebDetailPackage',
      }),
    });
    const jsonData = await response.json();
    console.log(jsonData.result.data);
    return jsonData.result.data;
  } catch (error) {
    console.error(error);
  }
}

// Remote Config
// Get Authentication Token for Payment
async function getAuthToken(token: string) {
  try {
    const response = await fetch(`${HOST}/${authTokenEp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `first_session=${first_session};token=${token};TS0182b4fb=${tscookie};`,
      },
      body: JSON.stringify({
        code: 'payment_web_options_blacklist',
      }),
    });
    const setCookie = response.headers.get('Set-Cookie');
    const authToken = setCookie?.split(';')[0].split('=')[1];
    if (!authToken) {
      throw new Error('Failed to get authentication token');
    }
    return authToken;
  } catch (error) {
    console.error(error);
  }
}

// sessionId === token
// get available payment options that can be used to pay for a product
async function getPaymentOptions(
  token: string,
  authToken: string,
  paymentOptions: paymentOpt
) {
  try {
    const response = await fetch(`${HOST}/${paymentOptionsEp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': '453',
        Cookie: `first_session=${first_session};token=${token};prod=1;staging=0;idGtag=G-GF5MR6BLLK;authToken=${authToken};TS0182b4fb=${tscookie}`,
        'Session-Type': 'hello',
      },
      body: JSON.stringify(paymentOptions),
    });

    const jsonData = await response.json();

    if (!jsonData.message || jsonData.message !== 'Sukses')
      throw new Error('Error getting payment options');
    const options = jsonData.data.options;
    const availableOptions = options
      .filter((option) => option.isEligible === true)
      .map((option) => option.method);
    return availableOptions;
  } catch (error) {
    console.error(error);
  }
}

//
async function paymentOrder(
  token: string,
  authToken: string,
  paymentData: paymentOrderData
) {
  try {
    const response = await fetch(`${HOST}/${paymentOrderEp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': '449',
        Cookie: `_fw_crm_v=${_fw_crm_v};_ga=${_ga};first_session=${first_session};token=${token}; prod=1; staging=0; idGtag=G-GF5MR6BLLK; authToken=${authToken}; _ga_YDY4PB0EBF=${_ga_YDY4PB0EBF}; afUserId=a91194ab-b15b-477e-8729-75e509075f04-p; AF_SYNC=1744983325564; session_id=${token}; TS0182b4fb=${tscookie}; _ga_GF5MR6BLLK=${_ga_GF5MR6BLLK}`,
        'Session-Type': 'hello',
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

// SingIn to get OTP
async function signInRequest(mdn: string) {
  try {
    const response = await fetch(`${HOST}/${signInReqEp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `first_session=${first_session};PHPSESSID=${phpSessId};`,
      },
      body: JSON.stringify({ mdn }),
    });
    const jsonData = await response.json();
    console.log('SIR:', jsonData);
    return jsonData;
  } catch (error) {
    console.error(error);
  }
}

// Verify SignIn with OTP to get session token
async function signInVerify(mdn: string, otp: string) {
  try {
    const response = await fetch(`${HOST}/${signInVerifyEp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `first_session=${first_session};PHPSESSID=${phpSessId};`,
      },
      body: JSON.stringify({ mdn, otp }),
    });
    const jsonData = await response.json();
    console.log('SIV:', jsonData);
    return jsonData.data.result.session_id;
  } catch (error) {
    console.error(error);
  }
}

// get customer mobile card info
async function cardInfo(custInfo: custInfo, mySfSessionId: string) {
  try {
    const response = await fetch(`${HOST}/${customerInfoEp}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Cookie: `first_session=${first_session};PHPSESSID=${phpSessId};mysf_session_id=${mySfSessionId};`,
      },
      body: JSON.stringify({
        ...custInfo,
        method: 'getSubInfoDetail',
        params: [`${mySfSessionId}`],
      }),
    });
    const jsonData = await response.json();
    if (jsonData.message !== 'Success')
      throw new Error(`${jsonData.error.message}`);
    const resultCustInfo = jsonData.result.data.resultCustinfo;
    const resultPackages = jsonData.result.data.resultPackages;
    const customerInfo = {
      nomor: resultCustInfo.mobileNo,
      balance: resultCustInfo.balance,
      actDate: resultCustInfo.actDate,
      expDate: resultCustInfo.expDate,
    };
    let activePackages = [];

    for (const paket of resultPackages) {
      activePackages.push({
        id: paket.packID,
        name: paket.packName,
        actDate: paket.packEffDate,
        expDate: paket.packExpDate,
      });
    }

    return { customerInfo, activePackages };
  } catch (error) {
    console.error(error);
  }
}

mdn = '0882xxxxxxxx';
email = 'xxx@gmail.com';
const custInfo: custInfo = {
  jsonrpc: null,
  channel: null,
  id: null,
  method: 'getAvailPackage',
  he_params: null,
  my_params: null,
  params: [],
};
// console.log('Get Token...');
// token = await getToken();
// console.log('Token: ', token);
// console.log('Get CMS Token...');
// cmsToken = await getAuthUcms(token);
// console.log('CMS Token: ', cmsToken);

// await getAvailablePackages(mdn);
// console.log('Get Auth Token...');
// authToken = await getAuthToken(token);
// console.log('Auth Token: ', authToken);
const paymentOptions: paymentOpt = {
  product_code: '1ON55RB',
  total_payment: 60500,
  session_id: token,
  partner: 'MYWEB',
};
// const paymentOptionsResponse = await getPaymentOptions(
//   token,
//   authToken,
//   paymentOptions,
// );
const paymentData: paymentOrderData = {
  type: 'buypackage',
  extend_data: {
    mdn: mdn,
  },
  total_payment: [
    {
      id: '1ON55RB',
      productCode: '1ON55RB',
      partnerCode: '',
      typeItem: 'productCode',
      name: 'ON Terus 1 Tahun - 18GB',
      price: 60500,
      promoPrice: 0,
      extendData: {
        mdn: mdn,
      },
    },
  ],
  customer_email: email,
  payment_method: 'PULSA',
  account_name: '',
  account_email: '',
  payment_mdn: mdn,
  host_name: 'www.smartfren.com',
  reference_id: '',
  partner: 'MYWEB',
  order_id: '',
  transaction_id: '',
};
// await paymentOrder(token, authToken, paymentData);

// await signInRequest(mdn);
// const mySfSessionId = await signInVerify(mdn, '717203');
