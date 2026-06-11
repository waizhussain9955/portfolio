const encodeBase64Url = (str: string | Uint8Array): string => {
  const binary = typeof str === 'string' ? new TextEncoder().encode(str) : str;
  let base64 = btoa(String.fromCharCode(...binary));
  return base64.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

const decodeBase64Url = (str: string): Uint8Array => {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

// Web Crypto HMAC SHA-256 signing
export async function signJWT(payload: any, secret: string, expiresMs: number = 900000): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const exp = Math.floor((Date.now() + expiresMs) / 1000);
  const fullPayload = { ...payload, exp };
  
  const headerPart = encodeBase64Url(JSON.stringify(header));
  const payloadPart = encodeBase64Url(JSON.stringify(fullPayload));
  const message = `${headerPart}.${payloadPart}`;
  
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(message)
  );
  
  const signaturePart = encodeBase64Url(new Uint8Array(signatureBuffer));
  return `${message}.${signaturePart}`;
}

export async function verifyJWT(token: string, secret: string): Promise<any | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [headerPart, payloadPart, signaturePart] = parts;
    const message = `${headerPart}.${payloadPart}`;
    
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const key = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const signatureBytes = decodeBase64Url(signaturePart);
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes as any,
      encoder.encode(message)
    );
    
    if (!isValid) return null;
    
    const payload = JSON.parse(new TextDecoder().decode(decodeBase64Url(payloadPart)));
    if (payload.exp && Date.now() / 1000 > payload.exp) {
      return null; // Expired
    }
    
    return payload;
  } catch (e) {
    return null;
  }
}

export const getJwtSecret = (): string => {
  return process.env.JWT_SECRET || 'wzhussain-super-secret-key-123456789!portfolio-chatbot-enterprise';
};

// Convenience wrapper — verifies an access token against the env secret
export const verifyToken = async (token: string): Promise<any | null> => {
  return verifyJWT(token, getJwtSecret());
};

