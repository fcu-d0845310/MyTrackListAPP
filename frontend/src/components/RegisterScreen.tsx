import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const RegisterScreen: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("兩次輸入的密碼不一致");
            return;
        }

        try {
            // 呼叫後端註冊 API
            await axios.post("/api/auth/register", { email, password });

            alert("註冊成功！請登入。");
            navigate("/login");
        } catch (err: any) {
            setError(err.response?.data?.message || "註冊失敗，信箱可能已被使用。");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="p-8 bg-white rounded shadow-md w-96">
                <h2 className="mb-6 text-2xl font-bold text-center">註冊</h2>
                {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
                <form onSubmit={handleRegister}>
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
                    <div className="mb-4">
                        <label className="block mb-2 text-sm font-bold text-gray-700">密碼</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border rounded"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-bold text-gray-700">確認密碼</label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border rounded"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700">
                        註冊
                    </button>
                </form>
                <div className="mt-4 text-center">
                    <span className="text-sm text-gray-600">已經有帳號了？ </span>
                    <Link to="/login" className="text-sm text-blue-500 hover:underline">登入</Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;