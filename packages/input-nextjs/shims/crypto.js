'use strict'

import _randombytes from 'randombytes/browser'
import _create_hash from 'create-hash/browser'
import _create_hmac from 'create-hmac/browser'
import _algos from 'browserify-sign/algos'
import _p from 'pbkdf2/browser'
import _aes from 'browserify-cipher/browser'
import _dh from 'diffie-hellman/browser'
import _sign from 'browserify-sign/browser'
import _create_ecdh from 'create-ecdh/browser'
import _publicEncrypt from 'public-encrypt/browser'

import rf from 'randomfill/browser'

export const randomBytes = _randombytes
export { randomBytes as rng, randomBytes as pseudoRandomBytes }
export const createHash = _create_hash
export { createHash as Hash }
export const createHmac = _create_hmac
export const Hmac = _create_hmac

var algoKeys = Object.keys(_algos)
var hashes = ['sha1', 'sha224', 'sha256', 'sha384', 'sha512', 'md5', 'rmd160'].concat(
  algoKeys
)

export function getHashes() {
  return hashes
}

export const pbkdf2 = _p.pbkdf2
export const pbkdf2Sync = _p.pbkdf2Sync
export const Cipher = _aes.Cipher
export const createCipher = _aes.createCipher
export const Cipheriv = _aes.Cipheriv
export const createCipheriv = _aes.createCipheriv
export const Decipher = _aes.Decipher
export const createDecipher = _aes.createDecipher
export const Decipheriv = _aes.Decipheriv
export const createDecipheriv = _aes.createDecipheriv
export const getCiphers = _aes.getCiphers
export const listCiphers = _aes.listCiphers
export const DiffieHellmanGroup = _dh.DiffieHellmanGroup
export const createDiffieHellmanGroup = _dh.createDiffieHellmanGroup
export const getDiffieHellman = _dh.getDiffieHellman
export const createDiffieHellman = _dh.createDiffieHellman
export const DiffieHellman = _dh.DiffieHellman
export const createSign = _sign.createSign
export const Sign = _sign.Sign
export const createVerify = _sign.createVerify
export const Verify = _sign.Verify

export { _create_ecdh as createECDH }
export const publicEncrypt = _publicEncrypt.publicEncrypt
export const privateEncrypt = publicEncrypt.privateEncrypt
export const publicDecrypt = publicEncrypt.publicDecrypt
export const privateDecrypt = publicEncrypt.privateDecrypt
export const randomFill = rf.randomFill
export const randomFillSync = rf.randomFillSync

export function createCredentials() {
  throw new Error(
    [
      'sorry, createCredentials is not implemented yet',
      'we accept pull requests',
      'https://github.com/crypto-browserify/crypto-browserify',
    ].join('\n')
  )
}

export const constants = {
  DH_CHECK_P_NOT_SAFE_PRIME: 2,
  DH_CHECK_P_NOT_PRIME: 1,
  DH_UNABLE_TO_CHECK_GENERATOR: 4,
  DH_NOT_SUITABLE_GENERATOR: 8,
  NPN_ENABLED: 1,
  ALPN_ENABLED: 1,
  RSA_PKCS1_PADDING: 1,
  RSA_SSLV23_PADDING: 2,
  RSA_NO_PADDING: 3,
  RSA_PKCS1_OAEP_PADDING: 4,
  RSA_X931_PADDING: 5,
  RSA_PKCS1_PSS_PADDING: 6,
  POINT_CONVERSION_COMPRESSED: 2,
  POINT_CONVERSION_UNCOMPRESSED: 4,
  POINT_CONVERSION_HYBRID: 6,
}
