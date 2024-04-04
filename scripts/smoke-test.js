import http from 'k6/http';
import { check } from 'k6'
//import configs from '../configs';

export const options = {
    vus: 1,
    duration: '2s',
}

export default function() {
    const BASE_URL = "http://localhost:3333"

    const payload = JSON.stringify({
        name: "Jonathan",
	    email: `${Math.random()}@mail.com`,
	    age: "26",
	    password: "1235456"
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const user = http.post(`${BASE_URL}/user/create`, payload, params);

    check(user, {
        'status code 200': (r) => r.status === 200
    });
}
