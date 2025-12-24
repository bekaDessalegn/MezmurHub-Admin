'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import { Bold as BoldIcon, Italic as ItalicIcon } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export default function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit, Bold, Italic],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[200px] p-4',
        style: 'font-family: "Noto Serif", Georgia, serif; color: #3E2723;',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div 
      className="rounded-xl overflow-hidden border-2"
      style={{ borderColor: '#D4AF37', background: 'white' }}
    >
      {/* Toolbar */}
      <div 
        className="flex gap-2 p-3 border-b-2"
        style={{ 
          borderColor: '#D4AF37',
          background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.1) 0%, rgba(255, 215, 0, 0.1) 100%)'
        }}
      >
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="p-2 rounded-lg transition-all font-semibold"
          style={{
            background: editor.isActive('bold') ? 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)' : 'white',
            color: editor.isActive('bold') ? '#3E2723' : '#8B0000',
            border: '2px solid',
            borderColor: editor.isActive('bold') ? '#D4AF37' : '#FFFDD0',
          }}
          title="Bold (Ctrl+B)"
        >
          <BoldIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="p-2 rounded-lg transition-all font-semibold"
          style={{
            background: editor.isActive('italic') ? 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)' : 'white',
            color: editor.isActive('italic') ? '#3E2723' : '#006400',
            border: '2px solid',
            borderColor: editor.isActive('italic') ? '#D4AF37' : '#FFFDD0',
          }}
          title="Italic (Ctrl+I)"
        >
          <ItalicIcon className="h-4 w-4" />
        </button>
      </div>
      
      {/* Editor Content */}
      <div style={{ background: '#FFFDD0' }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
