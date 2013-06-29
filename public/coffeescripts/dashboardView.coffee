Funbrella.Messages = send: (message) ->
  console.log message
  message

Funbrella.addEl = (el, url, callback) ->
  loaded = null
  element = document.createElement(el)
  element.type = "text/javascript"  if el is "script"
  element.onload = ->
    loaded = true
    callback()

  setTimeout (->
    callback true  unless loaded?
  ), 2000
  element.src = url
  document.getElementsByTagName("body")[0].appendChild element

Funbrella.BoardView = Backbone.View.extend(
  initialize: (options) ->
    @socket = options.board
    @collection = new Funbrella.Widgets()
    @collection.url = "/boards/" + options.board
    @collection.fetch success: =>
      @render()

  template: Hogan.compile("{{#board}}<div class=\"message-board\" id=\"message-board\"></div>{{#widgets}}<div class=\"widget {{name}}\" id=\"{{_id}}\">loading... it up...</div>{{/widgets}}{{/board}}")
  render: ->
    template = @template.render(board: @collection.toJSON())
    @$el.html template
    @runScript()

  runScript: ->
    console.log(@collection.at(0).toJSON());
    Funbrella.Messages = new Funbrella.messageBoard( model: @collection.at(0).toJSON(), el: '#message-board')
    @collection.toJSON()[0].widgets.forEach (widget, i) =>
      Funbrella.addEl "script", "/widgets/" + widget.name + "/script.js", (err) =>
        w = new Funbrella[widget.script](
          model: widget
          el: "#" + widget._id
        )
)
