import './index.scss';

import React, { TextareaHTMLAttributes, useMemo } from 'react';

interface IAppTextAreaProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  noFloatingLabel?: boolean;
  message?: {
    type: 'error' | 'success' | 'caption';
    text: string;
  };
  showDescription?: boolean;
  description?: string;
}

const AppTextArea = React.forwardRef<HTMLTextAreaElement, IAppTextAreaProps>(
  (
    {
      label,
      noFloatingLabel = false,
      message,
      rows = 5,
      showDescription,
      description,
      ...props
    },
    ref
  ) => {
    const __renderMessage = useMemo(() => {
      if (!message) return null;
      return (
        <p
          className={`c__textarea-message c__textarea-message-${message.type}`}
        >
          {message.text}
        </p>
      );
    }, [message]);

    return (
      <div className="c__textarea">
        <textarea
          rows={rows}
          {...props}
          className={`c__textarea-field ${
            message?.text ? `c__textarea-field-border-${message?.type}` : ''
          }${props.disabled ? ' c__textarea-field-disabled' : ''}`}
          id={props.name}
          ref={ref}
          placeholder={label}
          onChange={props?.onChange ? props?.onChange : () => {}}
        />

        <label
          className={`c__textarea-label ${
            noFloatingLabel ? 'c__textarea-label-noFloating' : ' '
          }`}
          htmlFor={props.name}
        >
          {label}
        </label>
        {showDescription && (
          <p className={`c__textarea-message c__textarea-message-description`}>
            {description}
          </p>
        )}
        {__renderMessage}
      </div>
    );
  }
);

export default AppTextArea;
