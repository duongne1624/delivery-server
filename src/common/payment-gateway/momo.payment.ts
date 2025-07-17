import * as crypto from 'crypto';
import * as qs from 'qs';
import { AppConfig } from '@config/app.config';
import { format } from 'date-fns-tz';

interface CreateMomoUrlInput {
  orderId: string;
  amount: number;
  orderDescription: string;
}

export function createMomoPaymentUrl(
  input: CreateMomoUrlInput,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clientIp: string
): string {
  const {
    MOMO_PARTNER_CODE,
    MOMO_ACCESS_KEY,
    MOMO_SECRET_KEY,
    MOMO_REQUEST_URL,
    MOMO_RETURN_URL,
  } = AppConfig.momo;

  const requestId = input.orderId;
  const orderId = input.orderId;
  const orderInfo = input.orderDescription.replace(/[^a-zA-Z0-9 -]/g, '');
  const amount = Math.round(input.amount).toString();
  const requestType = 'captureWallet';
  const redirectUrl = MOMO_RETURN_URL;
  const ipnUrl = MOMO_RETURN_URL;
  const extraData = '';
  const requestTime = format(new Date(), 'yyyyMMddHHmmss', {
    timeZone: 'Asia/Ho_Chi_Minh',
  });

  const rawSignature = `accessKey=${MOMO_ACCESS_KEY}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${MOMO_PARTNER_CODE}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestTime=${requestTime}&requestType=${requestType}`;

  console.log('Momo Sign Data:', rawSignature);

  const signature = crypto
    .createHmac('sha256', MOMO_SECRET_KEY)
    .update(Buffer.from(rawSignature, 'utf-8'))
    .digest('hex');

  const momoParams: Record<string, string> = {
    partnerCode: MOMO_PARTNER_CODE,
    accessKey: MOMO_ACCESS_KEY,
    requestId,
    amount,
    orderId,
    orderInfo,
    redirectUrl,
    ipnUrl,
    extraData,
    requestType,
    requestTime,
    signature,
  };

  const paymentUrl = `${MOMO_REQUEST_URL}?${qs.stringify(momoParams, { encode: true })}`;
  console.log('Momo Payment URL:', paymentUrl);

  return paymentUrl;
}
