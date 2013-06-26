Funbrella.SettingsView = Backbone.View.extend({
  initialize: function(options){
    this.board = JSON.parse(options.board);
    this.model = new Funbrella.Widget(options.model)
    this.collection = new Funbrella.Widgets(options.collection);
    this.runningWatchers = [];
    this.watchers = watchers;
    this.initializeWatcherList(options.watchers, options.collection);
    $(document).bind('keyup', this.toggleView);
    $('#watchers').toggleClass('watcher-show')
    window.settings = this;
  }
, events: {
    'click .watcher a': 'toggleWatcher'
  }
, toggleWatcher: function(e){
    var data = $(e.currentTarget).data('watcher');
    if(data.id){
      this.updateWatcher(data);
    }else{
      this.createWatcher(data,e);
    }
  }
, updateWatcher: function(data){
    var watcher = this.collection.get(data.id);
    var enabled = (data.enabled) ? false : true;
    watcher.set('enabled', enabled);
    watcher.save();
    this.updateBoard(watcher);
}
, createWatcher: function(data,e){
    var watcher = new Funbrella.Widget(data);
    watcher.save(null,{success: function(r,s){
      r.set('enabled', true);
      r.set('id', r.get('_id'));
      $(e.currentTarget).data('watcher', r.toJSON())
      this.collection.add(r)
      this.updateBoard(r);
    }.bind(this)});
  }
, updateBoard: function(watcher){
    this.board.watchers = this.collection.map(function(watcher){return watcher.id});
    this.board.widgets = this.board.widgets.map(function(w){return w._id});
    var self = this;
    $.ajax(document.location.href,{
      data: self.board
    , type: 'PUT'
    , success: function(s){
        console.log(s);
      }
    });
  }
, toggleView: function(e){
    if(e.ctrlKey == true && e.which == 32){
      $('#watchers').toggleClass('watcher-show')
    }
  }
, template: JST['watchers']
, initializeWatcherList: function(allWatchers, boardsWatchers){
    allWatchers.forEach(function(watcher, index){
      if(boardsWatchers.indexOf(watcher.name) != -1){
        allWatchers[index].enabled = true;
        allWatchers[index].id = boardsWatchers
        this.startWatcher(watcher);
      }
    });
    console.log(allWatchers, boardsWatchers);
    this.render({watchers: allWatchers});
  }
, startWatcher: function(watcher){
    this.runningWatchers[watcher.script] = new Funbrella.Watch[watcher.script]({model: watcher});
    document.getElementsByTagName("body")[0].appendChild($("<link/>", {rel: 'stylesheet', href: '/widgets/'+watcher.name+'/css/style.css' })[0]);
  }
, render: function(data){
    var template = this.template.render(data)
    this.$el.append(template)
    $('#watchers').toggleClass('watcher-show')
  }
});
