import React, { useState } from "react";
import CCAnalyzer from "./Components/CCAnalyzerPage";
import LogInUp from "./Components/LogInUp";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


export default function App() {

  return (
     <Router>
      <Routes>
        {/* also need to add & lang = java */}
        <Route path="/:tab" element={<CCAnalyzer/>} />
         <Route path="/" element={<CCAnalyzer/>} />
          <Route path="/auth" element={<LogInUp/>} />
      </Routes>
    </Router>
    
  );
}


// import MyComponent from "./MyComponent";

// export default function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/:letter" element={<MyComponent />} />
//       </Routes>
//     </Router>
//   );
// }