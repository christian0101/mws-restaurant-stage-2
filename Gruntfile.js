/*
 After you have changed the settings under responsive_images
 run this with one of these options:
  "grunt" alone creates a new, completed images directory
  "grunt clean" removes the images directory
  "grunt responsive_images" re-processes images without removing the old ones
*/

module.exports = function(grunt) {

  grunt.initConfig({
    responsive_images: {
      dev: {
        options: {
          engine: 'im',
          sizes: [{
            /* Change these */
            width: 1600,
            suffix: '_large_2x',
            quality: 85
          },{
            /* Change these */
            width: 800,
            suffix: '_small_1x',
            quality: 60
          },{
            /* Change these */
            width: 500,
            suffix: '_medium',
            quality: 80
          }]
        },

        /*
        You don't need to change this part if you don't change
        the directory structure.
        */
        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'public/img/',
          dest: 'public/newImgs/'
        }]
      }
    },

    resize_crop: {
      dev: {
        options: {
          gravity: "center",
          format: "jpg",
          width: 250
        },

        files: {
          "public/newImgs" : ['public/img/*.{gif,jpg,png}'],
        },
      }
    },

    blurred_images: {
      dev: {
        options: {
          engine: 'im',
          levels: [{
            name: 'low',
            level: 40,
            quality: 20
          }]
        },

        files: [{
          expand: true,
          src: ['*.{gif,jpg,png}'],
          cwd: 'public/img/',
          dest: 'public/newImgs/'
        }]
      }
    },

    /* Clear out the images directory if it exists */
    clean: {
      dev: {
        src: ['public/newImgs'],
      },
    },

    /* Generate the images directory if it is missing */
    mkdir: {
      dev: {
        options: {
          create: ['public/newImgs']
        },
      },
    },

  });

  grunt.loadNpmTasks('grunt-responsive-images');
  grunt.loadNpmTasks('grunt-resize-crop');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-blurred-images');
  grunt.registerTask('default', ['clean', 'mkdir', 'responsive_images', 'blurred_images','resize_crop']);

};
