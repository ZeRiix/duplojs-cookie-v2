# Duplo cookie V2

## Intallation:

```bash
npm install @duplo/cookie-v2
```

## How to use ?:

### Configuration:

```javascript
// main.ts
import Duplo from '@duplojs/core';
import duploCookieV2 from '@duplojs/cookie-v2';
//...

const duplo = new Duplo({
	plugins: [
		(duplo) => void duploCookieV2(duplo, { secret: "my-secret" }),
		//...
	],
	environment: "DEV",
	//...
});
```

### Example:

```javascript
// ./routes/path/to/your/route.ts
export const myRoute = duplo.
	.declareRoute("GET", "/path/to/your/route")
	.extract({
    	cookie: {
        	cookie: zod.string().optional()
    	}
	})
	.cut((floor, response) => {
    	if(floor.pickup("cookie")) {
			response.code(403).dropCookie("cookie").send();
		}
	})
	.handler((floor, response) => {
    	response.code(200).setCookie("cookie", "i like cookie mmmmh").send();	
	});
```

## Authors: 

- [ZeRiix](https://github.com/ZeRiix) <img src="https://avatars.githubusercontent.com/u/70342449?v=4" width="16" alt="ZeRiix"/>