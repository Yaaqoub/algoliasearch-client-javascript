// @flow

// todo: don't disable when doing it properly later
/* eslint-disable */

import parseOptions from '../parseOptions.js';
import type { AlgoliaRequesterError } from 'algoliasearch-errors';
import type { Response, RequesterArgs } from 'algoliasearch-requester';

export default function httpRequester({
  body,
  method,
  url,
  requestOptions,
  timeout: originalTimeout,
  requestType,
  signal: AbortSignal,
}: RequesterArgs): Promise<Response> {
  const { queryStringOrBody, headers: extraHeaders, timeouts } = parseOptions(
    requestOptions
  );
  const timeout = timeouts[requestType] || originalTimeout;

  // $FlowFixMe --> this is a global
  const controller = new AbortController();

  return fetch(`https://${url}`);
}
