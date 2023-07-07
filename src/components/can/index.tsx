import { createContextualCan } from '@casl/react';
import { createContext } from 'react';
import ability from '../../ability/ability';

export const AbilityContext = createContext(ability(null));
export const Can = createContextualCan(AbilityContext.Consumer);
