import * as admin from "firebase-admin";

type Role = string;

export function guard(roles: Role[]) {
  return (req: any, res: any, next: Function) => {
  let token = req.query['token'] || req.query['access_token'] || req.headers['x-access-token'] || undefined;
  if (token === undefined) {
    token = req.headers['authorization'] || undefined;
    if (token === undefined) {
      return next(new Error('Access token is required'));
    }
    token = token.split(' ').pop();
  }
  admin
    .auth()
    .verifyIdToken(token)
    .then((data: any) => {
      if (!('role' in data)) {
        return next(new Error('permission denied'));
      }
      if (!roles.includes(data.role)) {
        return next(new Error('not enough permission'));
      }
      req['auth'] = res['auth'] = data;
      next();
    })
    .catch((err: any) => next(err));
}
}
