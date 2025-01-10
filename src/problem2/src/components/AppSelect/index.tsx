import "./index.scss";

import {
  InputHTMLAttributes,
  ReactNode,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Popup from "reactjs-popup";
import { HiChevronDown, HiChevronUp, HiOutlineCheck } from "react-icons/hi";
import { GoXCircleFill } from "react-icons/go";
import { compact } from "lodash";
import { BeatLoader } from "react-spinners";
import { IOption } from "src/interfaces";

type InputSize = "large" | "small";

interface IAppSelectProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  placeholder?: string;
  options?: IOption[];
  inputSize?: InputSize;
  noFloatingLabel?: boolean;
  showLabel?: boolean;
  onClearSelection?: () => void;
  onChange?: (event: any) => void;
  message?: {
    type: "error" | "success" | "caption";
    text: string;
  };
  multiValue?: boolean;
  searchable?: boolean;
  value: string;
  warning?: boolean;
  warningValue?: ReactNode;
  tooltipComponent?: ReactNode;
  startIcon?: ReactNode;
  loading?: boolean;
  showDescription?: boolean;
  description?: string;
}

const AppSelect = forwardRef<HTMLInputElement, IAppSelectProps>(
  (
    {
      label,
      placeholder,
      showLabel = true,
      options = [],
      inputSize = "large",
      noFloatingLabel = false,
      onClearSelection,
      message,
      multiValue = false,
      searchable = true,
      value,
      onChange,
      disabled,
      warning,
      warningValue,
      tooltipComponent,
      startIcon,
      loading,
      showDescription = false,
      description = "",
      ...props
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [width, setWidth] = useState<number>(0);
    const [selectedValues, setSelectedValues] = useState<(string | number)[]>(
      multiValue
        ? String(value)
            .split(",")
            .filter((item) => item.trim())
        : [value],
    );

    const [showTooltip, setShowTooltip] = useState(false);
    const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.currentTarget.offsetWidth < e.currentTarget.scrollWidth) {
        setShowTooltip(true);
      }
    };

    const handleMouseLeave = () => {
      setShowTooltip(false);
    };

    useEffect(() => {
      if (showOptions) {
        document.getElementsByTagName("body")[0].style.overflow = "hidden";
        if (document.getElementsByClassName("disable-scroll")[0]) {
          (
            document.getElementsByClassName("disable-scroll")[0] as HTMLElement
          ).style.overflow = "hidden";
        }
      } else {
        document.getElementsByTagName("body")[0].style.overflow = "auto";
        if (document.getElementsByClassName("disable-scroll")[0]) {
          (
            document.getElementsByClassName("disable-scroll")[0] as HTMLElement
          ).style.overflow = "auto";
        }
      }
    }, [showOptions]);

    useEffect(() => {
      if (typeof value === "string") {
        setSelectedValues(
          multiValue
            ? value
                .split(",")
                .map((item) => item.trim())
                .filter((item) => item.length)
            : [value],
        );
      } else {
        setSelectedValues([value]);
      }
    }, [multiValue, value]);
    const selectRef = useRef<HTMLDivElement>(null); // Specify the type here

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          handleCloseOptions();
        }
      };
      setWidth(selectRef.current?.getBoundingClientRect().width || 0);

      document.addEventListener("click", handleClickOutside);

      const handleResize = () => {
        setTimeout(() => {
          setWidth(selectRef.current?.getBoundingClientRect().width || 0);
        }, 300);
      };

      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        document.removeEventListener("click", handleClickOutside);
      };
    }, []);

    const selectedOptions: IOption[] = useMemo(() => {
      return compact(
        selectedValues.map((value) =>
          options?.find((option) => String(option.value) === String(value)),
        ),
      );
    }, [options, selectedValues]);
    const handleFocus = () => {
      if (!disabled) {
        setIsFocused(true);
        setShowOptions(true);
      }
    };

    const handleCloseOptions = () => {
      setShowOptions(false);
      setIsFocused(false);
    };

    const handleOptionClick = async (
      value: string | number,
      canNotBeRemoved = false,
    ) => {
      if (multiValue) {
        let values = "";
        // Toggle selection for multi-value mode
        await setSelectedValues((prevSelectedValues) => {
          const isSelected = prevSelectedValues.find(
            (item: string | number) => String(item) === String(value),
          );
          if (isSelected) {
            if (canNotBeRemoved) {
              values = prevSelectedValues.join(",");
              return prevSelectedValues;
            }
            values = prevSelectedValues
              .filter((v) => String(v) !== String(value))
              .join(",");
            return prevSelectedValues.filter(
              (v) => String(v) !== String(value),
            );
          } else {
            values = [...prevSelectedValues, value].join(",");
            return [...prevSelectedValues, value];
          }
        });
        if (onChange) {
          const event = new Event("input", { bubbles: true });
          Object.defineProperty(event, "target", {
            value: { ...props, value: values },
            enumerable: true,
          });
          onChange(event);
        }
      } else {
        setSelectedValues([value]);
        // Update the input value for single-value mode
        if (onChange) {
          const event = new Event("input", { bubbles: true });
          Object.defineProperty(event, "target", {
            value: { ...props, value },
            enumerable: true,
          });
          onChange(event);
        }
        setShowOptions(false);
      }
    };

    const handleClearSearch = useCallback(() => {
      setSearchValue("");
    }, []);

    const filteredOptions = useMemo(() => {
      if (!searchValue) {
        return options;
      }
      const searchLowercase = searchValue?.toLowerCase();
      return options?.filter((option) =>
        option.label?.toLowerCase().includes(searchLowercase),
      );
    }, [options, searchValue]);

    const __renderClearSearch = useMemo(() => {
      if (searchValue === "" || !onClearSelection) return null;
      return (
        <div className="c__select-clear" onClick={handleClearSearch}>
          <GoXCircleFill fontSize={15} style={{ marginRight: 5 }} />
        </div>
      );
    }, [handleClearSearch, onClearSelection, searchValue]);

    const __renderMessage = useMemo(() => {
      if (!message) return null;
      return (
        <p className={`c__select-message c__select-message-${message.type}`}>
          {message.text}
        </p>
      );
    }, [message]);
    const getInputValue = () => {
      return selectedOptions[0]?.label || "";
    };

    const renderSelectedValues = () => {
      return (
        <>
          <div className="selected-values">
            {selectedOptions.map((option: IOption, idx: number) => (
              <div key={idx} className="selected-value">
                <div>{option?.label}</div>
                {!option.canNotBeRemoved && (
                  <GoXCircleFill
                    className="c__select-clear"
                    onClick={() =>
                      handleOptionClick(option?.value, option.canNotBeRemoved)
                    }
                  />
                )}
              </div>
            ))}
          </div>
        </>
      );
    };

    return (
      <div className="c__select" style={props.style} ref={selectRef}>
        <div style={{ position: "relative" }}>
          <div
            className={`c__select-field c__select-field-${inputSize}${
              isFocused ? "c__select-field-focused" : ""
            }${!!startIcon ? "c__select-field-with-prefix" : ""}${
              warning ? "c__select_border_warning" : ""
            }${message?.text ? ` c__select_border-${message?.type}` : ""}${
              disabled ? "c__select-field-disabled" : ""
            }`}
            onClick={handleFocus}
          >
            {multiValue && selectedValues.length ? (
              renderSelectedValues()
            ) : (
              <input
                style={{ pointerEvents: "none" }}
                {...props}
                disabled={disabled}
                className={`c__select-input`}
                id={props.name}
                ref={ref}
                placeholder={placeholder ? placeholder : label}
                value={getInputValue()}
                autoComplete="off"
                onChange={() => null}
                onFocus={() => null}
                onBlur={() => null}
              />
            )}
            <div className="c__select-field-icon">
              {isFocused ? <HiChevronUp /> : <HiChevronDown />}
            </div>
          </div>
          <Popup
            open={showOptions}
            position={["bottom left", "top left"]}
            className="c__select-popup"
            trigger={<div></div>}
            onClose={() => handleCloseOptions()}
            onOpen={() => setShowOptions(true)}
            arrow={false}
            on={["focus", "hover"]}
            closeOnDocumentClick={false}
          >
            <div
              className="c__select-options-container"
              onFocus={handleFocus}
              style={{
                width:
                  selectRef.current?.getBoundingClientRect().width || width,
              }}
            >
              {searchable && (
                <div className="c__select-search">
                  <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder="Search..."
                  />
                  {__renderClearSearch}
                </div>
              )}

              <div
                className="c__select-options"
                style={{ marginTop: searchable ? 10 : 0 }}
              >
                {filteredOptions?.length && !loading ? (
                  filteredOptions?.map((option, idx) => (
                    <div
                      key={idx}
                      className={`c__select-option ${
                        selectedValues.includes(String(option.value))
                          ? "c__select-option-selected"
                          : ""
                      }`}
                      onClick={() =>
                        handleOptionClick(option.value, option.canNotBeRemoved)
                      }
                    >
                      <Popup
                        className="c__select-option-popup"
                        arrow={false}
                        position={"top left"}
                        on={[]} // hide tooltip 10/09/2024
                        trigger={
                          <div className="c__select-option-label-wrapper">
                            <div
                              className="c__select-option-label"
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                            >
                              {option.label} {option.hint}
                            </div>
                          </div>
                        }
                      >
                        <div
                          className={`c__select-option-label-tooltip ${
                            showTooltip ? "" : "hide"
                          }`}
                        >
                          {option?.label} {option?.hint}
                        </div>
                      </Popup>

                      {selectedValues.includes(String(option.value)) && (
                        <HiOutlineCheck size={16} />
                      )}
                    </div>
                  ))
                ) : (
                  <div
                    style={{
                      padding: "10px 12px",
                      textAlign: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className="c__select-option-label">
                      {loading ? <BeatLoader color="white" /> : "No value"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Popup>
          {startIcon && <div className="c__select-prefix">{startIcon}</div>}
          {showLabel && (
            <label
              className={`c__select-label ${
                noFloatingLabel ? "c__select-label-noFloating" : ""
              }`}
              htmlFor={props.name}
            >
              {label}
              {warning && (
                <div className="warning-conflict">{tooltipComponent}</div>
              )}
              {warning && (
                <div className="warning-conflict-message">{warningValue}</div>
              )}
            </label>
          )}
        </div>{" "}
        {showDescription && (
          <p className={`c__select-message c__select-message-description`}>
            {description}
          </p>
        )}
        {__renderMessage}
      </div>
    );
  },
);

export default memo(AppSelect);
