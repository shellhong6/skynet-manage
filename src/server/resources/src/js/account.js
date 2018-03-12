import Cookies from 'js-cookie';
import Config from './config';

const checkLogin = () => {console.log('in checkLogin');return;
  //其他平台登录了
  if (Cookies.get('_islogined') != 'true') {
    login();
  }

  //没有登录
  if (Cookies.get('_islogined') != 'true') {
    login();
  }
};

const login = () => {console.log('in login');return;
  location.href = Config.host + '/login.html?useruri=' + encodeURIComponent(location.href);
};

const isLogin = () => {console.log('in isLogin');return;
  return Cookies.get('_islogined') == 'true';
};

export default {
  checkLogin,
  login,
  isLogin,
};
