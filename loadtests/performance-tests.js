import { group, sleep } from 'k6';
import http from 'k6/http';

// Version: 1.2
// Creator: k6 Browser Recorder

export let options = {
    maxRedirects: 0,
};

export default function() {

	group("page_0 - https://tech-lunch.cfapps.io/", function() {
		let req, res;
		req = [{
			"method": "get",
			"url": "https://tech-lunch.cfapps.io/",
			"params": {
				"headers": {
					"Upgrade-Insecure-Requests": "1",
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
					"Sec-Fetch-Dest": "document",
					"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
				}
			}
		},{
			"method": "get",
			"url": "https://tech-lunch.cfapps.io/dist/css/app.1cb140d8ba31d5b2f1114537dd04802a.css",
			"params": {
				"headers": {
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
					"Sec-Fetch-Dest": "style",
					"Accept": "text/css,*/*;q=0.1"
				}
			}
		},{
			"method": "get",
			"url": "https://tech-lunch.cfapps.io/dist/js/app.3fc0f988d21662902933.js",
			"params": {
				"headers": {
					"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36",
					"Sec-Fetch-Dest": "script",
					"Accept": "*/*"
				}
			}
		}];
		res = http.batch(req);
		// Random sleep between 20s and 40s
		sleep(Math.floor(Math.random()*20+20));
	});

}
