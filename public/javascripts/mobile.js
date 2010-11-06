$(function () {
  new RememberIt();
});

var TABLE_KEY  = 'zILDwx';
var RememberIt = function () { this.initialize(); }; RememberIt.prototype = {
  initialize: function () {
    this.table = new Factual.V2.Core.Table(TABLE_KEY);
    this.query = {
      limit:   1,
      offset:  0,
      sort:    [
        {
          fieldId: 3672271,
          asc: false
        },
        {
          fieldId: 3672268,
          asc: true
        }
      ]
    };

    this.initHTML();
    this.registerEvents();
    this.loadFactualData();
  },

  initHTML: function () {
    this.$word      = $('#word');
    this.$dictcn    = $('#dictcn');
    this.$pron      = this.$dictcn.find('span:first');
    this.$audioIcon = this.$dictcn.find('img:first');
    this.$audio     = this.$dictcn.find('audio:first');
    this.$desc      = $('#desc');
    this.$example   = $('#example');
    this.$prev      = $('[role=button]').eq(0);
    this.$next      = $('[role=button]').eq(1);
  },

  registerEvents: function () {
    this.$prev.click((function (self) {
      return function (data) {
        self.prev();
      };
    })(this));
    this.$next.click((function (self) {
      return function (data) {
        self.next();
      };
    })(this));
    this.$audioIcon.click((function (self) {
      return function () {
        self.play();
      };
    })(this));

  },

  prev: function () {
    this.query.offset -= 1;

    if (this.query.offset < 0) {
      this.query.offset = 0;
      return;
    }

    this.loadFactualData();
  },

  next: function () {
    this.query.offset += 1;
    this.loadFactualData();
  },

  play: function () {
    this.$audio[0].load();
    this.$audio[0].play();
  },

  loadFactualData: function () {
    $.pageLoading();
    this.table.read(this.query, (function (self) {
      return function (factualData) {
        self.factualDataLoaded(factualData);
      };
    })(this));
  },

  factualDataLoaded: function (factualData) {
    var row          = factualData.getRow(0);
    this.factualData = {
      word:    row.getVal('idx', 1) || 'none',
      desc:    row.getVal('idx', 2) || 'none',
      example: row.getVal('idx', 3) || 'none'
    };

    if ($.trim(this.factualData.word).match(/^\w+$/)) {
      this.loadDictcnData();
    } else {
      this.dictcnDataLoaded();
    }
  },

  loadDictcnData: function () {
    $.get('/dictcn', { q:this.factualData.word }, (function (self) {
      return function (dictcnData) {
        self.dictcnDataLoaded(dictcnData);
      };
    })(this));
  },

  dictcnDataLoaded: function (dictcnData) {
    if (dictcnData) {
      var $data = $(dictcnData);
      this.$pron.text('/' + $data.find('pron').html() + '/');
      this.$audio.attr('src', $data.find('audio').html());
      this.$dictcn.show();
    } else {
      this.$dictcn.hide();
    }
    this.$word.text(this.factualData.word);
    this.$desc.text(this.factualData.desc);
    this.$example.text(this.factualData.example);
    $.pageLoading('DONE');
  }
};
