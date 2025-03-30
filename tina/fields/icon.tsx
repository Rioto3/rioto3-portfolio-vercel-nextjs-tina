"use client";
import React from "react";
import { Button, wrapFieldsWithMeta } from "tinacms";
import { BiChevronRight } from "react-icons/bi";
import { GoCircleSlash } from "react-icons/go";
import { Icon, IconOptions, IconImages } from "../../components/icon";
import {
  Popover,
  PopoverButton,
  Transition,
  PopoverPanel,
} from "@headlessui/react";
import { ColorPickerInput } from "./color";
import Image from "next/image";

const parseIconName = (name: string) => {
  if (name in IconImages) {
    // 画像アイコンの場合、ダッシュをスペースに置き換えて単語の先頭を大文字に
    return name.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
  
  const splitName = name.split(/(?=[A-Z])/);
  if (splitName.length > 1) {
    return splitName.slice(1).join(" ");
  } else {
    return name;
  }
};

export const IconPickerInput = wrapFieldsWithMeta(({ input }) => {
  const [filter, setFilter] = React.useState("");
  const [showImageIcons, setShowImageIcons] = React.useState(true);
  const [showSvgIcons, setShowSvgIcons] = React.useState(true);
  
  const filteredBlocks = React.useMemo(() => {
    return Object.keys(IconOptions).filter((name) => {
      const isImageIcon = name in IconImages;
      if (!showImageIcons && isImageIcon) return false;
      if (!showSvgIcons && !isImageIcon) return false;
      return name.toLowerCase().includes(filter.toLowerCase());
    });
  }, [filter, showImageIcons, showSvgIcons]);

  const inputLabel = Object.keys(IconOptions).includes(input.value)
    ? parseIconName(input.value)
    : "Select Icon";
  const isImageIcon = input.value in IconImages;
  
  // 選択されたアイコンのコンポーネントの取得
  const InputIcon = IconOptions[input.value] ? IconOptions[input.value] : null;

  return (
    <div className="relative z-[1000]">
      <input type="text" id={input.name} className="hidden" {...input} />
      <Popover>
        {({ open }) => (
          <>
            <PopoverButton>
              <Button
                className={`text-sm h-11 px-4 ${InputIcon ? "h-11" : "h-10"}`}
                size="custom"
                rounded="full"
                variant={open ? "secondary" : "white"}
              >
                {InputIcon && !isImageIcon && (
                  <InputIcon className="w-7 mr-1 h-auto fill-current text-blue-500" />
                )}
                {InputIcon && isImageIcon && (
                  <div className="w-7 h-7 mr-1 relative">
                    <Image 
                      src={IconImages[input.value]} 
                      alt={input.value} 
                      width={28} 
                      height={28} 
                      className="object-contain"
                    />
                  </div>
                )}
                {inputLabel}
                {!InputIcon && (
                  <BiChevronRight className="w-5 h-auto fill-current opacity-70 ml-1" />
                )}
              </Button>
            </PopoverButton>
            <div
              className="absolute w-full min-w-[192px] max-w-2xl -bottom-2 left-0 translate-y-full"
              style={{ zIndex: 1000 }}
            >
              <Transition
                enter="transition duration-150 ease-out"
                enterFrom="transform opacity-0 -translate-y-2"
                enterTo="transform opacity-100 translate-y-0"
                leave="transition duration-75 ease-in"
                leaveFrom="transform opacity-100 translate-y-0"
                leaveTo="transform opacity-0 -translate-y-2"
              >
                <PopoverPanel className="relative overflow-hidden rounded-lg shadow-lg bg-white border border-gray-150 z-50">
                  {({ close }) => (
                    <div className="max-h-[24rem] flex flex-col w-full h-full">
                      <div className="bg-gray-50 p-2 border-b border-gray-100 z-10 shadow-sm">
                        <input
                          type="text"
                          className="bg-white text-sm rounded-sm border border-gray-100 shadow-inner py-1.5 px-2.5 w-full block placeholder-gray-200 mb-2"
                          onClick={(event: any) => {
                            event.stopPropagation();
                            event.preventDefault();
                          }}
                          value={filter}
                          onChange={(event: any) => {
                            setFilter(event.target.value);
                          }}
                          placeholder="Filter..."
                        />
                        <div className="flex gap-2">
                          <label className="flex items-center text-xs text-gray-500">
                            <input
                              type="checkbox"
                              checked={showImageIcons}
                              onChange={() => setShowImageIcons(!showImageIcons)}
                              className="mr-1"
                            />
                            画像アイコン
                          </label>
                          <label className="flex items-center text-xs text-gray-500">
                            <input
                              type="checkbox"
                              checked={showSvgIcons}
                              onChange={() => setShowSvgIcons(!showSvgIcons)}
                              className="mr-1"
                            />
                            SVGアイコン
                          </label>
                        </div>
                      </div>
                      {filteredBlocks.length === 0 && (
                        <span className="relative text-center text-xs px-2 py-3 text-gray-300 bg-gray-50 italic">
                          No matches found
                        </span>
                      )}
                      {filteredBlocks.length > 0 && (
                        <div className="w-full grid grid-cols-6 auto-rows-auto p-2 overflow-y-auto">
                          <button
                            className="relative rounded-lg text-center text-xs py-2 px-3 flex-1 outline-none transition-all ease-out duration-150 hover:text-blue-500 focus:text-blue-500 focus:bg-gray-50 hover:bg-gray-50"
                            key={"clear-input"}
                            onClick={() => {
                              input.onChange("");
                              setFilter("");
                              close();
                            }}
                          >
                            <GoCircleSlash className="w-6 h-auto text-gray-200" />
                          </button>
                          {filteredBlocks.map((name) => {
                            const isImgIcon = name in IconImages;
                            return (
                              <button
                                className="relative flex items-center justify-center rounded-lg text-center text-xs py-2 px-3 flex-1 outline-none transition-all ease-out duration-150 hover:text-blue-500 focus:text-blue-500 focus:bg-gray-50 hover:bg-gray-50"
                                key={name}
                                onClick={() => {
                                  input.onChange(name);
                                  setFilter("");
                                  close();
                                }}
                              >
                                {isImgIcon ? (
                                  <div className="w-7 h-7 relative">
                                    <Image 
                                      src={IconImages[name]} 
                                      alt={name} 
                                      width={28} 
                                      height={28} 
                                      className="object-contain" 
                                    />
                                  </div>
                                ) : (
                                  <Icon
                                    data={{
                                      name: name,
                                      size: "custom",
                                      color: "blue",
                                    }}
                                    className="w-7 h-auto"
                                  />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </PopoverPanel>
              </Transition>
            </div>
          </>
        )}
      </Popover>
    </div>
  );
});

export const iconSchema = {
  type: "object",
  label: "Icon",
  name: "icon",
  fields: [
    {
      type: "string",
      label: "Icon",
      name: "name",
      ui: {
        component: IconPickerInput,
      },
    },
    {
      type: "string",
      label: "Color",
      name: "color",
      ui: {
        component: ColorPickerInput,
      },
    },
    {
      name: "style",
      label: "Style",
      type: "string",
      options: [
        {
          label: "Circle",
          value: "circle",
        },
        {
          label: "Float",
          value: "float",
        },
      ],
    },
  ],
};