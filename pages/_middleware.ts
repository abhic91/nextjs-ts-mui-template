import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  //   setCookies('org-theme-key', 'org1', { req, res, maxAge: 60 * 6 * 24 });
  console.log(req.cookies['org-theme-key']);
  return NextResponse.next().cookie('org-theme-key', 'org1');
  // const { nextUrl: url } = req;
  // url.searchParams.set('org-theme-key', 'org1');
  // return NextResponse.rewrite(url);
}
