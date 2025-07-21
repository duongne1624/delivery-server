import * as crypto from 'crypto';
import * as qs from 'qs';
import { AppConfig } from '@config/app.config';

interface CreateZaloPayUrlInput {
  orderId: string;
  amount: number;
  orderDescription: string;
}

export function createZaloPayPaymentUrl(
  input: CreateZaloPayUrlInput,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  clientIp: string
): string {
  const {
    ZALOPAY_APP_ID,
    ZALOPAY_KEY1,
    ZALOPAY_REQUEST_URL,
    ZALOPAY_RETURN_URL,
  } = AppConfig.zalopay;

  const appTransId = `${Date.now()}_${input.orderId}`;
  const amount = Math.round(input.amount).toString();
  const description = input.orderDescription.replace(/[^a-zA-Z0-9 -]/g, '');
  const appId = ZALOPAY_APP_ID;
  const appUser = 'user123';
  const appTime = Date.now();
  const embedData = JSON.stringify({});
  const items = JSON.stringify([]);
  const bankCode = '';
  const callbackUrl = ZALOPAY_RETURN_URL;

  const rawSignature = `app_id=${appId}&app_trans_id=${appTransId}&app_time=${appTime}&amount=${amount}&app_user=${appUser}&description=${description}&embed_data=${embedData}&items=${items}&bank_code=${bankCode}&callback_url=${callbackUrl}`;

  console.log('ZaloPay Sign Data:', rawSignature);

  const mac = crypto
    .createHmac('sha256', ZALOPAY_KEY1)
    .update(Buffer.from(rawSignature, 'utf-8'))
    .digest('hex');

  const zaloParams: Record<string, string> = {
    app_id: appId,
    app_trans_id: appTransId,
    app_user: appUser,
    app_time: appTime.toString(),
    amount,
    description,
    embed_data: embedData,
    items,
    bank_code: bankCode,
    callback_url: callbackUrl,
    mac,
  };

  const paymentUrl = `${ZALOPAY_REQUEST_URL}?${qs.stringify(zaloParams, { encode: true })}`;
  console.log('ZaloPay Payment URL:', paymentUrl);

  return paymentUrl;
}
