import React from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, Text } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingLeft: 10
  }
});

const Option = (props) => {
  const { style, styleText, children } = props;

  return (
    <View style={[styles.container, style]}>
      <Text style={styleText}>
        {children}
      </Text>
    </View>
  );
}

Option.propTypes = {
  children: PropTypes.string.isRequired
};

module.exports = Option;
