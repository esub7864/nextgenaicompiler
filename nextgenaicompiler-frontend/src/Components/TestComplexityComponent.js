import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
    LineChart,
    Line,
    ResponsiveContainer,
} from "recharts";

function TestComplexityComponent({ code }) {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [timeComplexity, setTimeComplexity] = useState("O(1)");
    const [spaceComplexity, setSpaceComplexity] = useState("O(1)");
    const [animateGraph, setAnimateGraph] = useState(false);

    const superscriptMap = {
        "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵",
        "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "+": "⁺", "-": "⁻",
        "=": "⁼", "(": "⁽", ")": "⁾", "n": "ⁿ", "N": "ᴺ", "k": "ᵏ",
        "m": "ᵐ", "x": "ˣ", "y": "ʸ"
    };

    const formatComplexity = (str) => {
        if (!str) return "";
        return str.replace(/\^(\S+)/g, (_, exp) =>
            Array.from(exp).map(ch => superscriptMap[ch] || ch).join("")
        );
    };

    const handleClick = async () => {
        setIsAnalyzing(true);
        setAnimateGraph(false);
        axios.post("http://localhost:8000/analyze", { code })
            .then((res) => {
                const { timeComplexity, spaceComplexity } = res.data;
                setTimeComplexity(timeComplexity);
                setSpaceComplexity(spaceComplexity);
                toast.success(`✅ Success`);
                setAnimateGraph(true); 
            })
            .catch(() => toast.error("❌ Failed to analyze code."))
            .finally(() => setIsAnalyzing(false));
    };

    const factorial = (n) => (n <= 1 ? 1 : n * factorial(n - 1));

    const defaultFn = (str) => (n) => {
        if (str.includes("log")) return Math.log2(n);
        if (str.includes("n!")) return factorial(n);
        if (str.includes("2")) return Math.pow(2, n);
        if (str.includes("n²") || str.includes("n^2")) return n * n;
        if (str.includes("n log n")) return n * Math.log2(n);
        if (str.includes("n")) return n;
        return 1;
    };

    const parseComplexity = (str) => {
        const cleanStr = str.trim();
        return [{
            name: cleanStr,
            fn: defaultFn(cleanStr),
            color: "#4F46E5"
        }];
    };

    const ComplexityGraph = ({ title, complexities, formatComplexity, shouldAnimate }) => {
        const data = Array.from({ length: 20 }, (_, i) => i + 1).map((n) => {
            const point = { n };
            complexities.forEach((c) => {
                point[c.name] = Math.min(c.fn(n), 1e6);
            });
            return point;
        });

        return (
            <div className="bg-white shadow rounded p-4">
                <h3 className="text-lg font-semibold mb-2">
                    {title} —{" "}
                    <span className="text-purple-700">
                        {formatComplexity(complexities[0].name)}
                    </span>
                </h3>
                <ResponsiveContainer width="100%" height={150}>
                    <LineChart
                        data={data}
                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    >
                        {complexities.map((c) => (
                            <Line
                                type="monotone"
                                dataKey={c.name}
                                stroke={c.color}
                                strokeWidth={3}
                                dot={false}
                                key={c.name}
                                isAnimationActive={shouldAnimate} // 👈 animate only when true
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        );
    };


    return (
        <div className="border rounded p-4 bg-gray-50">
            <h2 className="font-bold mb-2">Analysis Result</h2>
            <p className="text-sm text-gray-500 mb-2">
                The estimated time and space complexities of your code are shown below.
            </p>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                <h3 className="text-xl font-semibold text-purple-800 mb-2">
                    ✨ Complexity Analysis
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                    <ComplexityGraph
                        title="Time Complexity Growth"
                        complexities={parseComplexity(timeComplexity)}
                        formatComplexity={formatComplexity}
                        shouldAnimate={animateGraph}
                    />
                    <ComplexityGraph
                        title="Space Complexity Growth"
                        complexities={parseComplexity(spaceComplexity)}
                        formatComplexity={formatComplexity}
                        shouldAnimate={animateGraph}
                    />
                </div>

            </div>

            <p className="text-sm text-gray-500">
                This indicates how the runtime and memory usage scale with input size.
            </p>

            <div className="mt-6 text-sm">Daily Test Usage:</div>
            <div className="relative w-full bg-gray-200 h-2 rounded mt-1">
                <div
                    className="absolute top-0 left-0 h-2 bg-purple-600 rounded"
                    style={{ width: "100%" }}
                ></div>
            </div>
            <div className="text-right text-xs mt-1">2 / 2 Tests Remaining</div>

            <button
                onClick={handleClick}
                disabled={isAnalyzing}
                className={`mt-4 px-4 py-1 rounded text-sm ${isAnalyzing
                        ? "bg-gray-400 text-white cursor-not-allowed"
                        : "bg-purple-600 text-white hover:bg-purple-700"
                    }`}
            >
                {isAnalyzing ? "🔍 Analyzing..." : "🔍 Analyze Complexity"}
            </button>

            <button
                onClick={() => { }}
                className="mt-2 ml-2 px-4 py-1 bg-pink-100 text-pink-600 rounded text-sm border"
            >
                Upgrade Plan
            </button>
        </div>
    );
}

export default TestComplexityComponent;
