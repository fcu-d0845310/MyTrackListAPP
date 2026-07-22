import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            // 呼叫後端登入 API
            const response = await axios.post("/api/auth/login", { email, password });

            // 儲存 Token 至 localStorage
            localStorage.setItem("jwt_token", response.data.Token);

            // 登入成功，導向首頁 (觸發 ProtectedRoute 放行)
            navigate("/");
        } catch (err: any) {
            setError("登入失敗，請檢查信箱或密碼。");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded shadow-md w-96">
                <h2 className="mb-6 text-2xl font-bold text-center">登入</h2>
                {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full px-3 py-2 border rounded"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-bold text-gray-700">密碼</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
                        登入
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <span className="text-sm text-gray-600">還沒有帳號？ </span>
                    <Link to="/register" className="text-sm text-blue-500 hover:underline">註冊</Link>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;