import crypto from 'crypto'

const Algorithm = "aes-256-gcm"
const scryptParams = {
    N: 16384,
    r: 8,
    p: 16,
    maxmem: 32 * 1024 * 1024,
    dkLen: 128,
    encoding: 'hex'
}

export function generateHash(length = 32) {
    return crypto.randomBytes(length).toString('hex')
}

export function newCipherKey() {
    return crypto.randomBytes(32)
}

export function encryptData(data: string, key: Buffer){
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(Algorithm, key, iv);
    const encrypted = cipher.update(data, 'utf8', 'hex') + cipher.final('hex')
    const tag = cipher.getAuthTag()

    return {
        data: `${encrypted}.${iv.toString('hex')}.${tag.toString('hex')}`,
        iv: iv.toString('hex'),
        tag: tag.toString('hex'),
    }
}

export function decryptData(encryptedData: string, ivStr: string, tagStr: string, key: string){
    const tag = Buffer.from(tagStr, 'hex')
    const iv = Buffer.from(ivStr, 'hex')

    const decipher = crypto.createDecipheriv(Algorithm, Buffer.from(key, 'hex'), iv)
    decipher.setAuthTag(tag)

    return decipher.update(encryptedData, 'hex', 'utf8') + decipher.final('utf8')
}

export function encryptPassword(password: string) {
    const salt = crypto.randomBytes(16).toString('hex')
    const hashedPassword = crypto.scryptSync(password, salt, scryptParams.dkLen, scryptParams).toString('hex')

    return hashedPassword+'.'+salt
}

export function verifyPassword(password: string, hashedPassword: string) {
    const [hash, salt] = hashedPassword.split('.');
    const rehashedPassword = crypto.scryptSync(password, salt, scryptParams.dkLen, scryptParams).toString('hex')

    return hash === rehashedPassword
}