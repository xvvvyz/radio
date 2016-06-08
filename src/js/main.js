angular.module('lineradio', ['ngAnimate'])
  .controller('MainController', ['$scope', '$http', function($scope, $http) {
    $scope.initApp = function() {
      initApp($scope, $http);
    };

    $scope.getTags = function() {
      getTags($scope, $http);
    };

    $scope.queryApi = function() {
      var newLen = $scope.query.length;
      $scope.queryDup = $scope.query;

      if (newLen > 1 && newLen <= 40 && newLen >= $scope.oldLen) {
        $scope.loader = 1;

        prefer($scope, "none");
        autocomplete($scope, $http);

        $scope.status = 'waiting...';
      }

      $scope.oldLen = newLen;
    };

    $scope.findTheMix = function() {
      findTheMix($scope, $http, 0, 0);
    };

    $scope.loadTag = function() {
      loadTag($scope, $http, $scope.query, encodeURIComponent($scope.queryEncode.replace(/ /g, '_')), 0);
      autocomplete($scope, $http, true);
    };

    $scope.loadArtist = function() {
      loadArtist($scope, $http, $scope.query);
    };

    $scope.togglePlay = function() {
      if ($scope.playToggle === 1) {
        soundManager.pause('track');
        $scope.playToggle = 0;
      } else if ($scope.playToggle === 0) {
        soundManager.resume('track');
        $scope.playToggle = 1;
      } else {
        soundManager.play('track');
        $scope.playToggle = 1;
      }
    };

    $scope.nextSong = function() {
      nextSong($scope, $http, $scope.mixId);
    };
  }]);

// ################ MAIN

function initApp($scope, $http) {
  $scope.apiKey = '1dce5b8108f82a99ac4cb482fbd6fa96b9cfbec2';

  /* set starting tag page */
  $scope.tagPage = 1;

  /* check if touch screen and stuff */
  if (isTouch()) {
    $scope.playToggle = false;
    document.getElementById('body').className = '';
  } else {
    $scope.playToggle = 1;
  }

  soundManager.setup({
    url: 'assets/swf/',
      flashVersion: 9,
      useHTML5Audio: true,
      preferFlash: true,
      debugMode: false,
      waitForWindowLoad: true,
      defaultOptions: {
        autoLoad: false,
        autoPlay: true,
        volume: 80
      },
      flash9Options: {
        isMovieStar: true
      }
  });

  getPlayToken($scope, $http);
  getTags($scope, $http);
  loadFromUrl($scope, $http);
}

function prefer($scope, type) {
  $scope.preferTag = 0;
  $scope.preferArtist = 0;

  if (type == "artist")
    $scope.preferArtist = 1;
  else if (type == "tag")
    $scope.preferTag = 1;
}

function getPlayToken($scope, $http) {
  $http.get('https://8tracks.com/sets/new.json?api_version=3&api_key='+$scope.apiKey).success(function(data) {
    $scope.playToken = data['play_token'];
  }).error(function(data, status, headers, config) {
    eightError($scope, data['status']);
  })
}

function getTags($scope, $http) {
  var page = $scope.tagPage;
  var perPage = 60;

  $http.get('https://8tracks.com/tags.json?per_page='+perPage+'&page='+page+'&api_version=3&api_key='+$scope.apiKey).success(function(data) {
    if (page == 1) {
      $scope.popularCloud = data['tag_cloud']['tags'];
    } else {
      $scope.popularCloud = $scope.popularCloud.concat(data['tag_cloud']['tags']);
    }
  }).error(function(data, status, headers, config) {
    eightError($scope, data['status']);
  })

  $scope.tagPage++;
}

function loadFromUrl($scope, $http) {
  /* set checkboxes and query text based
     on url fragment then load the results */
  var urlFragment = decodeURIComponent(window.location.hash.substr(2));
  var urlArray = urlFragment.split('/');
  var urlLen = urlArray[0].length;
  var secondParam = typeof(urlArray[1]) != 'undefined';

  if (urlLen > 0) {
    if (urlLen > 1) {
      $scope.status = 'loading...';
      loading($scope);
    }

    setTimeout(function() {
      if (urlArray[0] === 'artist') {
        if (secondParam) {
          $scope.query = urlArray[1];
          prefer($scope, "artist");

          if (urlLen > 1) {
            autocomplete($scope, $http);
          }
        } else {
          $scope.query = urlArray[0];
        }
      } else if (urlArray[0] === 'tag') {
        if (secondParam) {
          $scope.query = urlArray[1];
          prefer($scope, "tag");

          if (urlLen > 1) {
            autocomplete($scope, $http);
          }
        } else {
          $scope.query = urlArray[0];
        }
      } else {
        $scope.query = urlFragment;

        if (urlLen > 1) {
          autocomplete($scope, $http);
        }
      }
    }, 500);
  }
}

function setWindowLocation($scope) {
  if ($scope.preferArtist) {
    window.location.hash = '/artist/'+$scope.query;
  } else if ($scope.preferTag) {
    window.location.hash = '/tag/'+$scope.query;
  } else {
    window.location.hash = '/'+$scope.query;
  }
}

function loadArtist($scope, $http, name) {
  loading($scope);
  $scope.status = name;

  $http.get('https://8tracks.com/mix_sets/artist:'+encodeURIComponent(name.replace(/ /g, '_'))+'.json?api_version=3&include=mixes&sort=popular&per_page=100&api_key='+$scope.apiKey).success(function(data) {
    if (getRandomMix($scope, data['mix_set'])) {
      nextSong($scope, $http, $scope.mixId);
      prefer($scope, "artist");
    } else {
      findTheMix($scope, $http, 2, 0);
    }
  }).error(function(data, status, headers, config) {
    eightError($scope, data['status']);
  })
}

function loadTag($scope, $http, query, queryEncode, recursionCount) {
  loading($scope);
  $scope.status = query;

  $http.get('https://8tracks.com/mix_sets/'+queryEncode+'.json?api_version=3&include=mixes&sort=popular&per_page=100&api_key='+$scope.apiKey).success(function(data) {
    if (getRandomMix($scope, data['mix_set'])) {
      nextSong($scope, $http, $scope.mixId);
      prefer($scope, "tag");
    } else {
      if (recursionCount == 1) {
        findTheMix($scope, $http, 1, recursionCount);
      } else {
        findTheMix($scope, $http, 3, recursionCount);
      }
    }
  }).error(function(data, status, headers, config) {
    eightError($scope, data['status']);
  })
}

function loadMix($scope, $http, name, recursionCount) {
  loading($scope);
  $scope.status = 'mix: '+name;

  $http.get('https://8tracks.com/mix_sets/mixes:'+encodeURIComponent(name.replace(/ /g, '+'))+'.json?api_version=3&include=mixes&sort=popular&per_page=100&api_key='+$scope.apiKey).success(function(data) {
    if (getRandomMix($scope, data['mix_set'])) {
      nextSong($scope, $http, $scope.mixId);
    } else {
      if (recursionCount == 1) {
        findTheMix($scope, $http, 1, recursionCount);
      } else {
        findTheMix($scope, $http, 3, recursionCount);
      }
    }
  }).error(function(data, status, headers, config) {
    eightError($scope, data['status']);
  })
}

function loadSimilar($scope, $http, mixId) {
  $http.get('https://8tracks.com/mix_sets/similar:'+mixId+'.json?api_version=3&include=mixes&per_page=10&api_key='+$scope.apiKey).success(function(data) {
    if (getRandomMix($scope, data['mix_set'])) {
      nextSong($scope, $http, $scope.mixId);
    } else {
      findTheMix($scope, $http, 0, 0, mixId);
    }
  }).error(function(data, status, headers, config) {
    eightError($scope, data['status']);
  })
}

function uniqName(origArr) {
  var newArr = [],
  origLen = origArr.length,
  found, x, y;

  for (x = 0; x < origLen; x++) {
    found = undefined;

    for (y = 0; y < newArr.length; y++) {
      if (origArr[x]['name'] === newArr[y]['name']) {
        found = true;
        break;
      }
    }

    if (!found) {
      newArr.push(origArr[x]);
    }
  }

  return newArr;
}

function autocomplete($scope, $http, noMix) {
  if ($scope.query.length > 1) {
    $http.get('https://8tracks.com/search/autocomplete.json?q='+$scope.query+'&types%5B%5D=mtags&types%5B%5D=artists&api_key='+$scope.apiKey).success(function(data) {

      if (data['mtags']) {
        $scope.tagCloud = uniqName(data['mtags']);
        findTheMix($scope, $http, 0, 0);
      } else {
        delete $scope.tagCloud;
        $scope.status = 'nothing was found.';
        $scope.loader = 0;
      }
    }).error(function(data, status, headers, config) {
      eightError($scope, data['status']);
    })
  }
}

function findTheMix($scope, $http, section, recursionCount) {
  loading($scope);

  if ($scope.query.length > 1) {
    recursionCount++;

    if (section == 0) {
      if ($scope.preferArtist) {
        section = 1;
      } else if ($scope.preferTag) {
        section = 2;
      } else {
        section = Math.floor(Math.random() * 2) + 1;
      }
    }

    if (section == 1) {
      if (typeof $scope.artistCloud !== 'undefined') {
        loadArtist($scope, $http, $scope.artistCloud[0]['name']);
      } else {
        loadArtist($scope, $http, $scope.query);
      }
    } else if (section == 2) {
      if (typeof $scope.tagCloud !== 'undefined') {
        loadTag($scope, $http, $scope.tagCloud[0]['name'], $scope.tagCloud[0]['mix_set']['smart_id'], recursionCount);
      } else {
        loadTag($scope, $http, $scope.query, $scope.queryEncode, recursionCount);
      }
    } else if (section == 3) {
      loadMix($scope, $http, getRandomMix($scope, data, 1), recursionCount);
    } else if (!$scope.artistCloud) {
      if (section == 1) {
        section = 2;
      }
    } else if (!$scope.tagCloud) {
      if (section == 2) {
        if (recursionCount == 1 && $scope.artistCloud) {
          section = 1;
        } else {
          section = 3;
        }
      }
    } else if (section == 3 && !$scope.mixCloud) {
      $scope.loader = 0;
      section = 4;
    }

  } else {
    $scope.status = 'nope.';
    $scope.loader = 0;
  }
}

function nextSong($scope, $http, mixId) {
  $scope.loader = 1;
  setWindowLocation($scope);

  if ($scope.atLastTrack == true || $scope.skipAllowed == false) {
    delete $scope.atLastTrack;
    delete $scope.skipAllowed;
    loadSimilar($scope, $http, mixId);
  } else {
    $http.get('https://8tracks.com/sets/'+$scope.playToken+'/next.json?api_version=3&mix_id='+mixId+'&api_key='+$scope.apiKey).success(function(data) {
      $scope.track = data['set']['track'];
      $scope.atLastTrack = data['set']['at_last_track'];
      $scope.skipAllowed = data['set']['skip_allowed'];

      var url = data['set']['track']['track_file_stream_url'];
      var track = soundManager.getSoundById('track');

      if (typeof(track) != 'undefined') {
        track.destruct();
      }

      soundManager.createSound({
        id: 'track',
        url: url,
        whileplaying: function() {
          document.getElementById('track_position').style.width = ((this.position/this.durationEstimate) * 100) + '%';
          document.getElementById('track_downloaded').style.width = ((this.bytesLoaded/this.bytesTotal) * 100) + '%';
        },
        onfinish: function() {
          nextSong($scope, $http, mixId);
        }
      });

      var track = soundManager.getSoundById('track');

      track.onPosition(30000, function() {
        $http.get('https://8tracks.com/sets/'+$scope.playToken+'/report.json?track_id='+data['set']['track']['id']+'&mix_id='+mixId+'&api_key='+$scope.apiKey);
      });

      /* if not good to go don't go */
      if ($scope.playToggle !== false) {
        $scope.playToggle = 1;
      } else {
        soundManager.pause('track');
      }

      setTimeout(function () {
        if (track.readyState == 2) {
          nextSong($scope, $http, mixId);
        }
      }, 1500);

      $scope.loader = 0;

      // set window title to song and artist
      window.document.title = data['set']['track']['name']+' by '+data['set']['track']['performer'];

    }).error(function(data, status, headers, config) {
      eightError($scope, data['status']);
      findTheMix($scope, $http, 0, 0, mixId);
    })
  }
}

function getRandomMix($scope, data, fromAC) {
  if (!data['mixes'].length > 0) return 0;

  var i = Math.floor(Math.random()*data['mixes'].length);

  $scope.mixId = data['mixes'][i]['id'];
  $scope.mixName = data['mixes'][i]['name'];
  $scope.mixPath = 'https://8tracks.com'+data['mixes'][i]['path'];

  if (fromAC == 1) {
    $scope.mixArt = data['mixes'][i]['data']['original_imgix_url']+'&w=100&h=100';
  } else {
    $scope.mixArt = data['mixes'][i]['cover_urls']['sq100'];
  }

  return $scope.mixId;
}

function loading($scope) {
  $scope.loader = 1;
}

function eightError($scope, status) {
  $scope.status = status;
  $scope.loader = 0;
}

function isTouch() {
  if (('ontouchstart' in window)
    || (navigator.MaxTouchPoints > 0)
    || (navigator.msMaxTouchPoints > 0)) {
    return true;
  } else {
    return false;
  }
}
