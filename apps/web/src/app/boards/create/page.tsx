'use client'

import React from "react";

import { ForwardRefEditor } from "@/components/MdxEditor/ForwardRefEditor";
import { useRef } from "react";
import { MDXEditorMethods } from "@mdxeditor/editor";
import Frame from "@/components/Frame/Frame";


function CreateBoardPage() {
    const editorRef = useRef<MDXEditorMethods>(null);
    return <Frame>
        <ForwardRefEditor ref={editorRef} markdown={""} />
    </Frame>;
}

export default CreateBoardPage;
