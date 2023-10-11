import { useAuth0 } from '@auth0/auth0-react';
import Button from '../Button/Button';

function LoginLogout() {
  let { isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();

  if (isLoading) {
    return <Button>Loading...</Button>;
  }

  if (isAuthenticated) {
    return (
      <Button onClick={() => logout()}>
        Log out
      </Button>
    );
  }
  return <></>;
}

export default LoginLogout;
