# Passports payment stub

Simple payment form for stubbed payment service.

## Routes

### POST '/'
Requires one required field, `redirectionData`. `redirectionData` should be a stringified JSON object containing `amount` as a number.

### GET '/payment'
Only accessible after a successful POST to '/'.

No fields on this page are mandatory but can be filled (for example by automated tests). Submitting the form POSTs to the referrer website with a successful payment response.

## Use the service

This app is deployed on https://passports-payment-stub.cloudapps.digital/ (expect a 405 error though as the index requires a POST).
