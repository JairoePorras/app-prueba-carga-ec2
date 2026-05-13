import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "1m", target: 10 },
    { duration: "1m", target: 30 },
    { duration: "1m", target: 60 },
    { duration: "1m", target: 90 },
    { duration: "30s", target: 0 }
  ],
  thresholds: {
    http_req_failed: ["rate<0.05"],
    http_req_duration: ["p(95)<2000"]
  }
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:8080";

export default function () {
  const res = http.get(`${BASE_URL}/api/test`);

  check(res, {
    "status es 200": (r) => r.status === 200,
    "tiempo menor a 2s": (r) => r.timings.duration < 2000
  });

  sleep(1);
}
