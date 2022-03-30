import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { ConnectorService } from '@core/services/connector/connector.service';

export class PendingRequest {
  url: string;
  method: string;
  options: any;
  subscription: Subject<any>;

  constructor(url: string, method: string, options: any, subscription: Subject<any>) {
    this.url = url;
    this.method = method;
    this.options = options;
    this.subscription = subscription;
  }
}

@Injectable()
export class BackendService {
  private requests$ = new Subject<any>();
  private queue: PendingRequest[] = [];

  constructor(private _connectorService: ConnectorService) {
    this.requests$.subscribe((request: any) => this.execute(request));
  }

  /** Call this method to add your http request to queue */
  invoke(url: string, method: string, params: {}, options: {}) {
    return this.addRequestToQueue(url, method, params, options);
  }

  private execute(requestData: any) {
    //One can enhance below method to fire post/put as well. (somehow .finally is not working for me)
    const req = this._connectorService.mGet(requestData.url)
      .subscribe((res: any) => {
        const sub = requestData.subscription;
        sub.next(res);
        this.queue.shift();
        this.startNextRequest();
      });
  }

  private addRequestToQueue(url: string, method: string, params: {}, options: {}) {
    const sub = new Subject<any>();
    const request = new PendingRequest(url, method, options, sub);

    this.queue.push(request);
    if (this.queue.length === 1) {
      this.startNextRequest();
    }
    return sub;
  }

  private startNextRequest() {
    // get next request, if any.
    if (this.queue.length > 0) {
      this.execute(this.queue[0]);
    }
  }
}
