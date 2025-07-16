import * as crypto from 'crypto';
import * as qs from 'qs';
import { AppConfig } from '@config/app.config';
import { format } from 'date-fns';

interface CreateVnpayUrlInput {
  orderId: string;
  amount: number;
  orderDescription: string;
}

export function createVnpayPaymentUrl(
  input: CreateVnpayUrlInput,
  clientIp: string
): string {
  const { VNP_TMNCODE, VNP_HASHSECRET, VNP_URL, VNP_RETURN_URL } =
    AppConfig.vnpay;

  const vnp_TxnRef = input.orderId;
  const vnp_Amount = Math.round(input.amount * 100).toString();
  const vnp_Locale = 'vn';
  const vnp_CurrCode = 'VND';
  const vnp_Command = 'pay';
  const vnp_OrderInfo = input.orderDescription;
  const vnp_OrderType = 'other';
  const vnp_IpAddr = clientIp === '::1' ? '127.0.0.1' : clientIp;
  const vnp_CreateDate = format(new Date(), 'yyyyMMddHHmmss');

  const vnp_Params: Record<string, string> = {
    vnp_Version: '2.1.0',
    vnp_Command,
    vnp_TmnCode: VNP_TMNCODE,
    vnp_Locale,
    vnp_CurrCode,
    vnp_TxnRef,
    vnp_OrderInfo,
    vnp_OrderType,
    vnp_Amount,
    vnp_ReturnUrl: VNP_RETURN_URL,
    vnp_IpAddr,
    vnp_CreateDate,
  };

  // B1: Sort by key
  const sortedParams = sortObject(vnp_Params);

  // B2: Tạo dữ liệu để ký, không encode
  const signData = Object.keys(sortedParams)
    .map((key) => `${key}=${sortedParams[key]}`)
    .join('&');

  // B3: Ký HMAC SHA512
  const secureHash = crypto
    .createHmac('sha512', VNP_HASHSECRET)
    .update(signData, 'utf-8')
    .digest('hex');

  sortedParams['vnp_SecureHash'] = secureHash;

  // B4: Build final URL
  const paymentUrl = `${VNP_URL}?${qs.stringify(sortedParams, { encode: false })}`;
  return paymentUrl;
}

function sortObject(obj: Record<string, string>) {
  const sorted: Record<string, string> = {};
  const keys = Object.keys(obj).sort();
  for (const key of keys) {
    sorted[key] = obj[key];
  }
  return sorted;
}
