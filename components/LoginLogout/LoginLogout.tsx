import { useAuth0 } from '@auth0/auth0-react';
import Button from '../Button/Button';

function LoginLogout() {
  let { isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();

  if (isLoading) {
    return <Button>Loading...</Button>;
  }

  if (isAuthenticated) {
    return (
      <Button onClick={() => logout({ returnTo: window.location.origin })}>
        Log out
      </Button>
    );
  }

  return <Button onClick={loginWithRedirect}>Log in</Button>;
}

export default LoginLogout;
