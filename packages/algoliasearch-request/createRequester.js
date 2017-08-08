// @flow
import RequestHosts from './hosts';
// const RequestHosts = () => {};
import type {
  AppId,
  ApiKey,
  RequestOptions,
  RequestArguments,
} from '../algoliasearch/src/types';
import type { HttpModule, Timeouts, Hosts } from './types';

type Args = {|
  appId: AppId,
  apiKey: ApiKey,
  httpRequester: HttpModule,
  options: {|
    timeouts?: Timeouts,
    extraHosts?: Hosts,
  |},
|};

const stringify = qs => JSON.stringify(qs); // todo: use proper url stringify

class Requester {
  hosts: RequestHosts;
  apiKey: ApiKey;
  appId: AppId;
  requestOptions: RequestOptions;
  requester: HttpModule;

  constructor({ appId, apiKey, httpRequester, options }: Args) {
    this.hosts = new RequestHosts({ appId, ...options });
    this.appId = appId;
    this.apiKey = apiKey;
    this.requester = httpRequester;
  }

  setOptions(fn: RequestOptions => RequestOptions): RequestOptions {
    const oldOptions = this.requestOptions;
    const newOptions = fn(oldOptions);
    this.requestOptions = newOptions;
    return newOptions;
  }

  request(arg: RequestArguments) {
    const { method, path, qs, body, options, requestType: type } = arg;
    const hostname = this.hosts.getHost({ type });
    const timeout = this.hosts.getTimeout({ retry: 0, type });

    const pathname = path + stringify(qs);
    const url = { hostname, pathname };

    return new Promise((resolve, reject) => {
      this.requester({
        body,
        method,
        url,
        timeout,
        options,
      })
        .then(resolve)
        .catch(reject);
    });
  }
}

export default function createRequester(args: Args) {
  const _r = new Requester(args);
  const requester = _r.request;
  requester.setOptions = _r.setOptions;
  requester.options = _r.requestOptions;
  return requester;
}
