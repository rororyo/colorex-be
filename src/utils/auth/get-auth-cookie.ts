export function getAuthCookie(req: any) {
  // if(req.cookies['token']) {
  //   return req.cookies['token']
  // }
  // return req.headers['authorization'].split(' ')[1];
  return req.cookies['accessToken'] || req.headers['authorization'].split(' ')[1];
}