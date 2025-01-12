import "./index.scss";

import React, { InputHTMLAttributes, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  UPLOAD_AVATAR_ACCEPT_FILES,
  UPLOAD_AVATAR_MAX_MB,
  UPLOAD_AVATAR_RESOLUTION,
} from "src/constants/upload.constant";
import { calculateFileSizeInMB } from "src/helpers/file.helper";
import AppButton from "../AppButton";

export const ERROR_MESSAGE_LIMIT_SIZE = "ERROR_MESSAGE_LIMIT_SIZE";

interface IUploadAvatarProps extends InputHTMLAttributes<HTMLInputElement> {
  file?: File | null;
  onChangeFile?: (file: File) => void;
  onErrorFile?: (errorMessage: string) => void;
  defaultImage?: string;
  // MB
  limitSize?: number;
  accept?: string;
  resolution?: [number, number];
  ratio?: [number, number];
}

const UploadAvatar: React.FC<IUploadAvatarProps> = (
  props: IUploadAvatarProps,
) => {
  const {
    file,
    onChangeFile,
    onErrorFile,
    defaultImage = "",
    limitSize = UPLOAD_AVATAR_MAX_MB,
    accept = UPLOAD_AVATAR_ACCEPT_FILES,
    resolution = UPLOAD_AVATAR_RESOLUTION,
    ratio = [],
  } = props;

  const [image, setImage] = useState<string>("");

  useEffect(() => {
    if (!!file) {
      setImage(URL.createObjectURL(file));
    }
  }, [file]);

  const [isDragging, setIsDragging] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // handle drag events
  const handleDrag = (
    event: React.DragEvent<HTMLFormElement | HTMLDivElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === "dragenter" || event.type === "dragover") {
      setIsDragging(true);
    } else if (event.type === "dragleave") {
      setIsDragging(false);
    }
  };

  // triggers when file is dropped
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      handleAddFile(event.dataTransfer.files[0]);
    }
  };

  // triggers when file is selected with click
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (event.target.files && event.target.files[0]) {
      handleAddFile(event.target.files[0]);
    }
  };

  // handle when dropped or selected files.
  const handleAddFile = (file: File) => {
    if (calculateFileSizeInMB(file) > limitSize) {
      if (!!onErrorFile) {
        onErrorFile(ERROR_MESSAGE_LIMIT_SIZE);
      }
      return;
    }

    if (onChangeFile) onChangeFile(file);
  };

  const id = uuidv4();

  return (
    <div className="c__uploadAvatar">
      <form
        className="c__file-uploadAvatar"
        onDragEnter={handleDrag}
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="c__file-uploadAvatar-input"
          id={`avatar-upload-${id}`}
          onChange={handleChange}
          onClick={(event: any) => {
            event.target.value = null;
          }}
        />

        {defaultImage || (!!file && !!image) ? (
          <label
            className={`c__file-uploadAvatar-display ${
              isDragging ? "drag-active" : ""
            }`}
            onClick={(
              event: React.MouseEvent<HTMLLabelElement, MouseEvent>,
            ) => {
              event.preventDefault();
            }}
          >
            <img src={image || defaultImage} alt="user-avatar" />
            <div className="c__file-uploadAvatar-display-overlay">
              <AppButton onClick={() => inputRef.current?.click()}>
                <img src="/icons/gallery.svg" alt="gallery" />
                <p>Change Picture</p>
              </AppButton>
            </div>
          </label>
        ) : (
          <label
            className={`c__file-uploadAvatar-label ${
              isDragging ? "drag-active" : ""
            }`}
            htmlFor={`avatar-upload-${id}`}
          >
            <div className="c__file-uploadAvatar-label-content">
              <div className="c__file-uploadAvatar-label-content-image">
                <img src="/icons/gallery.svg" alt="gallery" />
              </div>
              <p>
                Image: {accept.replace(/\./g, "")}. <br />
                Size Maximum: {limitSize}mb. <br />
                {ratio.length === 2 ? (
                  <>
                    {`Ratio: ${ratio[0]}:${ratio[1]}.`} <br />
                  </>
                ) : (
                  ""
                )}
                Resolution: {resolution[0]}x{resolution[1]}px. <br />
              </p>
            </div>
          </label>
        )}

        {isDragging && (
          <div
            className="c__file-uploadAvatar-drag-element"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          ></div>
        )}
      </form>
    </div>
  );
};

export default UploadAvatar;
