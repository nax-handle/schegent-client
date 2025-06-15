"use client";

import { forwardRef, useMemo, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { cn } from "@/lib/utils";
import { useForwardedRef } from "@/lib/config/use-forwarded-ref";
import type { ButtonProps } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
}

const ColorPicker = forwardRef<
  HTMLInputElement,
  Omit<ButtonProps, "value" | "onChange" | "onBlur"> & ColorPickerProps
>(
  (
    { disabled, value, onChange, onBlur, name, className, ...props },
    forwardedRef
  ) => {
    const ref = useForwardedRef(forwardedRef);
    const [open, setOpen] = useState(false);

    const parsedValue = useMemo(() => {
      return value || "#FFFFFF";
    }, [value]);

    return (
      <div className={cn("relative inline-block", className)}>
        <Button
          {...props}
          className="block"
          name={name}
          disabled={disabled}
          onClick={() => setOpen((prev) => !prev)}
          size="icon"
          style={{
            backgroundColor: parsedValue,
          }}
          variant="outline"
          onBlur={onBlur}
        >
          <div />
        </Button>
        {open && (
          <div
            className="absolute z-10 mt-2 bg-white border rounded shadow p-4"
            style={{ minWidth: 220 }}
          >
            <HexColorPicker color={parsedValue} onChange={onChange} />

            <Input
              maxLength={7}
              onChange={(e) => {
                onChange(e?.currentTarget?.value);
              }}
              ref={ref}
              value={parsedValue}
              className="mt-2"
            />
            <div className="flex justify-end mt-2">
              <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
                Đóng
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }
);
ColorPicker.displayName = "ColorPicker";

export default ColorPicker;
