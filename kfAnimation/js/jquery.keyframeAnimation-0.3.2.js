/* ======================================== *
   jQuery Keyframe Animation
    - version 0.2.0
   Copyright 2009 Noah Burney
   Released under the MIT and GPL licenses.
 * ======================================== */

(function($){
  // Extend the jQuery prototype
  $.fn.keyframe = function(){
    // Return jQuery object if no options
    if (arguments.length == 0) return this;
    // Store reference to self
    var _ = this,
        args = Array.prototype.slice.call(arguments),
        // List of keyframes
        anim = args[0],
		options = args[1] || {},
        // Capture easing option
        default_easing = options.ease || 'linear',
		fps = options.ease || 24,
        // Stores object keys in numerical order
        keys = [], key_len,
        // Stores various animations to be executed
        queue = [], undefined;
    
    // Grap all the object key names
    for (var k in anim)
      keys.push(
        // Allow use of 'start' instead of 0
        (k == 'start') ? 0 : parseInt(k)
      );
    // Sort the object's key names in numerical ascending order
    keys.sort( function(a,b){
      return (a < b)? -1 : 1;
    } );
    
    // Loop through all the keyframes, and build of queue of animations
    for (var n=0, l=keys.length; n < l; n++) (function(n){
      var time = keys[n], // End-time
          last_time = (n > 0)? keys[n-1] : 0, // Previous end-time
          length = time - last_time; // Minimum duration of animation
      
      // If the time is 0 don't animate, just set it
      if (time == 0)
        _.css(anim['start'] || anim[0]);
      
      // If this is the first non-zero keyframe, just queue up whatever
      // is listed, instead of all the brouhaha below
      else if ((n == 0) || (last_time == 0))
        queue.push( {
          start: 0,
          end:time * fps,
          style:anim[time],
          easing: default_easing
        } );
      
      // Otherwise, go through each of this keyframe's properties, building
      // up the necessary animation(s)
      else {
        // Hold potential animations for this keyframe
        var batch = {};
        // Loop through keyframe's declared properties
        for (var prop in anim[time]) {
          var prev = 0, n = queue.length,
              easing = default_easing,
              value = anim[time][prop];
              
          // If value is an array with easing, adjust stuff accordingly
          if (value.constructor.toString().match(/Array/)) {
            easing = value[1];
            value = value[0];
          }
          // Find the last time this property was specified, default to 0
          while (n--) {
            if (queue[n]['style'][prop] != undefined) {
              prev = queue[n].end;
              break;
            }
          }
          // Combine animations with same time and easing, else make a new one
          var batch_name = prev + '-' + easing;
          if (batch[batch_name] === undefined)
            batch[batch_name] = {
              start: prev,
              end: time * fps,
              style: {},
              easing: easing
            };
          // Add in property
          batch[batch_name]['style'][prop] = value;
        }
        
        // Add all animations from current batch in to queue
        for (var a in batch)
          queue.push( batch[a] );
      }
    })(n);
    
    // Loop through queue of animations, and invoke them all
    // using jQuery's built-in `animate`, and `setTimeout`
    for (var n=0, l=queue.length; n < l; n++) (function(n){
      var anim = queue[n];
      setTimeout( function(){
        _.animate(anim.style, { duration: (anim.end - anim.start), easing: anim.easing, queue: false });
      }, anim.start);
    })(n);
    
    // Return the jQuery object for hardcore chaingangin' action
    return this;
  };
})(jQuery);