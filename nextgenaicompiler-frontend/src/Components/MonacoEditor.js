import React, { useRef } from "react";
import Editor from "@monaco-editor/react";

export default function CodeEditor({ language = "python", code, setCode }) {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;

    const domNode = editor.getDomNode();

    if (!domNode) return;

    domNode.addEventListener("wheel", (e) => {
      const scrollTop = editor.getScrollTop();
      const scrollHeight = editor.getScrollHeight();
      const editorHeight = editor.getLayoutInfo().height;

      const atTop = scrollTop <= 0;
      const atBottom = scrollTop + editorHeight >= scrollHeight;

      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      // if user tries to scroll past bottom or top
      if ((atBottom && scrollingDown) || (atTop && scrollingUp)) {
        e.preventDefault(); // stop Monaco from eating it
        e.stopPropagation();

        // let parent scroll instead
        if (domNode.parentElement) {
          domNode.parentElement.scrollBy({
            top: e.deltaY,
            behavior: "auto",
          });
        }
      }
    }, { passive: false });
  };

  return (
    <div
      style={{
        paddingTop: 0,
        height: "600px",
        width: "100%",
        overflow: "auto",
        border: "1px solid #ddd",
      }}
    >
      <Editor
        height="100%"
        defaultLanguage={language}
        language={language}
        theme="vs-light"
        value={code}
        onChange={(value) => setCode(value || "")}
        onMount={handleEditorDidMount}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          formatOnType: true,
          formatOnPaste: true,
          wordWrap: "on",
        }}
      />
    </div>
  );
}
