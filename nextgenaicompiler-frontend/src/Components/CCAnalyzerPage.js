import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LearningContent1 from './LearningContent1';
import Subscribe from "./Subscribe";
import CodeEditor from "./MonacoEditor";
import TestComplexityComponent from "./TestComplexityComponent";
import CodeInputOutputs from "./CodeInputOutputs";
import AIExplain from "./AIExplainComponent";
import API_URL from "./apiURL";
import ProfileMenu from "./ProfileMenu";

export default function CCAnalyzer() {
    const navigate = useNavigate();
    const [code, setCode] = useState(``);
    const [language, setLanguage] = useState("Python");
    const [showModal, setShowModal] = useState(false);
    const [pendingLang, setPendingLang] = useState(null);
    const [rTab, setRTab] = useState("code");
    const [executing, setExecuting] = useState(false);
    const [isLogin, setIsLogin] = useState(false);
    const { tab } = useParams();


    const [inputs, setInputs] = useState("");
    const [outputs, setOutputs] = useState("");
    const [showErase, setShowErase] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        axios.get(`${API_URL}/validate`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => { setIsLogin(res.data.status); }
            )
            .catch(err => console.error(err));
    }, [])

    const handleClick = (button) => {
        if (button === "reset") {
            setShowErase(true);
        }
        if (button === "logout") {
            localStorage.removeItem("token");
            localStorage.removeItem("userid");
            navigate('/auth')
        }
        else {
            toast.success("coming soon...")
        }
    };

    const handleLanguageChange = (newLang) => {
        setPendingLang(newLang);
        setShowModal(true);
    };

    const handleChangeTab = (currTab) => {
        setRTab(currTab)
    }

    const helloWorldMap = {
        C: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
        Python: `print("Hello, World!")`,
        JavaScript: `console.log("Hello, World!");`,
        Java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
        "C++": `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`,
        "C#": `using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, World!");
    }
}`
    };


    const confirmLanguageChange = () => {
        setLanguage(pendingLang);
        setCode("");
        setInputs("");
        setOutputs("");
        setShowModal(false);
        const defaultCode = helloWorldMap[pendingLang];
        if (defaultCode) {
            setCode(defaultCode);
        }
    };

    const handleRunCode = async () => {
        setRTab('code');
        try {
            setExecuting(true);
            const res = await axios.post(`${API_URL}/runcode`, {
                language: language,
                code: code,
                input: inputs
            })
            setOutputs(res.data.run.output);
            // console.log(res.data.run.output);
        }
        catch (err) {
            console.error(err);
        }
        finally {
            setExecuting(false);
        }
    }

    return (
        <>
            <div className="min-h-screen bg-white text-black">
                <ToastContainer />

                {/* Navbar */}
                <nav className="flex justify-between items-center px-6 py-3 border-b">
                    <div className="flex gap-2 items-center">
                        <div className="w-6 h-6 bg-gradient-to-tr from-pink-500 to-purple-500 rounded"></div>
                        <span className="font-bold text-lg">Nextgen Compiler</span>
                    </div>
                    <div className="flex gap-4 text-sm">
                        {[
                            { tab: "code", label: "Code Editor" },
                            // { tab: "analyze", label: "Test Complexity" },
                            // { tab: "explain", label: "AI Explanation" },
                            // { tab: "collaborate", label: "Collaborate" },
                        ].map(({ tab, label }) => (
                            <button
                                key={tab}
                                onClick={() => handleChangeTab(tab)}
                                className={`px-3 py-1 rounded transition 
        ${rTab === tab
                                        ? "bg-blue-100 text-blue-600 font-medium"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <div className="">

                        {
                            isLogin ? <div className="flex gap-3 items-center">
                                <button onClick={() => handleClick("logout")} className="border px-3 py-1 rounded">Logout</button>
                                {/* <ProfileMenu handleClick={handleClick} /> */}
                            </div>
                                : <button onClick={() => navigate("/auth")} className="border px-3 bg-blue-600 text-white py-1 rounded">SignIn</button>
                        }
                    </div>
                </nav>

                {/* Main content */}
                <div className="p-6">
                    {/* <h1 className="text-2xl font-bold text-center mb-6">Code Complexity Analyzer</h1> */}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Code Editor */}
                        <div className="border rounded p-4">
                            <div className="flex justify-between items-center mb-2">
                                <div>
                                    <h2 className="font-bold">Code Editor</h2>
                                    <p className="text-sm text-gray-500">Input your code here for complexity analysis.</p>
                                </div>

                                {/* Language Selector */}
                                <div className="flex flex-row items-center gap-4">
                                    <div>
                                        <label className="text-sm mr-2">Language:</label>
                                        <select
                                            value={language}
                                            onChange={(e) => handleLanguageChange(e.target.value)}
                                            className="border px-2 py-1 rounded text-sm"
                                        >
                                            <option>C</option>
                                            <option>Python</option>
                                            <option>JavaScript</option>
                                            <option>Java</option>
                                            <option>C++</option>
                                            <option>C#</option>
                                        </select>
                                    </div>
                                    <button
                                        onClick={handleRunCode}
                                        disabled={executing}
                                        className={`px-3 py-1 rounded text-sm transition 
            ${executing
                                                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                                                : "bg-purple-600 text-white hover:bg-purple-700"}`}
                                    >
                                        {executing ? "Executing…" : "Run Code"}
                                    </button>
                                </div>
                            </div>

                            {/* Textarea with line numbers */}
                            <div className="flex w-full h-100 border rounded bg-gray-50 overflow-auto text-sm font-mono overflow-y-hidden">
                                {/* <div className="bg-gray-100 text-right px-2 py-1 select-none">
                                    {Array.from({ length: code.split("\n").length || 1 }).map((_, idx) => (
                                        <div key={idx} className="pr-2 text-gray-500">{idx + 1}</div>
                                    ))}
                                </div> */}
                                {/* <textarea
                className="flex-1 p-2 bg-transparent outline-none resize-none overflow-y-hidden"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              /> */}

                                <CodeEditor
                                    language={language}
                                    code={code}
                                    setCode={setCode}
                                />
                            </div>

                            <div className="flex gap-3 mt-3">
                                <button onClick={() => handleClick("reset")} className="px-4 py-1 border rounded">Reset Code</button>
                                {/* <button onClick={() => handleClick("analyze")} className="px-4 py-1 bg-purple-600 text-white rounded">Analyze Complexity</button> */}
                            </div>
                        </div>
                        <CodeInputOutputs inputs={inputs} outputs={outputs} setInputs={setInputs} setOutputs={setOutputs} />
                        {/* {
                            rTab === "code" ? <CodeInputOutputs inputs={inputs} outputs={outputs} setInputs={setInputs} setOutputs={setOutputs} /> :
                                rTab === "explain" ? <AIExplain code={code} isSignedIn={true}/> :
                                    <TestComplexityComponent code={code} />
                        } */}
                    </div>
                </div>

                {/* Modal */}
                {showModal ? (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm">
                            <h3 className="font-bold text-lg mb-2">Change Language</h3>
                            <p className="text-sm text-gray-600 mb-4">Do you want to erase code and switch to new language?</p>
                            <div className="flex gap-4 justify-center">
                                <button onClick={confirmLanguageChange} className="px-4 py-1 bg-red-500 text-white rounded">Yes</button>
                                <button onClick={() => setShowModal(false)} className="px-4 py-1 border rounded">No</button>
                            </div>
                        </div>
                    </div>
                ) : null}
                {showErase ? (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg text-center max-w-sm">
                            <h3 className="font-bold text-lg mb-2">Reset Code</h3>
                            <p className="text-sm text-gray-600 mb-4">Do you want really want to reset code?</p>
                            <div className="flex gap-4 justify-center">
                                <button onClick={() => { setCode(""); setShowErase(false); setInputs(""); setOutputs(""); }} className="px-4 py-1 bg-red-500 text-white rounded">Yes</button>
                                <button onClick={() => setShowErase(false)} className="px-4 py-1 border rounded">No</button>
                            </div>
                        </div>
                    </div>
                ) : null}
                <LearningContent1 />
                <Subscribe />
            </div>

        </>
    );
}
