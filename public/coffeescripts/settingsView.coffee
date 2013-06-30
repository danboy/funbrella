Funbrella.SettingsView = Backbone.View.extend(
  events:
    'click .watcher a': 'toggleWatcher'
  initialize: (options)->
    @setMenu()
    @initializeWatchers(options)
    $('.widget-list-item').draggable(
      revert: true
      helper: 'clone'
      appendTo: 'body'
    )
    @setDropTarget()
    if ( $.cookie('settings') == "true" )
      @toggleSettings()
  initializeWatchers: (data)->
    watchers = data.watchers.forEach (watcher)=>
      console.log data
    @render data
  setDropTarget: ()->
    $('.settings-widget').droppable(
      drop: (e,ui)=>
        @updateWidget(e, ui)
    )
  updateWidget: (e, ui)->
    widget = $.extend $(ui.draggable[0]).data('widget'), $(e.target).data('widget')
    document = new Funbrella.Widget
    document.save widget,
      success:  ()->
        document.reload()
      error:    ()->
        console.log 'error'

  setMenu: ->
    menu = $('<menu/>',{text: '\u2217', 'class': 'settings-menu'})
    $('body').append(menu)
    menu.click =>
      @toggleSettings()
  template: JST['settings']
  toggleSettings: ->
    $('#settings').toggle()
    if $.cookie('settings') == 'true' then $.cookie('settings', false, { expires: 7 }) else $.cookie('settings', true, { expires: 7 })
  toggleWatcher: (e)->
    console.log 'toggle', e
  render: (data)->
    settings = @template.render data
    @$el.html(settings)
)
