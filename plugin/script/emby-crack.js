/*
  Author: opoet
  Date: 2025-12-12
  Description: Emby verify rewrite
*/

const REWRITE_RULES = {
  "/admin/service/registration/validateDevice":
    '{"cacheExpirationDays":999,"message":"Device Valid","resultCode":"GOOD"}',
  "/admin/service/registration/validate":
    '{"featId":"","registered":true,"expDate":"2099-01-01","key":""}',
  "/admin/service/registration/getStatus":
    '{"planType":"Lifetime","deviceStatus":0,"subscriptions":[]}',
  "/admin/service/appstore/register":
    '{"featId":"","registered":true,"expDate":"2099-01-01","key":""}',
  "/emby/Plugins/SecurityInfo":
    '{"SupporterKey":"","isMBSupporter":true}',
};

const URL_PATTERN = /https?:\/\/mb3admin\.com(\/[^?#]+)/;

function crackEmbyVerifyRes(response, body) {
  return Object.assign(response, {
    status: 200,
    headers: {
      ...response.headers,
      "Content-Type": "application/json",
      "Charset": "utf-8",
    },
    body,
  });
}

function processResponse(response) {
  const match = $request.url.match(URL_PATTERN);
  if (match) {
    const urlPath = match[1];
    const rewriteBody = REWRITE_RULES[urlPath];
    if (rewriteBody) {
      crackEmbyVerifyRes(response, rewriteBody);
      console.log(`Rewrite Emby verify: ${urlPath}`);
    }
  }
  return response;
}

$done(processResponse($response));
