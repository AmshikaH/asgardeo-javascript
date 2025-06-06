import "./App.css";
import {
  SignIn,
  SignedIn,
  SignOutButton,
  useAuthentication,
} from "@asgardeo/react";

function App() {
  const { user } = useAuthentication();
  return (
    <>
      <SignIn />

      <SignedIn>
        <h5>Welcome, {user?.userName}</h5>
        <SignOutButton />
      </SignedIn>
    </>
  );
}

export default App;
