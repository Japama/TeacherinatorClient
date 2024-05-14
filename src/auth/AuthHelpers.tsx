// authHelpers.tsx

interface AuthState {
    isLoggedIn: boolean;
    username: string | null;
    isAdmin: boolean;
  }
  
type GetCurrentUserType = () => Promise<AuthState | null>;
type NavigateType = (path: string) => void;

export const checkLogin = async (getCurrentUser: GetCurrentUserType, navigate: NavigateType) => {
  const currentState = await getCurrentUser();
  if (!currentState) {
    navigate("/login");
  } 
  else if (!currentState.isAdmin) {
    navigate("/checkin");
  }
};
