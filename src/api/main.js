import server from "@/api/request.js";
import qs from "qs";
import axios from "axios";
import { dict } from "@/utils/base";
import Vue from 'vue';

const ip = dict.ADMIN_URL;
//登录
export const login = data => {
  return server.post(ip + "/auth/login", qs.stringify(data));
};

export const httpPost = (url, data) => {
  return new Promise((reject, resolve) => {
      server.post(url, data)
        .then(resolue => {
          reject(resolue.data)
        })
        .catch(error => {
          resolve(error)
        });
  })
}
export const httpGet = (url, params) => {
  return new Promise((reject, resolve) => {
      server.get(url, { params })
        .then(resolue => {
          reject(resolue.data)
        })
        .catch(error => {
          resolve(error)
        });
  })
}

export const httpPut = (url, data) => {
  return new Promise((reject, resolve) => {
    server.put(url, data)
      .then(resolue => {
        reject(resolue.data)
      })
      .catch(error => {
        resolve(error)
      });
  })
}

export const httpDelete = (url, params) => {
  return new Promise((reject, resolve) => {
      server.delete(url, { params })
        .then(resolue => {
          reject(resolue.data)
        })
        .catch(error => {
          resolve(error)
        });
  })
}

export const httpGetFile = (url, params) => {
  return new Promise((reject, resolve) => {
    server({
        url: url,
        method: 'GET',
        params: params,
        responseType: 'blob'
    }).then(resolue => {
        reject(resolue)
    }).catch(error => {
        resolve(error)
    });
  })
}

let http = {
  get: httpGet,
  post: httpPost,
  put: httpPut,
  delete: httpDelete,
  getFile: httpGetFile,
}

Vue.prototype.$http = http

