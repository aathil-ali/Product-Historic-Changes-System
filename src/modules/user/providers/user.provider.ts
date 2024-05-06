// jwt-user.provider.ts

import { Injectable, Scope } from '@nestjs/common';

/**
 * Provider for managing user information in the context of JWT authentication.
 */
@Injectable({ scope: Scope.DEFAULT })
export class UserProvider {
  user: any; // Store the user information

  /**
   * Sets the user information.
   * @param user The user object to be stored.
   */
  setUser(user: any) {
    this.user = user;
  }

  /**
   * Retrieves the stored user information.
   * @returns The user object.
   */
  getUser() {
    return this.user;
  }
}
