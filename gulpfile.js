var gulp = require('gulp');
var jest = require('gulp-jest');

gulp.task('default', function() {
  // place code for your default task here
});

gulp.task('jest', function () {
    return gulp.src('specs').pipe(jest({
        scriptPreprocessor: "./support/preprocessor.js",
        unmockedModulePathPatterns: [
            "node_modules/react"
        ],
        testDirectoryName: "specs",
        testPathIgnorePatterns: [
            "node_modules",
            "specs/support"
        ],
        moduleFileExtensions: [
            "js",
            "json",
            "react",
            "jsx"
        ]
    }));
});

gulp.task('jest-watch', function() {
	gulp.watch(['specs/**/*.js', 'app/components/**/*'], ['jest']);
});