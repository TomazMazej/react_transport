import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Transport from "./components/Transport";
import Profile from "./components/Profile";

function App() {
    const user = localStorage.getItem("token");

    return (
		<Routes>
			{user && <Route path="/" exact element={<Main />} />}
			<Route path="/signup" exact element={<Signup />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/" element={<Navigate replace to="/login" />} />
			<Route path="/transport/:id" element={<Transport />} />
			<Route path="/profile" exact element={<Profile />} />
		</Routes>
	);
}

export default App;