module.exports = function(grunt) {
  // define task specific options
  grunt.initConfig({
    watch: {
      options: {
        livereload: true
      },

      js: {
        files: ['src/js/**/*.js'],
        tasks: ['concat:server'],
        options: {
          spawn: false,
        },
      },

      css: {
        files: ['src/css/**/*.css'],
        tasks: ['concat:server', 'autoprefixer:server'],
        options: {
          spawn: false,
        }
      },

      copy: {
        files: ['src/*', 'src/assets/**'],
        tasks: ['copy:server'],
        options: {
          spawn: false,
        }
      },

      livereload: {
        options: {
          livereload: 35729
        },
        files: [
          '.tmp/*',
        ]
      }
    },

    connect: {
      options: {
        port: 9000,
        livereload: 35729,
        hostname: '0.0.0.0'
      },

      livereload: {
        options: {
          open: true,
          base: [
            '.tmp/'
          ]
        }
      }
    },

    concat: {
      dist: {
        files: {
          '_site/js/main.js': [
            'bower_components/angular/angular.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/soundmanager2/script/soundmanager2-jsmin.js',
            'src/js/**/*.js'
          ],
          '_site/css/main.css': [
            'src/css/*.css'
          ]
        }
      },

      server: {
        files: {
          '.tmp/js/main.js': [
            'bower_components/angular/angular.js',
            'bower_components/angular-animate/angular-animate.js',
            'bower_components/soundmanager2/script/soundmanager2-jsmin.js',
            'src/js/**/*.js'
          ],
          '.tmp/css/main.css': [
            'src/css/*.css'
          ]
        }
      }
    },

    autoprefixer: {
      dist: {
        src: '_site/css/main.css',
        dest: '_site/css/main.css'
      },

      server: {
        src: '.tmp/css/main.css',
        dest: '.tmp/css/main.css'
      }
    },

    cssmin: {
      dist: {
        src: '_site/css/main.css',
        dest: '_site/css/main.css'
      }
    },

    uglify: {
      dist: {
        src: '_site/js/main.js',
        dest: '_site/js/main.js'
      }
    },

    copy: {
      dist: {
        files: [
          {expand: true, cwd: 'src/', src: '*', dest: '_site/', filter: 'isFile'},
          {expand: true, flatten: true, cwd: 'src/assets', src: "**", dest: '_site/assets/', filter: 'isFile'},
          {expand: true, cwd: 'bower_components/soundmanager2', src: "swf/*swf", dest: '_site/assets/'}
        ]
      },

      server: {
        files: [
          {expand: true, cwd: 'src/', src: '*', dest: '.tmp/', filter: 'isFile'},
          {expand: true, flatten: true, cwd: 'src/assets', src: "**", dest: '.tmp/assets/', filter: 'isFile'},
          {expand: true, cwd: 'bower_components/soundmanager2', src: "swf/*swf", dest: '.tmp/assets/'}
        ]
      }
    }
  });

  // load grunt packages
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // define command-line arguments
  grunt.registerTask('build', ['concat:dist', 'autoprefixer:dist', 'uglify', 'cssmin', 'copy:dist']);
  grunt.registerTask('serve', ['concat:server', 'autoprefixer:server', 'copy:server', 'connect:livereload', 'watch']);
  grunt.registerTask('default', ['build']);
};
