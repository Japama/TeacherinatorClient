// authHelpers.tsx

import Cookies from "js-cookie";

interface AuthState {
  isLoggedIn: boolean;
  username: string | null;
  isAdmin: boolean;
}

type GetCurrentUserType = () => Promise<AuthState | null>;
type NavigateType = (path: string) => void;

export const checkLogin = async (getCurrentUser: GetCurrentUserType, navigate: NavigateType) => {
  const currentState = await getCurrentUser();
  const loggedInCookie = Cookies.get('loged_in');
  if (loggedInCookie !== "true") {
    if (!currentState) {
      navigate("/login");
    }
    else if (!currentState.isAdmin) {
      navigate("/checkin");
    }
  }
};
