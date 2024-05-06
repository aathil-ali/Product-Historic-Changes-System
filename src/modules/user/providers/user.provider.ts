// jwt-user.provider.ts

import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class UserProvider {
  static getUser() {
    throw new Error('Method not implemented.');
  }
  user: any; // Store the user information

  setUser(user: any) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }
}
