// Type definitions for Next.js Server Components
declare module 'next/server' {
  import { NextApiRequest, NextApiResponse } from 'next';
  
  export type NextRequest = Request & {
    headers: Headers;
  };
  
  export type NextResponse = Response;
  
  export const NextResponse: {
    json(body: any, init?: ResponseInit): NextResponse;
    redirect(url: string | URL, init?: ResponseInit): NextResponse;
    rewrite(destination: string | URL, init?: ResponseInit): NextResponse;
    next(init?: ResponseInit): NextResponse;
  };
} 