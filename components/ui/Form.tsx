import { StyleSheet, TouchableHighlight, View, ViewProps, TouchableHighlightProps } from 'react-native';
import * as Colors from '@bacons/apple-colors'
import { IconSymbol } from '@/components/ui/IconSymbol';
import React from 'react';


export function FormItem({ children, onPress }: Pick<ViewProps, 'children'> & Pick<TouchableHighlightProps, 'onPress'>) {
  let leadingIconChild: React.ReactNode;
  let parsedChildren: React.ReactNode[] = [];
  React.Children.forEach(children, (child, index) => {
    if (!React.isValidElement(child)) return;

    if (child.type === IconSymbol && index === 0) {
      leadingIconChild = React.cloneElement(child, {

        size: 24,
        style: { width: 60, top: 0 },
        ...child.props
      });
    } else {
      parsedChildren.push(child);
    }
  });

  return (
    <TouchableHighlight style={[{ padding: 12, paddingLeft: !!leadingIconChild ? 0 : 16 }]} underlayColor={Colors.systemGray4} onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {leadingIconChild}
        {parsedChildren}
      </View>
    </TouchableHighlight>
  )
}

export function FormList({ children, ...props }: ViewProps) {
  const childrenWithSeparator = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      const isLastChild = index === React.Children.count(children) - 1;
      return (
        <>
          {child}
          {!isLastChild && (
            <Separator />
          )}
        </>
      );
    }
    return child;
  });

  return <View {...props} style={[{
    borderCurve: 'continuous',
    overflow: 'hidden',
    borderRadius: 10,

    backgroundColor: Colors.secondarySystemGroupedBackground
  }, props.style]} children={childrenWithSeparator} />
}

function Separator() {
  return <View style={{ marginStart: 60, borderBottomWidth: StyleSheet.hairlineWidth, marginTop: -StyleSheet.hairlineWidth, borderBottomColor: Colors.separator }} />
}