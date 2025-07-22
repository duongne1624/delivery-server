import * as crypto from 'crypto';
import * as qs from 'qs';
import { AppConfig } from '@config/app.config';
import { format } from 'date-fns-tz';

interface CreateVnpayUrlInput {
  orderId: string;
  amount: number; // Đơn vị VND (ex: 80000 -> 80000 VND)
  orderDescription: string;
}

export function createVnpayPaymentUrl(
  input: CreateVnpayUrlInput,
  clientIp: string
): string {
  const { VNP_TMNCODE, VNP_HASHSECRET, VNP_URL, VNP_RETURN_URL } =
    AppConfig.vnpay;

  if (!VNP_TMNCODE || !VNP_HASHSECRET || !VNP_URL || !VNP_RETURN_URL) {
    throw new Error('VNPAY config is missing or invalid');
  }

  if (!input.orderId || !input.amount || !input.orderDescription) {
    throw new Error('Missing input data for VNPAY URL');
  }

  const vnp_TxnRef = input.orderId;
  const vnp_Amount = Math.round(input.amount * 100).toString(); // nhân 100 vì VNPAY yêu cầu đơn vị là VND * 100
  const vnp_Locale = 'vn';
  const vnp_CurrCode = 'VND';
  const vnp_Command = 'pay';
  const vnp_OrderInfo = input.orderDescription;
  const vnp_OrderType = 'other';
  const vnp_IpAddr = clientIp === '::1' ? '127.0.0.1' : clientIp;
  const vnp_CreateDate = format(new Date(), 'yyyyMMddHHmmss', {
    timeZone: 'Asia/Ho_Chi_Minh',
  });

  // Danh sách tham số cần ký
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

  // B1: Sắp xếp tham số theo key A-Z
  const sortedParams = Object.keys(vnp_Params)
    .sort()
    .reduce((result: Record<string, string>, key: string) => {
      result[key] = vnp_Params[key];
      return result;
    }, {});

  // B2: Tạo chuỗi signData
  const signData = Object.entries(sortedParams)
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  // B3: Tạo chữ ký secure hash
  const secureHash = crypto
    .createHmac('sha512', VNP_HASHSECRET)
    .update(Buffer.from(signData, 'utf-8'))
    .digest('hex');

  // B4: Gắn secure hash vào tham số
  sortedParams['vnp_SecureHash'] = secureHash;

  // B5: Tạo URL cuối
  const paymentUrl = `${VNP_URL}?${qs.stringify(sortedParams, { encode: true })}`;

  return paymentUrl;
}
