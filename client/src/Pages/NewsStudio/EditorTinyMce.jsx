import React, {useEffect, useState} from 'react';
import {useRef} from 'react';
import { Editor } from '@tinymce/tinymce-react';
import {useDispatch, useSelector} from "react-redux"
import { GetBodyRx} from '../../Actions'

const EditorTinyMce = ({DefaultValue}) => {
    const dispatch = useDispatch()
    const editorRef = useRef(null);
    const [random, setRandom] = useState()

    const log = () => {
        if (editorRef.current)
            dispatch(GetBodyRx({BodyOne: editorRef.current.getContent()}))

    }
    const TextonChange = (e) => {
    setRandom(editorRef.current.getContent())
    }
     useEffect(()=>{
         log()
     }, [random])

    return (
        <>
            <Editor
                onInit={(evt, editor) => editorRef.current = editor}
                initialValue={DefaultValue}
                apiKey='wedlortwl9wi9mo9a1yr1wml36tquoqbs50cnkjekf5dzss2'
                init={{
                    height: 500,
                    skin: 'snow',
                    icons: 'thin',
                    content_css: 'dark',
                    element_format: 'xhtml',
                    quickbars_insert_toolbar: '',
                    quickbars_selection_toolbar: '',
                    menubar: false,
                    plugins: 'quickbars lists code table codesample textcolor',
                    toolbar: 'blocks | forecolor backcolor | bold italic underline strikethrough | link blockquote codesample | align bullist numlist | code ',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px; margin: 2rem 5%; }',
                    extended_valid_elements: 'span[*]',
                    mediaembed_inline_styles: true,
                }}
                onSelectionChange={TextonChange}
            />

        </>
    );
};

EditorTinyMce.defaultProps = {
    DefaultValue: '',

};
export default EditorTinyMce;