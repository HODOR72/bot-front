import { defineAbility } from '@casl/ability';
import { AuthUser } from '../@types/auth';

export default (user: AuthUser) => defineAbility((can) => {

  if(user) {
    user.permissions.forEach(permission => {
      const parts = permission.name.split(' ');
      if(parts.length === 2){
        can(parts[0], parts[1]);
      }
    })
  }
});