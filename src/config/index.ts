
const isProduction = import.meta.env.PROD
const isDevelopment = !isProduction

const CONFIG = {
  isProduction,
  isDevelopment,
  baseURL: '/',
  title: 'VManager',
  http: {
    baseURL: isDevelopment
      ? 'http://localhost:7003/api'
      : 'https://vmanager-client.ingeniousvision.net/api'
  },
  github: {
    clientId: isProduction ? 'c82d09795998a4a4d0f1' : 'c82d09795998a4a4d0f1',
    // callbackURL 不可随意更改, 否则需要与服务端配置文件一同修改
    callbackURL: `${isProduction ? 'https://vmanager-client.ingeniousvision.net' : window.location.origin}/api/passport/github/callback`,
    repositoryUrl: 'https://github.com/danieljindev/vmanager-client',
    bug: 'https://github.com/danieljindev/vmanager-client/issues'
  }
}

export default CONFIG
