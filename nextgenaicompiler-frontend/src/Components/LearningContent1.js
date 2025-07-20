import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

const complexityLevels = [
  { level: 1, label: "O(1)" },
  { level: 2, label: "O(logN)" },
  { level: 3, label: "O(N)" },
  { level: 4, label: "O(N logN)" },
  { level: 5, label: "O(N²)" },
  { level: 6, label: "O(2^N)" },
];

const graphData = complexityLevels.map((item) => ({
  x: item.label,
  y: item.level,
}));

export default function LearningContent1() {
  return (
<div className="flex flex-col w-full max-w-none px-6 py-3">
  <div className="flex flex-col md:flex-row gap-6 w-full">
        
        {/* Code Snippet Library */}
        <div className="border rounded p-4 bg-gray-50 w-[40%]">
          <h2 className="text-xl font-bold mb-1">Code Snippet Library</h2>
          <p className="text-sm text-gray-500 mb-4">
            Explore common algorithms and their complexities.
          </p>

          <ul className="divide-y">
            {[
              { name: "Bubble Sort", complexity: "O(N²)" },
              { name: "Binary Search", complexity: "O(logN)" },
              { name: "Merge Sort", complexity: "O(N logN)" },
              { name: "Hash Table Lookup", complexity: "O(1)" },
              { name: "Depth First Search", complexity: "O(V+E)" },
              { name: "Quick Sort (Average)", complexity: "O(N logN)" },
              { name: "Linked List Traversal", complexity: "O(N)" },
            ].map((item, idx) => (
              <li
                key={idx}
                className="flex justify-between py-2 px-1 hover:bg-gray-100 rounded"
              >
                <span className="flex gap-2">
                  <span className="text-gray-500">&lt;/&gt;</span>
                  {item.name}
                </span>
                <span className="text-pink-600">{item.complexity}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Complexity Graph */}
        <div className="border rounded p-4 bg-gray-50 w-[30%]">
          <h2 className="text-xl font-bold mb-1">
            Time & Space Complexity Graph
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Visualize complexities with respect to input size.
          </p>

          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={graphData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="x" />
              <YAxis
                type="number"
                domain={[1, 6]}
                ticks={[1, 2, 3, 4, 5, 6]}
                tickFormatter={(val) =>
                  complexityLevels.find((c) => c.level === val)?.label || val
                }
              />
              <Tooltip
                formatter={(value) => {
                  const item = complexityLevels.find((c) => c.level === value);
                  return item ? item.label : value;
                }}
              />
              <ReferenceLine y={3} stroke="purple" strokeDasharray="3 3" label="O(N)" />
              <Line type="monotone" dataKey="y" stroke="#8884d8" dot />
            </LineChart>
          </ResponsiveContainer>
        </div>

            {/* Best Practices */}
        <div className="border rounded p-4 bg-gray-50">
          <h2 className="text-xl font-bold mb-1">Coding Best Practices</h2>
          <p className="text-sm text-gray-500 mb-4">
            Tips for writing efficient and performant code.
          </p>

          <ul className="space-y-2 text-sm">
            <li>💡 Choose the right data structure for your problem.</li>
            <li>💡 Optimize loops and avoid unnecessary computations.</li>
            <li>💡 Understand the Big O notation for common algorithms.</li>
            <li>
              💡 Memoization or dynamic programming can prevent redundant
              calculations.
            </li>
            <li>💡 Profile your code to identify performance bottlenecks.</li>
            <li>
              💡 Break down complex problems into smaller, manageable functions.
            </li>
          </ul>
        </div>
        
      </div>

      
    </div>
  );
}
