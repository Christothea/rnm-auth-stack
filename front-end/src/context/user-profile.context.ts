import React from 'react';
import { UserProfile } from '../models/user-profile.model';

export const UserProfileContext = React.createContext(new UserProfile());