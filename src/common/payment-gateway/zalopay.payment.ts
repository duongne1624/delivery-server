import { AppConfig } from '@config/app.config';
import { HttpService } from '@nestjs/axios';
import { BadRequestException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { createHmac } from 'crypto';

interface CreateZaloPayUrlInput {
  orderId: string;
  amount: number;
  orderDescription: string;
  return_url?: string;
}

export async function createZaloPayPaymentUrl(
  input: CreateZaloPayUrlInput,
  clientIp: string,
  httpService: HttpService
): Promise<string> {
  const {
    ZALOPAY_APP_ID,
    ZALOPAY_KEY1,
    ZALOPAY_REQUEST_URL,
    ZALOPAY_RETURN_URL,
  } = AppConfig.zalopay;
  const now = new Date(Date.now());

  const year = now.getFullYear().toString().slice(-2);
  const month = ('0' + (now.getMonth() + 1)).slice(-2);
  const day = ('0' + now.getDate()).slice(-2);

  const formattedDate = `${year}${month}${day}`;

  const appTransId = `${formattedDate}_${input.orderId}`;
  const amount = Math.round(input.amount).toString();
  const description = input.orderDescription.replace(/[^a-zA-Z0-9 -]/g, '');
  const appId = ZALOPAY_APP_ID;
  const appUser = 'Thái Dương';
  const appTime = Date.now();
  const embedData = JSON.stringify({});
  const items = JSON.stringify([]);
  const bankCode = '';
  const callbackUrl = ZALOPAY_RETURN_URL;

  const rawSignature = `${appId}|${appTransId}|${appUser}|${amount}|${appTime}|${embedData}|${items}`;
  const mac = createHmac('sha256', ZALOPAY_KEY1)
    .update(Buffer.from(rawSignature, 'utf-8'))
    .digest('hex');

  const zaloParams = {
    app_id: parseInt(appId, 10),
    app_user: appUser,
    app_time: parseInt(appTime.toString(), 10),
    amount: parseInt(amount, 10),
    app_trans_id: appTransId,
    bank_code: bankCode,
    embed_data: embedData,
    item: items,
    callback_url: callbackUrl,
    description,
    mac,
    return_url: input.return_url,
  };

  try {
    console.log('ZaloPay Request Params:', zaloParams);
    const response = await firstValueFrom(
      httpService.post(ZALOPAY_REQUEST_URL, zaloParams)
    );
    const data = response.data;
    console.log('ZaloPay Response:', data);

    if (data.return_code !== 1) {
      throw new BadRequestException(
        `Failed to create ZaloPay order: ${data.return_message} (sub_return_code: ${data.sub_return_code})`
      );
    }
    return data.order_url;
  } catch (error) {
    console.error('ZaloPay Error:', error.response?.data || error.message);
    throw new BadRequestException(
      `Failed to create ZaloPay payment URL: ${error.message}`
    );
  }
}
