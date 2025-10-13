import { error } from '@sveltejs/kit';

export async function GET({ url, fetch }) {
    let username = url.searchParams.get("username");
    if(!username) {
        throw error(400, "Please specify username!");
    }
    const req = await fetch(`https://www.duolingo.com/2017-06-30/users?username=${username}`);
    const json = await req.json();
    return new Response(JSON.stringify(json), {
        headers: {
            "Content-Type": "application/json"
        }
    })
};