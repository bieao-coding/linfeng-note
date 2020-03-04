// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {

  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const auth = sessionStorage.getItem('Authorization');
  const authorityString =
    typeof str === 'undefined' ? (auth ? auth.substring(0,6) : 'undefined') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority;
}

export function setAuthority(authority) {
  return sessionStorage.setItem('Authorization', authority);
}
