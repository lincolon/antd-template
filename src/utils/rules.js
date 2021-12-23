export default {
  phoneReg: /^(1(3|4|5|6|7|8|9)\d{9})|(0\d{2}\d?-?\d{7,8})|((4|8)00\d{7})$/g,
  passReg: /(((@?|@+)(\w?|\w+))?|((@?|@+)(\w?|\w+))+(@?|@+)){6}/g,
  floatNumberReg: /^[1-9]\d*\.?\d*$|^0\.\d*[1-9]\d*$/g,
  onlyFloatNumberReg: /^[1-9]\d*\.\d*$|^0\.\d*[1-9]\d*$/g,
  zeroNumberReg: /^[1-9]\d*\.?\d*$|^0\.\d*[1-9]\d*|0$/g,
  intNumberReg: /^[1-9]\d*|0$/g,
}