/*
 ** Normally we would use dist folder for distribution code
 ** but since we are coming from the java world - "target" folder
 ** is more relevant to us. (default output folder of a maven job)
 **
 ** grunt clean => mvn clean
 **
 */

module.exports = (grunt) => {

  grunt.initConfig({
    env: {
      test: {
        DEBUG: "evolvus*"
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: "spec",
        },
        src: ["test/**/*.js"]
      },
    },
    jshint: {
      options: {
        "esversion": 6
      },
      files: {
        src: ["*.js", "db/*.js", "routes/*.js", "routes/*/*.js", "test/**/*.js"]
      }
    },
    watch: {
      files: ["<%= jshint.files.src %>"],
      tasks: ["jshint"]
    },
  });

  grunt.loadNpmTasks("grunt-env");
  grunt.loadNpmTasks("grunt-mocha-test");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-watch");
  grunt.loadNpmTasks('grunt-sonar-runner');

  grunt.registerTask("default", ["jshint", "env:test", "mochaTest"]);
};
