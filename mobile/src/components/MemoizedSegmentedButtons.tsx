import React, { memo } from 'react';
import { SegmentedButtons } from 'react-native-paper';

type MemoizedSegmentedButtonsProps = {
  value: string;
  onValueChange: (value: string) => void;
  buttons: Array<{
    value: string;
    label: string;
    icon?: string;
  }>;
  style?: any;
};

const MemoizedSegmentedButtonsComponent: React.FC<MemoizedSegmentedButtonsProps> = ({
  value,
  onValueChange,
  buttons,
  style,
}) => {
  return (
    <SegmentedButtons
      value={value}
      onValueChange={onValueChange}
      buttons={buttons}
      style={style}
    />
  );
};

// Custom comparison to prevent unnecessary re-renders
const arePropsEqual = (
  prev: MemoizedSegmentedButtonsProps,
  next: MemoizedSegmentedButtonsProps
) => {
  return (
    prev.value === next.value &&
    prev.buttons.length === next.buttons.length &&
    prev.buttons.every((btn, idx) => 
      btn.value === next.buttons[idx].value &&
      btn.label === next.buttons[idx].label &&
      btn.icon === next.buttons[idx].icon
    )
  );
};

export const MemoizedSegmentedButtons = memo(
  MemoizedSegmentedButtonsComponent,
  arePropsEqual
);
