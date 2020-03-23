import * as React from 'react';
import {Text, View} from 'react-native';
import {RectButton} from "react-native-gesture-handler";
import {Ionicons} from "@expo/vector-icons";

export function OptionButton({ icon, label, onPress, selected, colorOption, isLastOption, hide}) {
  return (
    <RectButton style={[styles.option, isLastOption && styles.lastOption, selected && styles.selectedOption, hide && styles.hiddenOption, colorOption]} onPress={onPress}>
      <View style={{ flexDirection: 'row' }}>
        <View style={styles.optionIconContainer}>
          <Ionicons name={icon} size={22} color="rgba(255,255,255,0.85)" />
        </View>
        <View style={styles.optionTextContainer}>
          <Text style={styles.optionText}>{label}</Text>
        </View>
      </View>
    </RectButton>
  );
}
