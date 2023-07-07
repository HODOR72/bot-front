import { ReactNode } from 'react';
import { Can } from '../components/can';
import { Navigate } from 'react-router-dom';

// ----------------------------------------------------------------------

type Props = {
  action: string;
  model: string;
  children: ReactNode;
};

export default function PermissionGuard({ action, model, children }: Props) {
  return <>
    <Can do={action} on={model}>{children}</Can>
    <Can not do={action} on={model}><Navigate to="/403" replace /></Can>
  </>;
}
