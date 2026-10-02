import React, { useMemo } from 'react';
import katex from 'katex';

interface FormulaProps {
  tex: string;
  className?: string;
  inline?: boolean;
}

export const Formula: React.FC<FormulaProps> = ({
  tex,
  className = '',
  inline = false,
}) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: !inline,
        throwOnError: false,
        strict: false,
      });
    } catch (err) {
      console.warn('KaTeX render error:', err);
      return `<span class="font-mono text-amber-300">${tex}</span>`;
    }
  }, [tex, inline]);

  if (inline) {
    return (
      <span
        className={`inline-math font-serif tracking-wide text-cyan-200 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div
      className={`display-math py-1 px-2 my-1 overflow-x-auto text-cyan-100 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
