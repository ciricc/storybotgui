
import config from './config';

import { fetch } from 'whatwg-fetch';
import $ from 'jquery';

export default class RestClient {

  constructor (ipc) {
    this.handler = () => {}
    this.qeue = [];
    this.ipc = ipc;
  }

  withErrorHandler (a) {
    this.handler = a;
    this._token = '';
    return this;
  }

  serialize (obj, prefix) {
    let str = [], p;
    for (p in obj) {
      if (obj.hasOwnProperty(p)) {
        let k = prefix ? prefix + "[" + p + "]" : p,
          v = obj[p];
        str.push((v !== null && typeof v === "object") ?
          this.serialize(v, k) :
          encodeURIComponent(k) + "=" + encodeURIComponent(v));
      }
    }
    return str.join("&");
  }

  async prepareData (method, query={}, uniq=false, type='get', isFile=false) {
    if (this.token) 
        query.token = this.token
    
    if (uniq) query.u = new Date().getTime();
    
    let headers = {}
    let props = {}

    if (type === "post") {
      headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }

      props.body = (isFile) ? query : JSON.stringify(query);
      query = {}
    }
    query = this.serialize(query);
    query = query ? `?${query}` : '';

    return [`${config.api}${method}${query}`, {
      method: type === 'get' ? "GET" : "POST",
      mode: 'cors',
      headers: {
        'Vk-Params': window.location.search.substring(1),
        ...headers
      },
      ...props
    }]
  } 

  /** Makes other fetch custom query */
  async makeQuery (url, data) {
    let qeueIndex = this.qeue.indexOf(url + this.serialize(data));
    if (qeueIndex !== -1) throw new Error('Please, wait');
    
    qeueIndex = this.qeue.length;
    this.qeue.push(url + this.serialize(data));

    return new Promise((resolve, reject) => {
      let response = '';
      fetch(url, data).then(async (res) => {

        response = await res.text();
        this.removeFromQeue(qeueIndex);

        res = JSON.parse(response);
        
        if (res.error) {
          this.handler(res)
          return reject(res)
        }
        return resolve(res.response);
      }).catch((r) => {

        let err = new String('Произошла ошибка');
        
        err.response = response;
        err.isServerError = true;
        
        this.removeFromQeue(qeueIndex);

        if (this.handler) {
          this.handler(err)
          return reject(err)
        }
        return reject(err);
      });
    })
  }

  removeFromQeue (qeueIndex=-1) {
    setTimeout(() => {
      this.qeue.splice(qeueIndex, 1);
      console.log(this.qeue)
    }, 550);
  }

  async makeQueryAjax (data) {
    return new Promise((resolve, reject) => {
      let response = '';
      
      data.success = (response) => {
        let res = response;
        
        if (res.error) {
          this.handler(res)
          return reject(res)
        }

        return resolve(res.response);
      }

      data.error = (xhr, response, a) => {
        let err = new String('Произошла ошибка');
        err.response = response;
        err.isServerError = true;
        
        if (this.handler) {
          this.handler(err)
          return reject(err)
        }

        return reject(err);
      }

      data.xhr = function () {
        let xhr = $.ajaxSettings.xhr()
        data.xhrLoads(xhr);
        return xhr;
      }

      $.ajax(data);
    })
  }
    
  /** Makes GET query to REST API */
  async get (method, query = {}, uniq=false)  {
    console.log('[API] call get to ', method);
    return new Promise(async (resolve, reject) => {
      
      if (this.ipc) {
        console.log(method + "-response");
        this.ipc.on(method + "-response", (_, res) => {
          console.log(res);
          if (res.error) {
            reject(res)
          } else {
            resolve(res);
          }
        });
        this.ipc.send(method, query);
      } else {
        let [url, data] = await this.prepareData(method, query, uniq);
        return this.makeQuery(url, data).then(resolve, reject);
      }
    });
  }

  /** Makes POST query to REST API */
  async post (method, query = {}, uniq=false)  {
    console.log('[API] call post to ', method)
    return new Promise(async (resolve, reject) => {
      let [url, data] = await this.prepareData(method, query, uniq, "post");
      return this.makeQuery(url, data).then(resolve, reject);
    });
  }

  /** Makes uploading file to server */
  async uploadFile (method, file, uniq=false, field='file', paramsAjax={}) {
    let form = new FormData();
    
    form.append(field, file);

    return new Promise(async (resolve, reject) => {
      let [url, data] = await this.prepareData(method, form, uniq, "post", true);
      
      data.url = url;
      data = {...paramsAjax, ...data};
      data.headers['Content-Type'] = undefined;
      data.headers['Accept'] = undefined;

      data = {
        ...paramsAjax,
        contentType: false,
        processData: false,
        type: data.method,
        url: data.url,
        headers: data.headers,
        data: form,
        cache: false
      }

      return this.makeQueryAjax(data).then(resolve, reject);

    });
  }

  setAuthToken (token='') {
    this._token = token;
  }
}
