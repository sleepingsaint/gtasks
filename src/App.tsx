import OAuthRedirect from "components/OAuthRedirect";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "components/Navbar";
import { AuthContextProvider } from "hooks/AuthHook";
import Workspace from "components/Workspace";
import { QueryClient, QueryClientProvider } from "react-query";
import Board from "Board";
import TasksTree from "components/TasksTree";

function App() {
    const client = new QueryClient();

    return (
        <div className="App">
            {/* <div className="h-screen flex flex-col">
                <AuthContextProvider>
                    <QueryClientProvider client={client}>
                        <Navbar />
                        <BrowserRouter>
                            <Routes>
                                <Route
                                    path="/auth/redirect"
                                    element={<OAuthRedirect />}
                                />
                                <Route
                                    path="/workspace"
                                    element={<Workspace />}
                                />
                                <Route
                                    path="/workspace/:id"
                                    element={<Workspace />}
                                />
                            </Routes>
                        </BrowserRouter>
                    </QueryClientProvider>
                </AuthContextProvider>
            </div> */}

            <TasksTree />

        </div>
    );
}

export default App;
