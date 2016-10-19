function printObjectProperties(name, object, indent) {
  if (indent == undefined) {
    indent = 0;
  }
  var t = "";
  for (var i=0; i<indent; i++) {
    t += "  ";
  }
  var output = t + name + ": ";
  var type = typeof(object);
  if (type != "object") {
    output += object + "\n";
    return output;
  }
  else {
    output += "{\n"
    for (var key in object) {
      if (object.hasOwnProperty(key)) {
          output += t + printObjectProperties(key, object[key], indent + 1);
      }
    }
    output += t + "}\n";
    return output;
  }
}

function printObject(name, object) {
  console.log(printObjectProperties(name,object));
}

module.exports = printObject;
