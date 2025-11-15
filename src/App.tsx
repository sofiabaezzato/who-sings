import "./App.css";
import { Route, Routes } from "react-router";
import Home from "@/pages/Home.tsx";
import {AuthProvider} from "@/contexts/AuthContext.tsx";

function App() {
	return (
		<AuthProvider>
			<Routes>
				<Route index element={<Home />} />
			</Routes>
		</AuthProvider>
	);
}

export default App;
