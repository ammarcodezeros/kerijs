const libsodium = require('libsodium-wrappers-sumo');
const { Crymat } = require('./cryMat');
const codeAndLength = require('./derivationCode&Length');

/**
 * @description  Verfer :sublclass of crymat,helps to verify signature of serialization
 *  using .raw as verifier key and .code as signature cypher suite
 */
class Verfer extends Crymat {
  // eslint-disable-next-line max-len
  constructor(raw = null, qb64 = null, qb2 = null, code = codeAndLength.oneCharCode.Ed25519N, index = 0) {
    super(raw, qb64, qb2, code, index);
    if (Object.values(codeAndLength.oneCharCode.Ed25519N).includes(this.getCode)
            || Object.values(codeAndLength.oneCharCode.Ed25519).includes(this.getCode)) {
      this.verifySig = this.ed25519;
    } else {
      throw new Error(`Unsupported code = ${this.getCode} for verifier.`);
    }
  }

  /**
     *
     * @param {bytes} sig   bytes signature
     * @param {bytes} ser   bytes serialization
     */
  verify(sig, ser) {
    return this.verifySig(sig, ser, this.raw());
  }

  /**
     * @description This method will verify ed25519 signature on Serialization using  public key
     * @param {bytes} sig
     * @param {bytes} ser
     * @param {bytes} key
     */

  // eslint-disable-next-line class-methods-use-this
  ed25519(sig, ser, key) {
    try {
      const result = libsodium.crypto_sign_verify_detached(sig, ser, key);
      if (result) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = { Verfer };
