import React, { useRef, useState, useMemo, useCallback, forwardRef, useImperativeHandle } from "react";
import PropTypes from "prop-types";
import {
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const Option = require("./option");
const Items = require("./items");

const Select = forwardRef((props, ref) => {
  const {
    initKey,
    data,
    placeholder,
    parentScrollEnable,
    parentScrollDisable,
    onSelect,
    width,
    height,
    style,
    styleOption,
    styleText,
    searchPlaceholder,
    TextInput,
    TextInputProps
  } = props;

  const selectRef = useRef(null);

  const dimensions = useMemo(
    () => ({ width, height }),
    [width, height]
  );

  const initialValue = useMemo(
    () => {
     if (initKey) {
        return data.filter((item) => item.key === this.props.initKey)[0].label;
      } else {
        return placeholder;
      }
    },
    // eslint-disable-next-line
    []
  );

  const [showOptions, setShowOptions] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [value, setValue] = useState(initialValue);
  const [location, setLocation] = useState({});

  const _reset = useCallback(
    () => {
      setValue(initialValue);
      setShowOptions(false);
      setSearchText("");
      onSelect(null, null);
      if (parentScrollEnable) {
        parentScrollEnable();
      }
    },
    [initialValue, onSelect, parentScrollEnable]
  );

  const _onPress = useCallback(
    () => {
      selectRef.current.measure((width, height, px, py, fx, fy) => {
        const newLocation = {
          fx: fx,
          fy: fy,
          px: px,
          py: py,
          width: width,
          height: height,
        };
        setLocation(newLocation);
      });
      if (showOptions) {
        setShowOptions(false);
        setSearchText("");
      } else {
        setShowOptions(true);
        if (parentScrollDisable) {
          parentScrollDisable();
        }
      }
    },
    [selectRef, showOptions, parentScrollDisable]
  );

  const _handleSelect = useCallback(
    (key, label) => {
      setShowOptions(false);
      setValue(label);
      setSeatchText("");
      onSelect(key, label);
      if (parentScrollEnable) {
        parentScrollEnable();
      }
    },
    [onSelect, parentScrollEnable]
  );

  const _onChangeInput = useCallback(
    (text) => setSearchText(text),
    []
  );

  const _handleOptionsClose = useCallback(
    () =>  {
      setShowOptions(false);
      setSeatchText("");
      if (parentScrollEnable) {
        parentScrollEnable();
      }
    },
    [parentScrollEnable]
  )

  useImperativeHandle(ref, () => ({
    _reset,
    _onPress,
    _handleOptionsClose
  }))

  return (
    <View>
      <View
        ref={selectRef}
        style={[
          style,
          dimensions,
          {flexDirection: 'row', justifyContent: 'space-between'},
        ]}
      >
        {!showOptions && (
          <TouchableWithoutFeedback onPress={_onPress}>
            <View
              style={{
                flex: 3,
              }}
            >
              <Option style={styleOption} styleText={styleText}>
                {value}
              </Option>
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
      {showOptions && (
        <Items
          items={data.filter((item) => {
            const parts = searchText.trim().split(/[ \-:]+/);
            const regex = new RegExp(`(${parts.join('|')})`, 'ig');
            return regex.test(item.label);
          })}
          show={showOptions}
          width={width}
          height={height}
          location={location}
          onPress={_handleSelect}
          handleClose={_handleOptionsClose}
          onChangeText={_onChangeInput}
          placeholder={searchPlaceholder}
          TextInput={TextInput}
          TextInputProps={TextInputProps}
        />
      )}
    </View>
  );
})

Select.propTypes = {
  width: PropTypes.number,
  height: PropTypes.number,
  onSelect: PropTypes.func,
  search: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  initKey: PropTypes.number,
  TextInput: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.object
  ]),
  TextInputProps: PropTypes.object
};

Select.defaultProps = {
  width: 200,
  height: 40,
  onSelect: () => {},
  search: true,
  initKey: 0,
  placeholder: 'Select',
  searchPlaceholder: 'Search',
  TextInput: TextInput,
  TextInputProps: {}
};

module.exports = Select;
