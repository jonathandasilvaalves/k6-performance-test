import http from "k6/http";
import { check, sleep } from "k6"
import { SharedArray } from "k6/data";

export const options = {
    scenarios: {
        register: {
            executor: 'constant-arrival-rate',
            exec: 'register',
            duration: '10s',
            rate: 2,
            preAllocatedVUs: 10,
            gracefulStop: '2s'
        },
        session: {
            executor: 'constant-arrival-rate',
            exec: 'authentication',
            duration: '20s',
            rate: 2,
            preAllocatedVUs: 10,
            gracefulStop: '2s'
        }
    },
    thresholds: {
        http_req_failed: ['rate < 0.10']
    }
}
const BASE_URL = 'http://localhost:3333';

export function register(){
    const payload = JSON.stringify({
        name: `JALVES${Math.random() * (5,15) + 5}`,
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

const users = new SharedArray('Read datas', function() {
    return JSON.parse(open('../fixtures/users.json')).users;
});

export function authentication(){
    const user = users[Math.floor(Math.random() * users.length)].email
    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const payload = JSON.stringify({
        email: user,
	    password: "1235456"
    });
    const auth = http.post(`${BASE_URL}/sessions`, payload, params);

    check(auth, {
        'Status 200':(r) => r.status === 200
    }); 
    sleep(1);
}