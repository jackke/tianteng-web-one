import server from "@/api/request.js";
import qs from "qs";
import Vue from 'vue';

const API_URL = process.env.VUE_APP_BASE_URL;

//登录
export const login = data => {
  return server.post(API_URL + "/auth/login", qs.stringify(data));
};

export const httpPost = (url, data) => {
  return new Promise((reject, resolve) => {
      server.post(`${API_URL }${url}`, data)
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
      server.get(`${API_URL }${url}`, { params })
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
    server.put(`${API_URL }${url}`, data)
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
      server.delete(`${API_URL }${url}`, { params })
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
            url: `${API_URL }${url}`,
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
export const httpPostFile = (url, params) => {
    return new Promise((reject, resolve) => {
        server({
            url: `${API_URL }${url}`,
            method: 'POST',
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
  postFile: httpPostFile
}

Vue.prototype.$http = http

