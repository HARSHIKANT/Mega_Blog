import React from 'react'
import {Editor} from '@tinymce/tinymce-react';
import { Controller } from 'react-hook-form';
import { useEffect } from 'react';

export default function RTE({name, control, label, defaultValue = ''}) {
  return (
    <div className='w-full'>
        {label && <label className='inline-block mb-1 pl-1'>
            {label}</label>}
            <Controller
                name = {name || 'content'}
                control = {control}
                render = {({field:{onChange}}) => (
                    <Editor
                        apiKey='ac4prox3usma4bz8j8pppy86yyaa35z4g6fodu8irj88ae6t'
                        initialValue={defaultValue}
                        init={{
                            initialValue: defaultValue,
                            height: 500,
                            menubar: false,
                            plugins: [
                                "image",
                                "advlist",
                                "autolink",
                                "lists",
                                "link",
                                "charmap",
                                "preview",
                                "anchor",
                                "searchreplace",
                                "visualblocks",
                                "code",
                                "fullscreen",
                                "insertdatetime",
                                "media",
                                "table",
                                "help",
                                "wordcount",
                            ],
                            toolbar:
                                "undo redo | blocks | " +
                                "bold italic forecolor | alignleft aligncenter " +
                                "alignright alignjustify | bullist numlist outdent indent | " +
                                "removeformat | image link media table | help",
                            content_style:
                                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                        }}
                        onEditorChange={onChange}
                    />
                )}
            />
    </div>
  )
}

