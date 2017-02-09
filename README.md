# Passports payment stub

Simple payment form for stubbed payment service.

## Routes

### POST '/'
Requires one required field, `redirectionData`. `redirectionData` should be a stringified JSON object containing `amount` as a number.

### GET '/payment'
Only accessible after a successful POST to '/'.

No fields on this page are mandatory but can be filled (for example by automated tests). Submitting the form POSTs to the referrer website with a successful payment response.

## Use the payment stub

This app is deployed on https://passports-payment-stub.cloudapps.digital/ (expect a 405 error though as the index requires a POST).

## Test app

There's a test app to use with the payment stub. Run `npm run start:test` to POST and return to a locally running version of the app or `npm run start:test-remote` to POST and return to the service running on the remote server (https://passports-payment-stub.cloudapps.digital/).

## Deployments

The payment stub is deployed on GOV.UK's PaaS. [Read the PaaS docs](https://docs.cloud.service.gov.uk/#overview).

Get yourself access so that you can deploy. Due to current IP restrictions, this app can only be deployed from the Home Office networks. [Read about current limitations](https://docs.cloud.service.gov.uk/#limitations).

[Read about deploying Node.js apps using GOV.UK's PaaS](https://docs.cloud.service.gov.uk/#deploying-apps).

## Deploy

Login
```
cf login -u YOUR EMAIL ADDRESS
```

Set target
```
cf target -o hmpo-trial -s sandbox
```

Push
```
cf push passports-payment-stub
```
