import axios from 'axios';
import Qs from 'qs';

var refreshNum = 0;
let context = null;

const http = axios.create({
  // baseURL: process.env.VUE_APP_BASE_URL,
  baseURL:
    localStorage.getItem('useApiUrl') || JSON.parse(process.env.VUE_APP_BASE_URL)['c#']
});

function apiAxios(method, url, params, flag = 2, loginStatus = 'NoAuth', response) {
  var isRefresh = false;
  var refreshOver = false;

  if (loginStatus == 'mustAuth') {
    const accessToken1 = localStorage.getItem('accessToken');

    const expires_in1 = localStorage.getItem('expireTime'); //时间戳

    const nowData = new Date();
    // 当前时间的时间戳
    const timeStrap = nowData.getTime();
    // 未登录过
    if (!accessToken1 && !expires_in1) {
      //
      console.log('未登录过');
    } else if (timeStrap > Number(expires_in1) && accessToken1) {
      //已过期
      console.log('过期');
      isRefresh = true;

      refreshNum++;
      // console.log(refreshNum)
      if (refreshNum == 1) {
        const dataParams = {
          accessToken: localStorage.getItem('accessToken'),
          refreshToken: localStorage.getItem('refreshToken')
        };

        axios
          .post(
            localStorage.getItem('useApiUrl') + '/user/refresh-token',
            Qs.stringify(dataParams)
          )
          .then(res => {
            console.log(res);
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            localStorage.setItem('expireTime', new Date(res.data.expireTime).getTime());

            refreshNum = 0;
            refreshOver = true;

            requestHandler(method, url, params, flag, response);
          })
          .catch(err => {
            console.log(err);
            console.log('refreshToken已过期，请重新登录！');
            refreshNum = 0;
            context.$showLogin();
          });
      }
    }
  }

  // if ((isRefresh && refreshOver) || (!isRefresh && !refreshOver)) {
  if (!isRefresh && !refreshOver) {
    // 请求接口
    requestHandler(method, url, params, flag, response);
  }
}

function requestHandler(method, url, params, flag, response) {
  const headers = {
    'Content-Type': 'application/json'
  };

  const accessToken = localStorage.getItem('accessToken');

  if (accessToken && accessToken !== '') {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  var p = {
    headers: headers,
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null
  };

  if (flag === 1) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    p.transformRequest = [
      function(params) {
        return Qs.stringify(params);
      }
    ];
  }

  if (flag === 3) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded';
    p.responseType = 'blob';
  }

  http(p)
    .then(function(res) {
      response(res);
    })
    .catch(function(err) {
      console.log(err);
      Promise.reject(err.response.data).catch(function(res) {
        response(res);
      });
      // response(Promise.reject(err));
    });
}

/* 请求接口失败后，判断用户登录状态:
  1. 未登录：如果是未登录过，直接访问，需要登录的接口直接弹登录框，登陆成功，将accessToken存到localStorage中
  2. 已登录：正常操作
  3. 过期了：如果accessToken过期了，请求刷新token接口，刷新成功，继续正常操作，如果刷新失败，弹出登录框
*/

// 注：PUT请求默认会发送两次请求，第一次预检请求不含参数，所以后端不能对PUT请求地址做参数限制

export default {
  initContext(vue) {
    context = vue;
  },
  get: function(url, params, flag, loginStatus, response) {
    // return apiAxios('GET', url, params, flag, response)
    return apiAxios('GET', url, params, flag, loginStatus, response);
  },
  post: function(url, params, flag, loginStatus, response) {
    return apiAxios('POST', url, params, flag, loginStatus, response);
  },
  put: function(url, params, flag, loginStatus, response) {
    return apiAxios('PUT', url, params, flag, loginStatus, response);
  },
  delete: function(url, params, flag, loginStatus, response) {
    return apiAxios('DELETE', url, params, flag, loginStatus, response);
  }
};
