import gulp from 'gulp'

import { scripts } from './webpack'
import { gulptasks }  from './gulptasks'

export const dev   = gulp.task('dev',function (callback) {
  runSequence(gulptasks ,
              callback);
});
console.log(gulptasks);
export const build   = gulp.task('build',function (callback) {
  runSequence(scripts ,
              callback);
});


export default dev