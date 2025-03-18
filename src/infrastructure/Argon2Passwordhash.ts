import PasswordHash from "../applications/security/PasswordHash";
import * as argon2 from "argon2"; 

class Argon2PasswordHash extends PasswordHash {
  private _argon2: typeof argon2;

  constructor(argon2Instance: typeof argon2) {
    super();
    if (!argon2Instance) {
      throw new Error('Argon2 instance is not provided.');
    }
    this._argon2 = argon2Instance;
  }

  async hash(password: string): Promise<string> {
    return this._argon2.hash(password);
  }

  async comparePassword(plain: string, encrypted: string): Promise<boolean> {
    return this._argon2.verify(encrypted, plain);
  }
}


export default Argon2PasswordHash;
