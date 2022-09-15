// eslint-disable-next-line import/prefer-default-export
export const onRequestPost = async ({ request, env }) => {
    const allowOrigin = [
        'http://localhost',
        'https://dvuckovic.com',
    ];

    if (
        request.method !== 'POST'
        || !request.headers.has('origin')
        || !request.headers.has('referer')
    ) {
        return new Response(null, {
            status: 404,
            headers: new Headers({ 'Access-Control-Allow-Origin': '*' }),
        });
    }

    const requestOrigin = request.headers.get('origin');
    const requestReferer = request.headers.get('referer');

    if (
        !allowOrigin.some(
            (origin) => requestOrigin.startsWith(origin) && requestReferer.startsWith(origin)
        )
    ) {
        return new Response(null, {
            status: 405,
            headers: new Headers({ 'Access-Control-Allow-Origin': requestOrigin }),
        });
    }

    const formData = await request.formData();

    if (!formData.get('g-recaptcha-response')) {
        return new Response(null, {
            status: 422,
            headers: new Headers({ 'Access-Control-Allow-Origin': requestOrigin }),
        });
    }

    const secret = env.RECAPTCHA_SECRET_KEY;
    const response = formData.get('g-recaptcha-response');
    const remoteIp = request.headers.get('CF-Connecting-IP');

    const verifyRequest = new Request(
        'https://www.google.com/recaptcha/api/siteverify',
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `secret=${secret}&response=${response}&remoteip=${remoteIp}`,
        }
    );

    const res = await fetch(verifyRequest);
    const body = await res.json();
    const debugVerify = JSON.stringify(body);

    if (!body || !body.success || body.score < 0.5) {
        return new Response(debugVerify, {
            status: 403,
            headers: new Headers({ 'Access-Control-Allow-Origin': requestOrigin }),
        });
    }

    const USER = 'ZHVzYW4=';
    const HOST = 'ZHZ1Y2tvdmlj';
    const TLD = 'Y29t';

    const result = {
        USER,
        HOST,
        TLD,
    };

    return new Response(JSON.stringify(result), {
        status: 200,
        headers: new Headers({ 'Access-Control-Allow-Origin': requestOrigin }),
    });
};
