import inherits from 'inherits'
//import MD5 from 'md5.js'
//import RIPEMD160 from 'ripemd160'
import sha from 'sha.js'
import Base from 'cipher-base'

//export * from 'browser-crypto'

function Hash(hash) {
  Base.call(this, 'digest')

  this._hash = hash
}

inherits(Hash, Base)

Hash.prototype._update = function(data) {
  this._hash.update(data)
}

Hash.prototype._final = function() {
  return this._hash.digest()
}

export function createHash(alg) {
  alg = alg.toLowerCase()
  //if (alg === 'md5') return new MD5()
  //if (alg === 'rmd160' || alg === 'ripemd160') return new RIPEMD160()

  return new Hash(sha(alg))
}
