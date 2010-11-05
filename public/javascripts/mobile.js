$FL.$(function () {
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
    this.read();
  },

  initHTML: function () {
    this.$word    = $FL.$('#word');
    this.$desc    = $FL.$('#desc');
    this.$example = $FL.$('#example');

    this.$prev    = $FL.$('[role=button]').eq(0);
    this.$next    = $FL.$('[role=button]').eq(1);
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
  },

  prev: function () {
    this.query.offset -= 1;

    if (this.query.offset < 0) {
      this.query.offset = 0;
      return;
    }

    this.read();
  },

  next: function () {
    this.query.offset += 1;
    this.read();
  },

  read: function () {
    $.pageLoading();
    this.table.read(this.query, (function (self) {
      return function (data) {
        self.loaded(data);
      };
    })(this));
  },

  loaded: function (data) {
    var row = data.getRow(0);
    this.$word.text(row.getVal('idx', 1) || 'none');
    this.$desc.text(row.getVal('idx', 2) || 'none');
    this.$example.text(row.getVal('idx', 3) || 'none');
    $.pageLoading('DONE');
  }
};
