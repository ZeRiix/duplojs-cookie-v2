import crypto from "crypto";

enum Algorithm {
	SHA256 = "sha256",
	SHA512 = "sha512",
	MD5 = "MD5",
	SHA1 = "sha1",
}

export function signCookie(value: string, secret: string, algorithm?: Algorithm): string {
	const hmac = crypto.createHmac(
		algorithm || Algorithm.SHA256
		, secret,
	);
	hmac.update(value);
	return `${value}.${hmac.digest("hex")}`;
}

export function verifyCookie(signValue: string, secret: string, algorithm?: Algorithm): string | null {
	const [value, hash] = signValue.split(".");

	if (!value || !hash) {
		return null;
	}

	const expectSign = crypto.createHmac(
		algorithm || Algorithm.SHA256
		, secret,
	)
		.update(value)
		.digest("hex");

	if (crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectSign))) {
		return value;
	}

	return null;
}

export function filterCookies(cookies: Record<string, string>, secret: string): Record<string, string> {
	return Object.entries(cookies).reduce((acc, [name, value]) => {
		const verifiedValue = verifyCookie(value, secret);
		if (verifiedValue !== null) {
			acc[name] = verifiedValue;
		}
		return acc;
	}, {} as Record<string, string>);
}
