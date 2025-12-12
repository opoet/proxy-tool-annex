/*
  Author: opoet
  Date: 2025-12-12
  Description: Emby verify rewrite
*/

const REWRITE_RULES = {
  "/admin/service/registration/validateDevice":
    '{"cacheExpirationDays":365,"message":"Device Valid","resultCode":"GOOD"}',
  "/admin/service/registration/validate":
    '{"featId":"","registered":true,"expDate":"2099-01-01","key":""}',
  "/admin/service/registration/getStatus":
    '{"deviceStatus":"0","planType":"Lifetime","subscriptions":{}}',
  "/admin/service/appstore/register":
    '{"featId":"","registered":true,"expDate":"2099-01-01","key":""}',
  "/emby/Plugins/SecurityInfo":
    '{"SupporterKey":"","IsMBSupporter":true}',
};

const URL_PATTERN = /https?:\/\/mb3admin\.com(\/[^?#]*)/;

function crackEmbyVerifyRes(response, body) {
  response.status = 200;
  response.headers = {
    ...response.headers,
    "Content-Type": "application/json; charset=utf-8",
  };
  response.body = body;
  return response;
}

function processResponse(response) {
  const match = $request.url.match(URL_PATTERN);
  if (match) {
    const urlPath = match[1].replace(/\/$/, "");
    const rewriteBody = REWRITE_RULES[urlPath];
    if (rewriteBody) {
      crackEmbyVerifyRes(response, rewriteBody);
      console.log(`[Emby Crack] Rewrite: ${urlPath}`);
    }
  }
  return response;
}

$done(processResponse($response));
