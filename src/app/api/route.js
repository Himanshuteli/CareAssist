import { NextResponse } from "next/server";

let persistedData = null;

export async function POST(req, res) {
    const postData = await req.json();

    persistedData = postData;

    const url = req.nextUrl.clone()
    url.pathname = '/'

    return NextResponse.redirect(url, 302);
}

export async function GET(request, response) {
    return Response.json({ data: persistedData });
}