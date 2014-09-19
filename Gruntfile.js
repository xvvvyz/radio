module.exports = function(grunt) {
  // 1. Define task specific options.
  grunt.initConfig({
    watch: {
      js: {
        files: ['src/js/**/*.js'],
        tasks: ['concat'],
        options: {
          spawn: false,
        },
      },

      css: {
        files: ['src/sass/**/*.scss'],
        tasks: ['sass', 'autoprefixer'],
        options: {
          spawn: false,
        }
      },

      copy: {
        files: ['src/*', 'src/assets/**'],
        tasks: ['copy'],
        options: {
          spawn: false,
        }
      }
    },

    concat: {
      dist: {
        src: [
          'bower_components/angular/angular.js',
          'bower_components/angular-animate/angular-animate.js',
          'bower_components/soundmanager2/script/soundmanager2-jsmin.js',
          'src/js/**/*.js'
        ],
        dest: '_site/js/main.js'
      }
    },

    uglify: {
      build: {
        src: '_site/js/main.js',
        dest: '_site/js/main.js'
      }
    },

    sass: {
      dist: {
        options: {
          style: 'compressed'
        },
        files: {
          '_site/css/main.css': 'src/sass/main.scss'
        }
      } 
    },

    autoprefixer: {
      no_dest: {
        src: '_site/css/main.css'
      }
    },

    copy: {
      main: {
        files: [
          {expand: true, cwd: 'src/', src: '*', dest: '_site/', filter: 'isFile'},
          {expand: true, flatten: true, cwd: 'src/assets', src: "**", dest: '_site/assets/', filter: 'isFile'},
          {expand: true, cwd: 'bower_components/soundmanager2', src: "swf/*swf", dest: '_site/assets/'}
        ]
      }
    }
  });

  // 2. Load grunt tasks.
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // 3. Define command-line arguments.
  grunt.registerTask('default', ['concat', 'uglify', 'sass', 'autoprefixer', 'copy']);
};
