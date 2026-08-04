import { Bold, Italic, Heading, Link as LinkIcon, Code, Code2, List, Quote } from 'lucide-react';

interface MarkdownToolbarProps {
  /** 在 textarea 当前光标位置插入文本的回调 */
  onInsert: (before: string, after?: string, placeholder?: string) => void;
}

interface ToolButton {
  icon: typeof Bold;
  label: string;
  before: string;
  after?: string;
  placeholder?: string;
}

const TOOLS: ToolButton[] = [
  { icon: Bold, label: '加粗 (⌘B)', before: '**', after: '**', placeholder: '加粗文字' },
  { icon: Italic, label: '斜体 (⌘I)', before: '*', after: '*', placeholder: '斜体文字' },
  { icon: Heading, label: '标题', before: '### ', placeholder: '标题文字' },
  {
    icon: LinkIcon,
    label: '链接 (⌘K)',
    before: '[',
    after: '](https://)',
    placeholder: '链接文字',
  },
  { icon: Code, label: '行内代码', before: '`', after: '`', placeholder: 'code' },
  { icon: Code2, label: '代码块', before: '```js\n', after: '\n```', placeholder: '// code here' },
  { icon: List, label: '列表', before: '- ', placeholder: '列表项' },
  { icon: Quote, label: '引用', before: '> ', placeholder: '引用内容' },
];

export function MarkdownToolbar({ onInsert }: MarkdownToolbarProps) {
  return (
    <div className="border-stroke mb-2 flex flex-wrap gap-1 border-b pb-2">
      {TOOLS.map((tool) => (
        <button
          key={tool.label}
          type="button"
          title={tool.label}
          onClick={() => onInsert(tool.before, tool.after, tool.placeholder)}
          className="text-muted hover:bg-surface hover:text-heading flex h-8 w-8 items-center justify-center rounded-md transition-colors duration-150"
        >
          <tool.icon size={16} />
        </button>
      ))}
    </div>
  );
}
