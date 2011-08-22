// Copyright 2010 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Classes for Template Page
 *
 * 
 */

var gtv = gtv || {
  jq: {}
};

/**
 * TemplatePage class holds all the support for the page to work
 * and interact with javascript controls.
 * @constructor
 */
gtv.jq.TemplatePage = function() {
};

/**
 * Creates the Tooltip control.
 */
gtv.jq.TemplatePage.prototype.makeTooltip = function() {
  var templatePage = this;

  var styles = {
    containerClass: 'tooltip',
    leftDescClass: 'floatLeft',
    rightDescClass: 'floatRight'
  };

  var behaviors = {
    animate: false,
    hideTimeout: 2000,
    direction: 'down',
    glowColor: '#9bec1c',
    glowBlur: 25
  };

  var tooltipParms = {
    createParams: {
      containerId: 'tooltip-control-container',
      styles: styles
    },
    topParent: $('#tooltip-container'),
    behaviors: behaviors
  };

  templatePage.tooltipControl = new gtv.jq.Tooltip(tooltipParms);
};

/**
 * Creates the Progress Bar control.
 */
gtv.jq.TemplatePage.prototype.makeProgressBar = function() {
  var templatePage = this;

  templatePage.progressBar = new gtv.jq.VideoProgressBar();

  var styles = {
    container: 'statusbar',
    elapsedTime: 'elapsedTime',
    progressBack: 'progressbar',
    playProgress: 'progressTime',
    loadProgress: 'loadTime',
    duration: 'duration',
    tooltip: 'timeTooltip'
  };

  var callbacks = {
    onTimeSelected: function(seconds) {
      if (templatePage.videoControl) {
        templatePage.videoControl.playAt(seconds);
      }
    }
  };

  var progressParms = {
    createParams: {
      containerId: 'progressbar-control',
      styles: styles,
      callbacks: callbacks
    },
    topParent: $('#progress-container')
  };

  templatePage.progressBar.makeControl(progressParms);
};

/**
 * Creates the html 5 Video control.
 */
gtv.jq.TemplatePage.prototype.makeVideoControl = function() {
  var templatePage = this;

  function executeVideoCommand(selectedItem) {
    if (selectedItem) {
      var index = selectedItem.data('index');

      switch (index) {
        case 0:
          templatePage.previousVideo(true);
          break;
        case 1:
          templatePage.videoControl.rewind();
          break;
        case 2:
          templatePage.videoControl.playPause();
          break;
        case 3:
          templatePage.videoControl.fastForward();
          break;
        case 4:
          templatePage.nextVideo(true);
          break;
      }
    }
  };

  function highlightControl(item){
    if (item) {
      var selected = item.hasClass('video-command-selected');
      if (selected) {
        item.removeClass('video-command-selected');
      }
      item.addClass('video-command-highlighted');
      setTimeout(function(){
        if (selected) {
          item.addClass('video-command-selected');
        }
        item.removeClass('video-command-highlighted');
      }, 100);
    }
  };

  var styles = {
    video: 'video-control',
    container: 'video-control-container',
    commandSelected: 'video-command-selected',
  };

  var behaviors = {
    showControls: false,
    startFullScreen: true,
    isFullScreen: true,
    allowWindowStateChange: false,
    autoPlay: true
  };

  var callbacks = {
    onUserActivity: function() {
      templatePage.fadeControlsIn();
    },
    onMediaKey: function() {
      templatePage.fadeControlsIn(true);
    },
    timeUpdated: function() {
      templatePage.progressBar.setElapsedTime(templatePage.videoControl.getElapsedTime());
    },
    loaded: function() {
      templatePage.progressBar.setDuration(templatePage.videoControl.getDuration());
    },
    ended: function() {
      var playPauseItem = $('#playPause');
      playPauseItem.removeClass('video-command-paused');
      templatePage.progressBar.resetElapsedTime();
      templatePage.nextVideo(true);
    },
    stateChanged: function() {
      var playPauseItem = $('#playPause');
      if (templatePage.videoControl.getPaused()) {
        playPauseItem.removeClass('video-command-paused');
      } else {
        playPauseItem.addClass('video-command-paused');
      }
      highlightControl(playPauseItem);
    },
    onControlClicked: function(selectedItem) {
      executeVideoCommand(selectedItem);
      highlightControl(selectedItem);
    },
    onEnter: function(selectedItem) {
      executeVideoCommand(selectedItem);
      highlightControl(selectedItem);
    },
    onPrevious: function() {
      highlightControl($('#previous'));
      templatePage.previousVideo(true);
    },
    onRewind: function() {
      highlightControl($('#rewind'));
    },
    onFastForward: function() {
      highlightControl($('#fastForward'));
    },
    onNext: function() {
      highlightControl($('#next'));
      templatePage.nextVideo(true);
    },
    onDurationChanged: function() {
      templatePage.progressBar.setDuration(templatePage.videoControl.getDuration());
    },
    onLoadProgress: function() {
      templatePage.progressBar.setLoadedTime(templatePage.videoControl.getLoadedTime());
    }
  };

  var selectors = {
      videoCommand: '.video-command',
      videoCommandDiv: '.video-command-div',
      videoCommandsParent: '.video-commands-parent',
      fullScreenVideoCommandsParent: '.video-commands-parent'
  };

  var videoParms = {
    createParams: {
      containerId: 'video-container-div',
      styles: styles,
      selectors: selectors,
      keyController: templatePage.keyController,
      callbacks: callbacks
    },
    topParent: $('#video-container'),
    behaviors: behaviors
  };

  templatePage.videoControl = new gtv.jq.VideoControl();
  templatePage.videoControl.makeControl(videoParms);
};

/**
 * Selects next video
 * @parm {boolean} true if the video should start playing.
 */
gtv.jq.TemplatePage.prototype.nextVideo = function(play) {
  templatePage.carouselControl.selectNext(play);
};

/**
 * Selects previous video
 * @parm {boolean} true if the video should start playing.
 */
gtv.jq.TemplatePage.prototype.previousVideo = function(play) {
  templatePage.carouselControl.selectPrevious(play);
};

/**
 * Creates the main menu control.
 */
gtv.jq.TemplatePage.prototype.makeTabs = function() {
  var templatePage = this;

  var styles = {
    item: 'menu-option',
    itemDiv: 'menu-option-div',
    row: 'menu-row',
    chosen: 'menu-option-active',
    normal: 'menu-option-off',
    selected: 'menu-option-highlighted'
  };

  var navItems = [];
  if (!templatePage.data.categories)
        return;

    for (var i=0; i<templatePage.data.categories.length; i++) {
        navItems.push(templatePage.data.categories[i].name);
    }

  var behaviors = {
    orientation: 'horizontal',
    selectOnInit: true
  };

  var sidenavParms = {
    createParams: {
      containerId: 'mainMenu',
      styles: styles,
      keyController: templatePage.keyController,
      choiceCallback: function(selectedItem) {
        choiceCallback(selectedItem);
      },
      layerNames: [gtv.jq.VideoControl.fullScreenLayer]
    },
    behaviors: behaviors
  };

  templatePage.sideNavControl = new gtv.jq.SideNavControl(sidenavParms);

  var showParams = {
    topParent: $('#tabs'),
    contents: {
      items: navItems
    }
  };

  templatePage.sideNavControl.showControl(showParams);

  function choiceCallback(selectedItem) {
    templatePage.makeSlider(selectedItem.data('index'));
  }
};

/**
 * Creates the Carousel control.
 */
gtv.jq.TemplatePage.prototype.makeSlider = function(option) {
  var templatePage = this;

  if (templatePage.carouselControl) {
    templatePage.carouselControl.deleteControl();
  }

  var behaviors = {
    itemsToDisplay: 9,
    selectOnInit: true
  };

  var styleClasses = {
    itemDiv: 'thumbnails-item-div',
    item: '',
    normal: 'thumbnails-item',
    chosen: 'thumbnails-item-active',
    selected: 'thumbnails-item-highlighted'
  };

  var category = templatePage.data.categories[option];
  if (!category.videos || category.videos.length == 0) {
    return;
  }

  var items = [];
  for (var i=0; i<category.videos.length; i++) {
    var video = category.videos[i];

    var div = $('<div></div>')
      .addClass('slider-photo')
      .css('background', 'url(' + video.thumb + ')');

    var nowPlaying = $('<div></div>').addClass('now-playing-layer').html('Now playing');

    div.append(nowPlaying);

    items.push({
        content: div,
        data: video
      });
  }

  var callbacks = {
    onActivated: function(selectedItem) {
      choiceCallback(selectedItem);
    },
    onSelected: function(selectedItem) {
      if (templatePage.carouselControl.isVisible()) {
        var videoInfo = selectedItem.data('nav-data');
        templatePage.showTooltip(videoInfo, selectedItem);
      }
    },
    onBlur: function() {
      templatePage.tooltipControl.hide();
    },
    onBeforeScroll: function() {
      templatePage.tooltipControl.hide();
    }
  };

  var carouselParms = {
    createParams: {
      containerId: 'carousel-container',
      styles: styleClasses,
      keyController: templatePage.keyController,
      callbacks: callbacks,
      layerNames: [gtv.jq.VideoControl.fullScreenLayer]
    },
    behaviors: behaviors
  };

  templatePage.carouselControl = new gtv.jq.Carousel(carouselParms);

  var showParams = {
    topParent: $('#thumbnails'),
    items: items
  };

  templatePage.carouselControl.showControl(showParams);

  function choiceCallback(selectedItem) {
    if (!selectedItem) {
      return;
    }

    var videoInfo = selectedItem.data('nav-data');
    templatePage.progressBar.resetAll();
    templatePage.videoControl.showVideo(videoInfo);
    templatePage.updateFooter(videoInfo);
  }
};

/**
 * Shows the tooltip control for the selected video and shows it
 * relatively to the selected element.
 * @parm {Object} object holding the selected video information.
 * @parm {jQuery.Element} selected element
 */
gtv.jq.TemplatePage.prototype.showTooltip = function(videoInfo, selectedItem) {
  var templatePage = this;
  if (templatePage.tooltipControl) {
    templatePage.tooltipControl.show({
        title: videoInfo.title,
        subTitle: videoInfo.subtitle,
        descriptionLeft: videoInfo.description[0],
        descriptionRight: videoInfo.description[1]
      }, selectedItem);
  }
};

/**
 * Updates footer with the selected video information.
 * @parm {Object} object holding the selected video information.
 */
gtv.jq.TemplatePage.prototype.updateFooter = function(videoInfo) {
  $('#videoTitle').html(videoInfo.title);
  $('#videoSubtitle').html(videoInfo.subtitle);
};

/**
 * Starts controls fade timeout.
 */
gtv.jq.TemplatePage.prototype.startFadeTimeput = function() {
  var templatePage = this;

  if (templatePage.fadeTimeout) {
    window.clearTimeout(templatePage.fadeTimeout);
  }
  templatePage.fadeTimeout = window.setTimeout(function() {
      templatePage.fadeControlsOut();
    }, 4000);
};

/**
 * Fades controls into the screen.
 * @parm {boolean} true if only media media controls should be shown.
 */
gtv.jq.TemplatePage.prototype.fadeControlsIn = function(onlyControls) {
  var templatePage = this;

  if (!onlyControls) {
    $('#header').fadeIn(200, function() {
      templatePage.startFadeTimeput();
    });
  }
  $('#content').fadeIn(200, function() {
    templatePage.startFadeTimeput();
  });
};

/**
 * Fades controls out from the screen.
 */
gtv.jq.TemplatePage.prototype.fadeControlsOut = function() {
  var templatePage = this;

  $('#header').fadeOut(2000, function() {});
  $('#content').fadeOut(2000, function() {});
  $(templatePage.tooltipControl.holder).fadeOut(2000, function() {});
  templatePage.progressBar.hideTimeTooltip();
};

/**
 * Instanciates data from the data provider.
 */
gtv.jq.TemplatePage.prototype.instanciateData = function() {
  var templatePage = this;

  templatePage.dataProvider = new gtv.jq.DataProvider();
  templatePage.data = templatePage.dataProvider.getData();
};

/**
 * Zooms the page to fit the screen.
 */
gtv.jq.TemplatePage.prototype.doPageZoom = function() {
  var templatePage = this;

  $(document.body).css('zoom', $(window).width()/1280);
};

/**
 * Preloads images.
 */
gtv.jq.TemplatePage.prototype.preloadImages = function() {
  var images = ['images/tooltipTime-big.png'];
  gtv.jq.GtvCore.preloadImages(images);
};

/**
 * Starts the template page.
 */
gtv.jq.TemplatePage.prototype.start = function() {
  var templatePage = this;

  templatePage.keyController = new gtv.jq.KeyController();

  templatePage.preloadImages();

  templatePage.doPageZoom();

  templatePage.instanciateData();
  templatePage.makeTooltip();
  templatePage.makeProgressBar();
  templatePage.makeVideoControl();
  templatePage.makeTabs();

  templatePage.startFadeTimeput();

  $(document.body).css('visibility', '');

  templatePage.keyController.start(null,
                                   false,
                                   gtv.jq.VideoControl.fullScreenLayer);
};

var templatePage = new gtv.jq.TemplatePage();
templatePage.start();
