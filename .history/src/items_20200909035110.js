import React, { useMemo } from "react";
import PropTypes from "prop-types";
import {
  Dimensions,
  StyleSheet,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  Text,
  Modal
} from "react-native";

const Overlay = require("./overlay");

const window = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "absolute",
    borderColor: "#BDBDC1",
    borderWidth: 2 / window.scale,
    backgroundColor: "white",
    opacity: 0.9
  }
});

const Items = (props) => {
  const {
    items,
    onPress,
    width,
    height,
    location,
    show,
    handleClose,
    onChangeText,
    placeholder,
    TextInput,
    TextInputProps
  } = props;

  const { x, y } = useMemo(
    () => ({
      x: location ? location.fx : 0,
      y: location ? location.fy : 0
    }),
    [location]
  );

  const renderedItems = useMemo(
    () => items.map((item, idx) => {
      return item.section ? (
        <View style={{ padding: 5 }} key={idx}>
          <Text style={{ fontWeight: "bold" }}>{item.label}</Text>
        </View>
      ) : (
        <TouchableWithoutFeedback
          onPress={() => onPress(item.key, item.label)}
          key={idx}
        >
          <View style={{ padding: 5 }}>
            <Text style={{ marginLeft: 20 }}>{item.label}</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    }),
    [items]
  );

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={show}
      onRequestClose={handleClose}
    >
      <Overlay onPress={handleClose} />
      <View style={[styles.container, {left: x, top: y, width: width}]}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          <TextInput
            onChangeText={onChangeText}
            placeholder={placeholder}
            underlineColorAndroid="transparent"
            style={{flex: 5, margin: 0, padding: 0}}
            {...TextInputProps}
          />
        </View>
        <ScrollView
          style={{width: width - 2, height: height * 3}}
          automaticallyAdjustContentInsets={false}
          bounces={false}
        >
          {renderedItems}
        </ScrollView>
      </View>
    </Modal>
  );
}

Items.propTypes = {
  onPress: PropTypes.func
};

Items.defaultProps = {
  width: 0,
  height: 0,
  onPress: () => {}
};

module.exports = Items;
