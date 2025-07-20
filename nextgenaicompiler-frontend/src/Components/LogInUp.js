import React, { useState } from "react";
import { FaPython, FaJava } from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io5";
import { PiFileCppDuotone, PiFileCSharp } from "react-icons/pi";
import API_URL from "./apiURL";
import Subscribe from "./Subscribe";
import { useNavigate } from "react-router-dom";

import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axios from "axios";

const GOOGLE_CLIENT_ID = "659547514186-hq895lclpj7lvp2tshlpigetqgk04uc0.apps.googleusercontent.com";

export default function LogInUp() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [tokenCheck, setTokenCheck] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const endpoint = activeTab === "login" ? "/login" : "/register";
            const payload =
                activeTab === "login"
                    ? { email, password }
                    : { email, password, confirm_password: confirmPassword };

            const res = await fetch(`${API_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            localStorage.setItem("token", data.token);
            if (data.token) {
                navigate("/code");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
            setTokenCheck(!tokenCheck);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post(`${API_URL}/auth/google`, {
                token: credentialResponse.credential,
            });
            if (res.status === 200) {
                localStorage.setItem("token", res.data.servertoken);
                if (res.data.servertoken) {
                    navigate("/code");
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleGoogleFailure = (error) => {
        console.error("Google Login Failed:", error);
    };

    return (
        <>
            <div
                className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
                style={{
                    backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url('/BG_Vector.jpg')`,
                }}
            >
                <div className="absolute top-6 left-6 text-white">
                    <h1 className="text-4xl font-extrabold drop-shadow-lg">
                        Nextgen Compiler
                    </h1>
                    <p className="text-md md:text-lg mt-2 font-medium drop-shadow-l">
                        Code Smarter. Together.
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded shadow-md p-6 w-full max-w-sm">
                    <div className="flex mb-4 border-b">
                        <button
                            onClick={() => setActiveTab("login")}
                            className={`flex-1 py-2 text-center font-semibold ${activeTab === "login"
                                    ? "text-purple-600 border-b-2 border-purple-600"
                                    : "text-gray-500"
                                }`}
                        >
                            Login
                        </button>
                        <button
                            onClick={() => setActiveTab("signup")}
                            className={`flex-1 py-2 text-center font-semibold ${activeTab === "signup"
                                    ? "text-purple-600 border-b-2 border-purple-600"
                                    : "text-gray-500"
                                }`}
                        >
                            Signup
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-200"
                                placeholder="you@example.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-200"
                                placeholder="••••••••"
                            />
                        </div>

                        {activeTab === "signup" && (
                            <div>
                                <label className="block text-sm text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full border rounded px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-200"
                                    placeholder="••••••••"
                                />
                            </div>
                        )}

                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white rounded py-2 hover:bg-purple-700 transition"
                            disabled={loading}
                        >
                            {loading
                                ? "Processing..."
                                : activeTab === "login"
                                    ? "Login"
                                    : "Signup"}
                        </button>

                        {error && (
                            <p className="text-sm text-red-500 mt-2 text-center">{error}</p>
                        )}
                    </form>

                    <div className="my-4 text-center text-sm text-gray-400">or</div>

                    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleFailure}
                            // ux_mode="redirect"
                            prompt="select_account"
                            useOneTap={false}
                            size="medium"
                            shape="circle"
                            width="100%"
                        />
                    </GoogleOAuthProvider>
                </div>
            </div>

            <section className="py-16 bg-white text-center px-6">
                <h2 className="text-3xl font-bold mb-12">
                    Why Choose Nextgen Compiler?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
                    {[
                        {
                            title: "Blazing Fast Execution",
                            desc: "Run your code with unparalleled speed, leveraging optimized compilation and execution engines.",
                        },
                        {
                            title: "AI-Powered Explanations",
                            desc: "Understand complex code snippets instantly with intelligent, AI-driven explanations.",
                        },
                        {
                            title: "Seamless Collaboration",
                            desc: "Code together in real-time with integrated voice and text chat for team projects.",
                        },
                        {
                            title: "Advanced Test Complexity",
                            desc: "Analyze your algorithms and generate test cases to understand time complexity.",
                        },
                    ].map((item, index) => (
                        <div key={index} className="p-4 text-left">
                            <h3 className="font-semibold text-lg mb-2 text-purple-700">
                                {item.title}
                            </h3>
                            <p className="text-sm text-gray-600">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-12 bg-gray-50 text-center">
                <h2 className="text-2xl font-bold mb-6">
                    Supported Languages & Technologies
                </h2>
                <div className="flex flex-wrap justify-center gap-20 text-pink-600 text-xl">
                    {["C++", "Python", "JavaScript", "Java", "C#"].map((lang, i) => (
                        <div key={i} className="flex flex-col items-center">
                            <div className="text-3xl">{getIconForLang(lang)}</div>
                            <div>{lang}</div>
                        </div>
                    ))}
                </div>
            </section>

            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl mx-4 my-16 p-10 text-center shadow-lg">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Ready to Transform Your Coding Journey?
                </h2>
                <p className="text-lg mb-6">
                    Join thousands of developers experiencing the future of online
                    compilation and collaboration.
                </p>
                <button
                    className="bg-white text-black font-semibold px-6 py-2 rounded hover:bg-gray-100 transition"
                    onClick={() => scrollToTop()}
                >
                    Get Started for Free
                </button>
            </div>

            <Subscribe />
        </>
    );
}

function getIconForLang(lang) {
    const icons = {
        "C++": <PiFileCppDuotone />,
        Python: <FaPython />,
        JavaScript: <IoLogoJavascript />,
        Java: <FaJava />,
        "C#": <PiFileCSharp />,
    };
    return icons[lang] || "💻";
}
