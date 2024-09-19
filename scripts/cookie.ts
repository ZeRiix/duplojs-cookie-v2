import {
	Request,
	Response,
	Duplo,
	type CurrentRequestObject,
} from "@duplojs/core";
import cookie from "cookie";
import {
	signCookie,
	filterCookies,
} from "./sign";

declare module "@duplojs/core" {
	interface DuploConfig {
		"@duplojs/cookie-v2": {
			secret?: string;
		};
	}

	interface Duplo {
		config: DuploConfig;
	}

	interface Request {
		cookies: Record<string, string>;
	}

	interface Response {
		cookies: Record<
			string,
			{
				value: string;
				params?: cookie.CookieSerializeOptions;
			}
		>;
		setCookie(name: string, value: string, params?: cookie.CookieSerializeOptions): this;
		dropCookie(name: string): this;
	}
}

Duplo.prototype.config["@duplojs/cookie-v2"] = {
	secret: undefined,
};

Request.prototype.cookies = {};

Response.prototype.cookies = {};

Response.prototype.setCookie = function(name, value, params) {
	this.cookies[name] = {
		value,
		params,
	};
	return this;
};

Response.prototype.dropCookie = function(name) {
	this.cookies[name] = {
		value: "",
		params: {},
	};
	return this;
};

export default function duploCookieV2(
	instance: Duplo,
) {
	let secret: string | undefined = undefined;

	if (instance.config["@duplojs/cookie-v2"].secret) {
		secret = instance.config["@duplojs/cookie-v2"].secret;
	}

	instance.hook("beforeRouteExecution", (req: CurrentRequestObject) => {
		if (req.headers.cookies) {
			if (secret) {
				req.cookies = filterCookies(
					cookie.parse(req.headers.cookies),
					secret,
				);
			} else {
				req.cookies = cookie.parse(req.headers.cookies);
			}
		}
	});

	instance.hook("beforeSend", (res: Response) => {
		if (Object.keys(res.cookies).length !== 0) {
			res.setHeader(
				"Set-Cookie",
				Object.entries(res.cookies).map(
					(
						[name, content],
					) => cookie.serialize(
						name,
						secret
							? signCookie(content.value, secret)
							: content.value,
						content.params,
					),
				),
			);
		}
	});
}
