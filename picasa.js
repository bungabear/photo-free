var java = require('java');
var jarfile = "gdata-potos-2.0.jar";
java.classpath.push("./lib/");
var service = java.import(jarfile);
