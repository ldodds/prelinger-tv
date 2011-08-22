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
 * @fileoverview Classes for DataProvider
 *
 * 
 */

var gtv = gtv || {
  jq: {}
};

/**
 * DataProvider class. Defines a provider for all data (Categories, Images & Videos) shown in the template.
 */
gtv.jq.DataProvider = function() {
};

/**
 * Returns all data shown in the template..
 * @return {object} with the following structure:
 *    - categories -> [category1, category2, ..., categoryN].
 *    - category -> {name, videos}.
 *    - videos -> {thumb, title, subtitle, description, sources}
 *    - sources -> [source1, source2, ..., sourceN]
 *    - source -> string with the url | {src, type, codecs}
 */
gtv.jq.DataProvider.prototype.getData = function() {
  function getRandom(max) {
    return Math.floor(Math.random() * max);
  }

  var categories = [
    'Test'];

  var sources = [
    {
      src: 'http://www.archive.org/download/Alchemis1940_2/Alchemis1940_2_512kb.mp4',
      title: 'Prelinger',
      desc: 'Prelinger'
    }  
  ];

  var data = {
    categories: []
  };

  for (var i=0; i<categories.length; i++) {
    var category = {
      name: categories[i],
      videos: []
    };

    for (var j=0; j<5; j++) {
      var videoInfo = sources[getRandom(sources.length)];
      var video = {
        thumb: 'http://www.archive.org/download/AlwaysTo1941_3/AlwaysTo1941_3.thumbs/AlwaysTo1941_3_001140.jpg',
        title: videoInfo.title,
        subtitle: videoInfo.desc,
        description: [],
        sources: [videoInfo.src]
      };
      category.videos.push(video);
    }

    data.categories.push(category);
  }

  return data;
};

